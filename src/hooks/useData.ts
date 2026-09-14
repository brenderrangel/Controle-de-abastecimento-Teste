import { useState, useEffect } from 'react';
import { Fleet, Vehicle, Supply, User } from '../types';

const INITIAL_FLEETS: Fleet[] = [
  { id: '1', name: 'Frota Matriz', description: 'Veículos da sede principal' },
  { id: '2', name: 'Frota Filial Sul', description: 'Veículos operacionais região sul' },
];

const INITIAL_VEHICLES: Vehicle[] = [
  { id: '1', fleetId: '1', plate: 'ABC-1234', brand: 'Toyota', model: 'Hilux', year: 2022, fuelType: 'DIESEL', averageConsumptionGoal: 10.5, maintenanceDueDate: '2026-10-15' },
  { id: '2', fleetId: '1', plate: 'XYZ-9876', brand: 'Volkswagen', model: 'Gol', year: 2020, fuelType: 'FLEX', averageConsumptionGoal: 12.0, maintenanceDueDate: '2026-09-20' },
  { id: '3', fleetId: '2', plate: 'QWE-4567', brand: 'Fiat', model: 'Strada', year: 2023, fuelType: 'FLEX', averageConsumptionGoal: 11.5, maintenanceDueDate: '2026-12-01' },
];

const INITIAL_SUPPLIES: Supply[] = [
  { id: '1', vehicleId: '1', userId: '1', date: '2026-09-01T08:00:00Z', liters: 50, cost: 290.50, odometer: 45000, fuelType: 'DIESEL', station: 'Posto Central' },
  { id: '2', vehicleId: '2', userId: '1', date: '2026-09-05T10:30:00Z', liters: 40, cost: 220.00, odometer: 32000, fuelType: 'GASOLINA', station: 'Posto Esquina' },
  { id: '3', vehicleId: '1', userId: '1', date: '2026-09-10T14:15:00Z', liters: 45, cost: 265.50, odometer: 45450, fuelType: 'DIESEL', station: 'Posto Central' },
  { id: '4', vehicleId: '3', userId: '2', date: '2026-09-12T09:00:00Z', liters: 30, cost: 120.00, odometer: 15000, fuelType: 'ETANOL', station: 'Posto Rápido' },
];

const INITIAL_USERS: User[] = [
  { id: '1', name: 'Admin Silva', email: 'admin@frota.com', role: 'ADMIN' },
  { id: '2', name: 'João Motorista', email: 'joao@frota.com', role: 'DRIVER' },
];

export function useData() {
  const [fleets, setFleets] = useState<Fleet[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load from local storage or use initial data
    const storedFleets = localStorage.getItem('abastecimento_fleets');
    const storedVehicles = localStorage.getItem('abastecimento_vehicles');
    const storedSupplies = localStorage.getItem('abastecimento_supplies');
    const storedUsers = localStorage.getItem('abastecimento_users');

    if (storedFleets && storedVehicles && storedSupplies) {
      setFleets(JSON.parse(storedFleets));
      setVehicles(JSON.parse(storedVehicles));
      setSupplies(JSON.parse(storedSupplies));
      setUsers(JSON.parse(storedUsers || '[]'));
    } else {
      setFleets(INITIAL_FLEETS);
      setVehicles(INITIAL_VEHICLES);
      setSupplies(INITIAL_SUPPLIES);
      setUsers(INITIAL_USERS);
      
      localStorage.setItem('abastecimento_fleets', JSON.stringify(INITIAL_FLEETS));
      localStorage.setItem('abastecimento_vehicles', JSON.stringify(INITIAL_VEHICLES));
      localStorage.setItem('abastecimento_supplies', JSON.stringify(INITIAL_SUPPLIES));
      localStorage.setItem('abastecimento_users', JSON.stringify(INITIAL_USERS));
    }
    setIsLoaded(true);
  }, []);

  const addSupply = (supply: Omit<Supply, 'id'>) => {
    const newSupply = { ...supply, id: Math.random().toString(36).substring(7) };
    const updated = [newSupply, ...supplies];
    setSupplies(updated);
    localStorage.setItem('abastecimento_supplies', JSON.stringify(updated));
  };

  const addVehicle = (vehicle: Omit<Vehicle, 'id'>) => {
    const newVehicle = { ...vehicle, id: Math.random().toString(36).substring(7) };
    const updated = [...vehicles, newVehicle];
    setVehicles(updated);
    localStorage.setItem('abastecimento_vehicles', JSON.stringify(updated));
  };

  return {
    fleets,
    vehicles,
    supplies,
    users,
    isLoaded,
    addSupply,
    addVehicle
  };
}
