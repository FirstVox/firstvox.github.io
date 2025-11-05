
import React, { useEffect, useState } from 'react';
import { X, Users } from './icons';
import type { TimeSlot, User } from '../types';

interface BestSlot {
    day: { name: string, date: number, fullDate: Date };
    slot: TimeSlot;
    availableMembers: User[];
    count: number;
}

interface BestSlotsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bestSlots: BestSlot[];
  totalMembers: number;
  onSchedule: (slot: BestSlot) => void;
}

const BestSlotsModal: React.FC<BestSlotsModalProps> = ({ isOpen, onClose, bestSlots, totalMembers, onSchedule }) => {
    const [isRendered, setIsRendered] = useState(isOpen);

    useEffect(() => {
        if (isOpen) setIsRendered(true);
    }, [isOpen]);

    const handleAnimationEnd = () => {
        if (!isOpen) setIsRendered(false);
    };

    if (!isRendered) return null;

  return (
    <div 
        onClick={onClose}
        onTransitionEnd={handleAnimationEnd}
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
    >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <div 
            onClick={e => e.stopPropagation()}
            className={`relative w-full max-w-2xl bg-slate-800/90 border border-slate-700 rounded-2xl shadow-2xl transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        >
            <header className="flex items-center justify-between p-4 border-b border-slate-700">
                <h3 className="font-bold text-lg text-white">Top Suggested Times</h3>
                <button
                    onClick={onClose}
                    className="p-1 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white"
                    aria-label="Close"
                >
                    <X className="w-5 h-5" />
                </button>
            </header>

            <div className="p-6">
                {bestSlots.length > 0 ? (
                    <div className="space-y-4">
                        {bestSlots.map((slot, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                                <div>
                                    <p className="font-bold text-slate-200">
                                        {slot.day.name}, {slot.day.fullDate.toLocaleString('en-US', { month: 'short', day: 'numeric' })}
                                    </p>
                                    <p className="text-2xl font-bold text-accent-cyan">{slot.slot.time}</p>
                                    <div className="flex items-center mt-2">
                                        <div className="flex -space-x-2 overflow-hidden mr-3">
                                            {slot.availableMembers.map(m => (
                                                <img key={m.id} src={m.avatarUrl} alt={m.name} title={m.name} className="w-6 h-6 rounded-full ring-2 ring-slate-800" />
                                            ))}
                                        </div>
                                        <span className="text-sm font-semibold text-green-400">{slot.count}/{totalMembers} Available</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => onSchedule(slot)}
                                    className="px-4 py-2 text-sm font-semibold text-white bg-brand-primary rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-brand-primary"
                                >
                                    Schedule
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <Users className="w-12 h-12 mx-auto text-slate-500" />
                        <h4 className="mt-4 text-lg font-semibold text-slate-300">No Overlapping Availability</h4>
                        <p className="mt-1 text-slate-400">Try inviting more team members or adjusting your availability.</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default BestSlotsModal;
