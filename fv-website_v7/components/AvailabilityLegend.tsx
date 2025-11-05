import React from 'react';
import { Check, Star } from './icons';

const LegendItem: React.FC<{
  bgColor?: string;
  textColor?: string;
  icon?: React.ReactNode;
  label: string;
  description: string;
}> = ({ bgColor, textColor, icon, label, description }) => (
  <div className="flex items-start space-x-3">
    <div className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center ${bgColor || ''}`}>
      {icon}
    </div>
    <div>
      <span className={`text-sm font-semibold ${textColor || 'text-slate-200'}`}>{label}</span>
      <p className="text-xs text-slate-400">{description}</p>
    </div>
  </div>
);

const AvailabilityLegend: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 p-4 bg-slate-800 rounded-lg border border-slate-700">
      <LegendItem
        bgColor="bg-accent-cyan/30"
        label="Heatmap"
        description="Brighter cells mean more team members are available."
      />
      <LegendItem
        bgColor="bg-accent-green/30"
        label="Best Slot"
        description="Highlighted slots with the highest availability."
      />
      <LegendItem
        icon={<Check className="w-4 h-4 text-status-available-text" />}
        label="Available"
        description="You've marked this time as free."
      />
      <LegendItem
        icon={<Star className="w-4 h-4 text-status-preferred-text fill-current" />}
        label="Preferred"
        description="An ideal time for you to meet."
      />
    </div>
  );
};

export default AvailabilityLegend;