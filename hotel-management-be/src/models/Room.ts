export type RoomStatus = 'Available' | 'Occupied' | 'Maintenance' | 'Reserved' | 'Cleaning';

export type Room = {
  id: string;
  roomNumber: string; // MaPhong
  roomTypeId: string; // ID của LoaiPhong
  price: number; // GiaPhong
  status: RoomStatus;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
};
