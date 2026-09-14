export type Role = 'ADMIN' | 'MANAGER' | 'DRIVER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Fleet {
  id: string;
  name: string;
  description: string;
}

export interface Vehicle {
  id: string;
  fleetId: string;
  plate: string;
  model: string;
  brand: string;
  year: number;
  fuelType: 'GASOLINA' | 'ETANOL' | 'DIESEL' | 'FLEX';
  averageConsumptionGoal: number; // km/l
  maintenanceDueDate: string;
}

export interface Supply {
  id: string;
  vehicleId: string;
  userId: string;
  date: string;
  liters: number;
  cost: number;
  odometer: number;
  fuelType: string;
  station: string;
}
