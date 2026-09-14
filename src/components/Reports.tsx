import React, { useState } from 'react';
import { Supply, Vehicle, Fleet } from '../types';
import { FileBarChart, Download, Filter } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ReportsProps {
  supplies: Supply[];
  vehicles: Vehicle[];
  fleets: Fleet[];
}

export function Reports({ supplies, vehicles, fleets }: ReportsProps) {
  const [selectedFleet, setSelectedFleet] = useState<string>('all');
  
  // Basic analytical data for reports
  const vehicleStats = vehicles.map(vehicle => {
    const vehicleSupplies = supplies.filter(s => s.vehicleId === vehicle.id);
    const totalLiters = vehicleSupplies.reduce((acc, curr) => acc + curr.liters, 0);
    const totalCost = vehicleSupplies.reduce((acc, curr) => acc + curr.cost, 0);
    
    // Sort by odometer to find distance
    const sortedSupplies = [...vehicleSupplies].sort((a, b) => a.odometer - b.odometer);
    let distance = 0;
    if (sortedSupplies.length > 1) {
      distance = sortedSupplies[sortedSupplies.length - 1].odometer - sortedSupplies[0].odometer;
    }
    
    const avgConsumption = totalLiters > 0 && distance > 0 ? (distance / totalLiters) : 0;
    const efficiencyAlert = avgConsumption > 0 && avgConsumption < vehicle.averageConsumptionGoal;

    return {
      vehicle,
      totalLiters,
      totalCost,
      distance,
      avgConsumption,
      efficiencyAlert,
      suppliesCount: vehicleSupplies.length
    };
  }).filter(stat => selectedFleet === 'all' || stat.vehicle.fleetId === selectedFleet);

  const chartData = vehicleStats.map(stat => ({
    name: stat.vehicle.plate,
    consumo: Number(stat.avgConsumption.toFixed(2)),
    meta: stat.vehicle.averageConsumptionGoal
  }));

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Relatórios Analíticos</h2>
          <p className="text-slate-500 mt-1">Análise detalhada de consumo por veículo e frota.</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <select 
              className="appearance-none bg-white border border-slate-200 text-slate-700 py-2 pl-4 pr-10 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedFleet}
              onChange={(e) => setSelectedFleet(e.target.value)}
            >
              <option value="all">Todas as Frotas</option>
              {fleets.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
            <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
            <Download size={16} />
            Exportar CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-3">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Eficiência por Veículo (Km/L) vs Meta</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="consumo" name="Consumo Atual" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="meta" name="Meta de Consumo" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm lg:col-span-3 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800">Detalhamento por Veículo</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold">Veículo</th>
                  <th className="px-6 py-4 font-semibold">Abastecimentos</th>
                  <th className="px-6 py-4 font-semibold text-right">Volume Total</th>
                  <th className="px-6 py-4 font-semibold text-right">Custo Total</th>
                  <th className="px-6 py-4 font-semibold text-right">Distância (Km)</th>
                  <th className="px-6 py-4 font-semibold text-right">Média (Km/L)</th>
                  <th className="px-6 py-4 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {vehicleStats.map(stat => (
                  <tr key={stat.vehicle.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{stat.vehicle.plate}</div>
                      <div className="text-xs text-slate-500">{stat.vehicle.model}</div>
                    </td>
                    <td className="px-6 py-4">{stat.suppliesCount}</td>
                    <td className="px-6 py-4 text-right">{stat.totalLiters.toFixed(1)} L</td>
                    <td className="px-6 py-4 text-right">R$ {stat.totalCost.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">{stat.distance > 0 ? stat.distance : '-'}</td>
                    <td className="px-6 py-4 text-right font-medium text-slate-900">
                      {stat.avgConsumption > 0 ? stat.avgConsumption.toFixed(2) : '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {stat.avgConsumption === 0 ? (
                        <span className="text-slate-400 text-xs">Dados Insuficientes</span>
                      ) : stat.efficiencyAlert ? (
                        <span className="px-2.5 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium">Abaixo da Meta</span>
                      ) : (
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">Dentro da Meta</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
