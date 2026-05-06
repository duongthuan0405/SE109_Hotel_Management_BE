export type RevenueStats = {
  date: string;
  amount: number;
};

export type RoomOccupancyStats = {
  status: string;
  count: number;
};

export type SummaryStats = {
  totalRevenue: number;
  totalBookings: number;
  totalCustomers: number;
  activeRentals: number;
};

export interface IDashboardRepository {
  getRevenueByRange(startDate: Date, endDate: Date): Promise<RevenueStats[]>;
  getRoomStatusCounts(): Promise<RoomOccupancyStats[]>;
  getSummary(): Promise<SummaryStats>;
  getTopServices(limit: number): Promise<{ name: string; count: number; revenue: number }[]>;
}
