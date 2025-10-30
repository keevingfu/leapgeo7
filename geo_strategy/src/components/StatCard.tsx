import React from 'react';
import { StatCardProps } from '../types';

const StatCard: React.FC<StatCardProps> = ({ value, label }) => {
  return (
    <div className="bg-white rounded-lg p-4 text-center border border-slate-200 shadow-md">
      <span className="block text-3xl font-bold leading-tight">{value}</span>
      <span className="text-sm text-slate-500">{label}</span>
    </div>
  );
};

export default StatCard;