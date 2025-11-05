import React, { useMemo } from 'react';
import type { User } from '../types';
import { AvailabilityStatus } from '../types';
import { Star, Check } from './icons';

interface TimeSlotCellProps {
  status: AvailabilityStatus;
  onStatusChange: (newStatus: AvailabilityStatus) => void;
  onScheduleClick: () => void;
  teamAvailabilityCount: number;
  totalTeamMembers: number;
  isBestSlot: boolean;
  availableMembers: User[];
}

const TimeSlotCell: React.FC<TimeSlotCellProps> = ({
  status,
  onStatusChange,
  onScheduleClick,
  teamAvailabilityCount,
  totalTeamMembers,
  isBestSlot,
  availableMembers,
}) => {
  const heatmapOpacity = useMemo(() => {
    if (totalTeamMembers <= 1) return 0;
    return Math.sqrt(teamAvailabilityCount / totalTeamMembers);
  }, [teamAvailabilityCount, totalTeamMembers]);

  // Main cell click toggles the status OFF.
  const handleCellClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (status !== AvailabilityStatus.EMPTY) {
      onStatusChange(AvailabilityStatus.EMPTY);
    }
  };

  const handleSetAvailable = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Toggle between AVAILABLE and EMPTY
    const newStatus = status === AvailabilityStatus.AVAILABLE ? AvailabilityStatus.EMPTY : AvailabilityStatus.AVAILABLE;
    onStatusChange(newStatus);
  };
  
  const handleSetPreferred = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Toggle between PREFERRED and EMPTY (or AVAILABLE if you prefer)
    const newStatus = status === AvailabilityStatus.PREFERRED ? AvailabilityStatus.EMPTY : AvailabilityStatus.PREFERRED;
    onStatusChange(newStatus);
  };

  const statusIcon = useMemo(() => {
    if (status === AvailabilityStatus.AVAILABLE) {
      return <Check className="w-5 h-5 text-status-available-text" />;
    }
    if (status === AvailabilityStatus.PREFERRED) {
      return <Star className="w-5 h-5 text-status-preferred-text fill-current" />;
    }
    return null;
  }, [status]);
  
  const MAX_AVATARS = 4;
  const visibleAvatars = availableMembers.slice(0, MAX_AVATARS);
  const hiddenAvatarCount = availableMembers.length - MAX_AVATARS;


  return (
    <div
      onClick={handleCellClick}
      className={`group relative h-16 flex flex-col justify-end p-1 cursor-pointer transition-all duration-150 bg-slate-800/50 hover:bg-slate-700/80 overflow-hidden`}
    >
      {/* Best Slot Glow */}
      {isBestSlot && (
        <div className="absolute inset-0 bg-accent-green/30 rounded-sm animate-pulse" style={{ animationDuration: '3s' }}/>
      )}
      
      {/* Heatmap background glow */}
      <div 
        className="absolute inset-0 bg-accent-cyan transition-opacity duration-300 pointer-events-none"
        style={{ opacity: heatmapOpacity, mixBlendMode: 'screen' }}
      />
      
      {/* --- CONTENT --- */}

      {/* Default State: User's Status Icon */}
      <div className="absolute top-1.5 right-1.5 z-10 transition-opacity duration-200 group-hover:opacity-0">
         {statusIcon}
      </div>
      
      {/* Hover State: "Schedule Now" Button and Status Controls */}
      {/* This container is click-through; only its children with pointer-events-auto are interactive */}
      <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          
          {/* Schedule Button (appears on hover if anyone is available) */}
          {teamAvailabilityCount > 0 && (
            <button
                onClick={(e) => { e.stopPropagation(); onScheduleClick(); }}
                className="px-4 py-2 text-sm font-semibold text-white bg-brand-primary rounded-lg shadow-lg shadow-indigo-500/40 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-brand-primary pointer-events-auto transition-transform hover:scale-105"
            >
                Schedule
            </button>
          )}

          {/* Status Controls (Check & Star) */}
          <div className="absolute top-1 right-1 flex items-center space-x-1 pointer-events-auto">
              <button
                  title={status === AvailabilityStatus.AVAILABLE ? "Clear Availability" : "Mark as Available"}
                  onClick={handleSetAvailable}
                  className="p-1 rounded-full text-slate-300 hover:bg-white/10 focus:outline-none focus:ring-1 focus:ring-accent-cyan"
                  aria-label="Mark as Available"
              >
                  <Check className={`w-4 h-4 transition-colors ${status === AvailabilityStatus.AVAILABLE ? 'text-status-available-text' : 'text-slate-400 hover:text-white'}`} />
              </button>
              <button
                  title={status === AvailabilityStatus.PREFERRED ? "Clear Availability" : "Mark as Preferred"}
                  onClick={handleSetPreferred}
                  className="p-1 rounded-full text-slate-400 hover:bg-white/10 focus:outline-none focus:ring-1 focus:ring-accent-cyan"
                  aria-label="Mark as Preferred"
              >
                  <Star className={`w-4 h-4 transition-colors ${status === AvailabilityStatus.PREFERRED ? 'text-status-preferred-text fill-current' : 'hover:text-yellow-400'}`} />
              </button>
          </div>
      </div>


      {/* Bottom section: Attendee avatars (always visible) */}
      <div className="h-6 flex items-center justify-center z-10">
        {availableMembers.length > 0 && (
          <div className="flex items-center -space-x-2">
            {visibleAvatars.map(member => (
              <img
                key={member.id}
                src={member.avatarUrl}
                alt={member.name}
                title={member.name}
                className="w-5 h-5 rounded-full ring-2 ring-slate-800 bg-slate-600"
              />
            ))}
            {hiddenAvatarCount > 0 && (
              <div className="w-5 h-5 rounded-full ring-2 ring-slate-800 bg-slate-600 flex items-center justify-center text-xs font-bold text-slate-300">
                +{hiddenAvatarCount}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeSlotCell;