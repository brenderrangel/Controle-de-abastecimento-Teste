import React, { useState } from 'react';
import { Vehicle, Fleet } from '../types';
import { Plus, Search, Truck } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface VehicleListProps {
  vehicles: Vehicle[];
  fleets: Fleet[];
  onAddVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
}

export function VehicleList({ vehicles, fleets, onAddVehicle }: VehicleListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredVehicles = vehicles.filter(v => 
    v.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Veículos</h2>
          <p className="text-slate-500 mt-1">Gerencie a frota de veículos e manutenções.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Novo Veículo
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Buscar por placa ou modelo..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Veículo</th>
                <th className="px-6 py-4 font-semibold">Placa</th>
                <th className="px-6 py-4 font-semibold">Frota</th>
                <th className="px-6 py-4 font-semibold">Combustível</th>
                <th className="px-6 py-4 font-semibold">Meta Consumo</th>
                <th className="px-6 py-4 font-semibold">Próx. Manutenção</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    Nenhum veículo encontrado.
                  </td>
                </tr>
              ) : (
                filteredVehicles.map(vehicle => {
                  const fleet = fleets.find(f => f.id === vehicle.fleetId);
                  const isMaintenanceNear = new Date(vehicle.maintenanceDueDate) < new Date(new Date().setMonth(new Date().getMonth() + 1));
                  
                  return (
                    <tr key={vehicle.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <Truck size={18} />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{vehicle.brand} {vehicle.model}</p>
                            <p className="text-xs text-slate-500">{vehicle.year}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700">{vehicle.plate}</td>
                      <td className="px-6 py-4">{fleet?.name || 'Desconhecida'}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                          {vehicle.fuelType}
                        </span>
                      </td>
                      <td className="px-6 py-4">{vehicle.averageConsumptionGoal} km/l</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${isMaintenanceNear ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                          {format(parseISO(vehicle.maintenanceDueDate), 'dd/MM/yyyy')}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
