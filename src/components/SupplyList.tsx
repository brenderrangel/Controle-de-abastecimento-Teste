import React, { useState } from 'react';
import { Supply, Vehicle } from '../types';
import { Fuel, Search, Plus, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SupplyListProps {
  supplies: Supply[];
  vehicles: Vehicle[];
  onAddSupply: (supply: Omit<Supply, 'id'>) => void;
}

export function SupplyList({ supplies, vehicles, onAddSupply }: SupplyListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const enrichedSupplies = supplies.map(supply => ({
    ...supply,
    vehicle: vehicles.find(v => v.id === supply.vehicleId)
  })).filter(s => 
    s.station.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.vehicle && s.vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Abastecimentos</h2>
          <p className="text-slate-500 mt-1">Registre e acompanhe todos os abastecimentos da frota.</p>
        </div>
        
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <Plus size={18} />
          Registrar Abastecimento
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Buscar por placa ou posto..."
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
                <th className="px-6 py-4 font-semibold">Data</th>
                <th className="px-6 py-4 font-semibold">Veículo</th>
                <th className="px-6 py-4 font-semibold">Posto</th>
                <th className="px-6 py-4 font-semibold">Combustível</th>
                <th className="px-6 py-4 font-semibold text-right">Volume</th>
                <th className="px-6 py-4 font-semibold text-right">Custo Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {enrichedSupplies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    Nenhum registro encontrado.
                  </td>
                </tr>
              ) : (
                enrichedSupplies.map(supply => (
                  <tr key={supply.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-slate-400" />
                        <span>{format(parseISO(supply.date), "dd 'de' MMM, yyyy", { locale: ptBR })}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{supply.vehicle?.plate}</div>
                      <div className="text-xs text-slate-500">{supply.vehicle?.model}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{supply.station}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                        {supply.fuelType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-700">
                      {supply.liters.toFixed(2)} L
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-900">
                      R$ {supply.cost.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
