import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ title, icon: Icon, children }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Icon className="w-6 h-6 text-blue-500" />
      </div>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
};