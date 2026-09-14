import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { TrendingUp, Truck, Droplets, AlertTriangle } from 'lucide-react';
import { Supply, Vehicle, Fleet } from '../types';
import { format, parseISO, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DashboardProps {
  supplies: Supply[];
  vehicles: Vehicle[];
  fleets: Fleet[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export function Dashboard({ supplies, vehicles, fleets }: DashboardProps) {
  const stats = useMemo(() => {
    const totalCost = supplies.reduce((acc, curr) => acc + curr.cost, 0);
    const totalLiters = supplies.reduce((acc, curr) => acc + curr.liters, 0);
    
    // Group costs by date for chart
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = subDays(new Date(), i);
      return format(d, 'yyyy-MM-dd');
    }).reverse();

    const chartData = last7Days.map(dateStr => {
      const daySupplies = supplies.filter(s => s.date.startsWith(dateStr));
      return {
        name: format(parseISO(dateStr), 'dd MMM', { locale: ptBR }),
        cost: daySupplies.reduce((acc, curr) => acc + curr.cost, 0)
      };
    });

    // Group by fuel type
    const fuelTypeMap = supplies.reduce((acc, curr) => {
      acc[curr.fuelType] = (acc[curr.fuelType] || 0) + curr.liters;
      return acc;
    }, {} as Record<string, number>);

    const fuelTypeData = Object.entries(fuelTypeMap).map(([name, value]) => ({ name, value }));

    return { totalCost, totalLiters, chartData, fuelTypeData };
  }, [supplies]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Visão Geral</h2>
          <p className="text-slate-500 mt-1">Acompanhe os custos e consumo da sua frota.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title="Custo Total (Mês)" 
          value={`R$ ${stats.totalCost.toFixed(2)}`} 
          icon={<TrendingUp className="text-blue-500" />}
          trend="+12% em relação ao mês passado"
          trendUp={true}
        />
        <StatCard 
          title="Total Litros" 
          value={`${stats.totalLiters.toFixed(1)} L`} 
          icon={<Droplets className="text-emerald-500" />}
        />
        <StatCard 
          title="Veículos Ativos" 
          value={vehicles.length.toString()} 
          icon={<Truck className="text-amber-500" />}
        />
        <StatCard 
          title="Manutenções Próximas" 
          value="2" 
          icon={<AlertTriangle className="text-red-500" />}
          className="border-red-100 bg-red-50/50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Custos de Abastecimento (Últimos 7 dias)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} tickFormatter={(val) => `R$${val}`} />
                <Tooltip 
                  formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Custo']}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="cost" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Consumo por Tipo</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.fuelTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.fuelTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value.toFixed(1)} L`, 'Volume']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4 text-sm">
            {stats.fuelTypeData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-slate-600 capitalize">{entry.name.toLowerCase()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, trendUp, className = '' }: any) {
  return (
    <div className={`bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h4 className="text-2xl font-bold text-slate-800 mt-2">{value}</h4>
        </div>
        <div className="p-2 bg-slate-50 rounded-lg">
          {icon}
        </div>
      </div>
      {trend && (
        <p className={`text-xs mt-4 font-medium ${trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
          {trend}
        </p>
      )}
    </div>
  );
}
