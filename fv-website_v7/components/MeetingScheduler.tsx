
import React, { useState, useEffect, useMemo } from 'react';
import type { TimeSlot, User, TeamAvailabilities, Meeting } from '../types';
import { AvailabilityStatus } from '../types';
import { X, Clock, Users, ArrowRight, Check } from './icons';

interface MeetingSchedulerProps {
  isOpen: boolean;
  onClose: () => void;
  teamMembers: User[];
  selectedSlot: TimeSlot;
  teamAvailabilities: TeamAvailabilities;
  onSaveMeeting: (meeting: Omit<Meeting, 'id'> | Meeting) => void;
  currentUser: User;
  meetingToEdit?: Meeting | null;
}

const durationOptions = [
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '1 hour' },
];

const MeetingScheduler: React.FC<MeetingSchedulerProps> = ({ 
    isOpen, 
    onClose, 
    teamMembers, 
    selectedSlot, 
    teamAvailabilities, 
    onSaveMeeting,
    currentUser,
    meetingToEdit
}) => {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(30);
  const [selectedAttendees, setSelectedAttendees] = useState<Set<string>>(new Set([currentUser.id]));
  const [isRendered, setIsRendered] = useState(isOpen);

  useEffect(() => {
    if (isOpen) setIsRendered(true);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
        if (meetingToEdit) {
            // Editing an existing meeting
            setTitle(meetingToEdit.title);
            setDuration(meetingToEdit.duration || 30);
            setSelectedAttendees(new Set(meetingToEdit.attendees.map(a => a.id)));
        } else {
            // Creating a new meeting
            setTitle('');
            setDuration(30);

            // Pre-select available members for the new slot
            const slotKey = `${selectedSlot.fullDate?.toLocaleDateString('en-US', { weekday: 'long' })}-${selectedSlot.id}`;
            const availableMemberIds = teamMembers
                .filter(member => {
                    const memberAvailability = teamAvailabilities[member.id];
                    return memberAvailability && (memberAvailability[slotKey] === AvailabilityStatus.AVAILABLE || memberAvailability[slotKey] === AvailabilityStatus.PREFERRED);
                })
                .map(member => member.id);
            
            setSelectedAttendees(new Set([currentUser.id, ...availableMemberIds]));
        }
    }
  }, [isOpen, selectedSlot, teamMembers, teamAvailabilities, currentUser.id, meetingToEdit]);

  const handleAnimationEnd = () => {
    if (!isOpen) setIsRendered(false);
  };

  const toggleAttendee = (memberId: string) => {
    if (memberId === currentUser.id && meetingToEdit?.attendees.some(a => a.id === currentUser.id)) {
       // Allow deselecting self if editing, unless they are the only attendee
       if (selectedAttendees.size === 1) return;
    } else if (memberId === currentUser.id) {
        return; // Current user cannot be deselected when creating
    }

    setSelectedAttendees(prev => {
      const newSet = new Set(prev);
      if (newSet.has(memberId)) {
        newSet.delete(memberId);
      } else {
        newSet.add(memberId);
      }
      return newSet;
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedSlot.fullDate) return;
    
    const startTime = selectedSlot.fullDate;
    const endTime = new Date(startTime.getTime() + duration * 60000);
    const attendees = teamMembers.filter(m => selectedAttendees.has(m.id));

    if (meetingToEdit) {
        onSaveMeeting({
            ...meetingToEdit,
            title: title.trim(),
            startTime,
            endTime,
            attendees,
            duration,
        });
    } else {
        onSaveMeeting({ title: title.trim(), startTime, endTime, attendees, duration });
    }
    onClose();
  };

  const formattedDate = useMemo(() => {
    if (!selectedSlot.fullDate) return '';
    return selectedSlot.fullDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  }, [selectedSlot.fullDate]);

  const submitButtonText = meetingToEdit ? 'Update Meeting' : 'Schedule Meeting';

  if (!isRendered) return null;

  return (
    <>
        {/* Backdrop */}
        <div 
            onClick={onClose}
            className={`fixed inset-0 bg-black/60 z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        />
        <div
            onTransitionEnd={handleAnimationEnd}
            className={`fixed top-0 right-0 h-full w-full max-w-md bg-slate-800/90 backdrop-blur-lg border-l border-slate-700 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
            <div className="flex flex-col h-full">
                <header className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
                    <h3 className="font-bold text-lg text-white">{meetingToEdit ? 'Edit Meeting' : 'Schedule a Meeting'}</h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </header>

                <div className="p-6 overflow-y-auto flex-1">
                    <form id="meeting-form" onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-slate-400">Meeting Title</label>
                            <input 
                                type="text" 
                                id="title" 
                                name="title" 
                                required 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Q4 Planning Session"
                                className="mt-1 block w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-accent-cyan focus:border-accent-cyan" 
                            />
                        </div>
                        
                        <div className="p-3 bg-slate-700/50 rounded-md border border-slate-600">
                           <p className="text-sm font-semibold text-slate-300">{formattedDate}</p>
                           <p className="text-2xl font-bold text-accent-cyan">{selectedSlot.time}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center"><Clock className="w-4 h-4 mr-2"/> Duration</label>
                            <div className="flex space-x-2">
                                {durationOptions.map(opt => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setDuration(opt.value)}
                                        className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                                            duration === opt.value
                                                ? 'bg-brand-primary text-white shadow-lg'
                                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                             <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center"><Users className="w-4 h-4 mr-2"/> Attendees</label>
                             <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                {teamMembers.map(member => {
                                     const slotKey = `${selectedSlot.fullDate?.toLocaleDateString('en-US', { weekday: 'long' })}-${selectedSlot.id}`;
                                     const availability = teamAvailabilities[member.id]?.[slotKey];
                                     const isAvailable = availability === AvailabilityStatus.AVAILABLE || availability === AvailabilityStatus.PREFERRED;

                                    return (
                                        <div 
                                            key={member.id}
                                            onClick={() => toggleAttendee(member.id)}
                                            className={`flex items-center p-2 rounded-md transition-colors ${selectedAttendees.has(member.id) ? 'bg-slate-700/80' : ''} ${member.id === currentUser.id && !meetingToEdit ? 'opacity-70 cursor-not-allowed' : 'hover:bg-slate-700 cursor-pointer'}`}
                                        >
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center mr-3">
                                                {selectedAttendees.has(member.id) && <Check className="w-4 h-4 text-accent-cyan"/>}
                                            </div>
                                            <img src={member.avatarUrl} alt={member.name} className="w-8 h-8 rounded-full mr-3"/>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-slate-200">{member.name}</p>
                                            </div>
                                            {isAvailable ? 
                                                <span className="text-xs font-semibold text-green-400 bg-green-900/50 px-2 py-0.5 rounded-full">Available</span> : 
                                                <span className="text-xs text-slate-400 bg-slate-900/50 px-2 py-0.5 rounded-full">Unavailable</span>
                                            }
                                        </div>
                                    );
                                })}
                             </div>
                        </div>

                    </form>
                </div>
                <footer className="p-4 border-t border-slate-700 flex-shrink-0">
                    <button
                        type="submit"
                        form="meeting-form"
                        disabled={!title.trim()}
                        className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-brand-primary text-white font-bold rounded-lg shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 disabled:bg-slate-600 disabled:shadow-none disabled:scale-100 disabled:cursor-not-allowed"
                        >
                        {submitButtonText}
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                </footer>
            </div>
        </div>
    </>
  );
};

export default MeetingScheduler;
