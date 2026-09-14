import React, { useState } from 'react';
import { useData } from './hooks/useData';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { VehicleList } from './components/VehicleList';
import { SupplyList } from './components/SupplyList';
import { Reports } from './components/Reports';
import { Fuel } from 'lucide-react';

export default function App() {
  const { fleets, vehicles, supplies, isLoaded, addSupply, addVehicle } = useData();
  const [currentView, setCurrentView] = useState('dashboard');

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Fuel className="text-blue-500 w-12 h-12" />
          <p className="text-slate-500 font-medium">Carregando dados da frota...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard supplies={supplies} vehicles={vehicles} fleets={fleets} />;
      case 'vehicles':
        return <VehicleList vehicles={vehicles} fleets={fleets} onAddVehicle={addVehicle} />;
      case 'supplies':
        return <SupplyList supplies={supplies} vehicles={vehicles} onAddSupply={addSupply} />;
      case 'reports':
        return <Reports supplies={supplies} vehicles={vehicles} fleets={fleets} />;
      default:
        return (
          <div className="p-8 flex flex-col items-center justify-center h-full text-slate-500">
            <Fuel className="w-16 h-16 text-slate-300 mb-4" />
            <h2 className="text-xl font-medium text-slate-700">Módulo em Desenvolvimento</h2>
            <p className="mt-2">Esta seção será implementada em breve.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      
      <main className="flex-1 ml-64 min-h-screen bg-slate-50">
        {renderContent()}
      </main>
    </div>
  );
}

