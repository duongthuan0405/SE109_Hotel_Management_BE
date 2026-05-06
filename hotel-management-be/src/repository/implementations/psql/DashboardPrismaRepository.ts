import type { IDashboardRepository, RevenueStats, RoomOccupancyStats, SummaryStats } from "../../types/IDashboardRepository.js";
import prisma from "../../../config/prisma.js";

const dashboardPrismaRepository: IDashboardRepository = {
  getRevenueByRange: async (startDate: Date, endDate: Date): Promise<RevenueStats[]> => {
    const invoices = await prisma.invoice.findMany({
      where: {
        invoiceDate: {
          gte: startDate,
          lte: endDate,
        },
        paymentStatus: "Paid",
      },
      select: {
        invoiceDate: true,
        roomTotal: true,
        serviceTotal: true,
        surcharge: true,
        damageCharge: true,
      },
    });

    // Group by date in memory (for simplicity across DB providers)
    const statsMap = new Map<string, number>();
    invoices.forEach((inv) => {
      const dateStr = inv.invoiceDate.toISOString().split("T")[0] as string;
      const totalRevenue = inv.roomTotal + inv.serviceTotal + inv.surcharge + inv.damageCharge;
      statsMap.set(dateStr, (statsMap.get(dateStr) || 0) + totalRevenue);
    });

    return Array.from(statsMap.entries())
      .map(([date, amount]) => ({ date: date as string, amount: amount as number }))
      .sort((a, b) => a.date.localeCompare(b.date));
  },

  getRoomStatusCounts: async (): Promise<RoomOccupancyStats[]> => {
    const rooms = await prisma.room.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
    });

    return rooms.map((r) => ({
      status: r.status,
      count: r._count.id,
    }));
  },

  getSummary: async (): Promise<SummaryStats> => {
    const [revenueData, bookings, customers, activeRentals] = await Promise.all([
      prisma.invoice.aggregate({
        where: { paymentStatus: "Paid" },
        _sum: { 
          roomTotal: true,
          serviceTotal: true,
          surcharge: true,
          damageCharge: true
        },
      }),
      prisma.booking.count(),
      prisma.customer.count(),
      prisma.rentalSlip.count({
        where: { status: "CheckedIn" },
      }),
    ]);

    const totalRevenue = (revenueData._sum.roomTotal || 0) + 
                       (revenueData._sum.serviceTotal || 0) + 
                       (revenueData._sum.surcharge || 0) + 
                       (revenueData._sum.damageCharge || 0);

    return {
      totalRevenue,
      totalBookings: bookings,
      totalCustomers: customers,
      activeRentals: activeRentals,
    };
  },

  getTopServices: async (limit: number): Promise<{ name: string; count: number; revenue: number }[]> => {
    const serviceUsage = await prisma.serviceUsage.findMany({
      where: { status: "Completed" },
      include: {
        service: true,
      },
    });

    const statsMap = new Map<string, { count: number; revenue: number }>();
    serviceUsage.forEach((usage) => {
      const name = usage.service?.name || "Dịch vụ không xác định";
      const current = statsMap.get(name) || { count: 0, revenue: 0 };
      statsMap.set(name, {
        count: current.count + usage.quantity,
        revenue: current.revenue + usage.totalAmount,
      });
    });

    return Array.from(statsMap.entries())
      .map(([name, stats]) => ({ name: name as string, ...stats }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, limit);
  },
};

export default dashboardPrismaRepository;
