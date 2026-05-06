import type { IDashboardRepository, RevenueStats, RoomOccupancyStats, SummaryStats } from "../../types/IDashboardRepository.js";

const dashboardRepositoryMock: IDashboardRepository = {
  getRevenueByRange: async () => [],
  getRoomStatusCounts: async () => [],
  getSummary: async () => ({
    totalRevenue: 0,
    totalBookings: 0,
    totalCustomers: 0,
    activeRentals: 0,
  }),
  getTopServices: async () => [],
};

export default dashboardRepositoryMock;
