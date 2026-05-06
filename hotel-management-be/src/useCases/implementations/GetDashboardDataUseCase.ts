import { dashboardRepository } from "../../repository/index.js";

export interface GetDashboardDataInput {
  revenueStartDate: Date;
  revenueEndDate: Date;
}

export interface GetDashboardDataOutput {
  summary: {
    totalRevenue: number;
    totalBookings: number;
    totalCustomers: number;
    activeRentals: number;
  };
  revenueStats: { date: Date; amount: number }[];
  roomOccupancy: { status: string; count: number }[];
  topServices: { name: string; count: number; revenue: number }[];
}


export const getDashboardData = {
  execute: async (input: GetDashboardDataInput): Promise<GetDashboardDataOutput> => {
    const [summary, revenueStats, roomOccupancy, topServices] = await Promise.all([
      dashboardRepository.getSummary(),
      dashboardRepository.getRevenueByRange(input.revenueStartDate, input.revenueEndDate),
      dashboardRepository.getRoomStatusCounts(),
      dashboardRepository.getTopServices(5),
    ]);

    return {
      summary,
      revenueStats,
      roomOccupancy,
      topServices,
    };
  },
};
