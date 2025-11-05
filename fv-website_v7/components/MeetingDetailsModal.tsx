
import React, { useEffect, useState } from 'react';
import { X, Calendar, Clock, Users, Edit, Trash } from './icons';
import type { Meeting } from '../types';

interface MeetingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  meeting: Meeting | null;
  onEdit: (meeting: Meeting) => void;
  onCancel: (meetingId: string) => void;
}

const MeetingDetailsModal: React.FC<MeetingDetailsModalProps> = ({ isOpen, onClose, meeting, onEdit, onCancel }) => {
    const [isRendered, setIsRendered] = useState(isOpen);

    useEffect(() => {
        if (isOpen) setIsRendered(true);
    }, [isOpen]);

    const handleAnimationEnd = () => {
        if (!isOpen) setIsRendered(false);
    };

    if (!isRendered || !meeting) return null;

    const formatTime = (date: Date) => date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const formatDate = (date: Date) => date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const isUpcoming = meeting.startTime > new Date();

    const handleCancelClick = () => {
        if (window.confirm('Are you sure you want to cancel this meeting? This action cannot be undone.')) {
            onCancel(meeting.id);
        }
    };

  return (
    <div 
        onClick={onClose}
        onTransitionEnd={handleAnimationEnd}
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
    >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <div 
            onClick={e => e.stopPropagation()}
            className={`relative w-full max-w-lg bg-slate-800/90 border border-slate-700 rounded-2xl shadow-2xl transition-all duration-300 flex flex-col ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        >
            <header className="flex items-start justify-between p-6 border-b border-slate-700">
                <div>
                    <h3 className="font-bold text-2xl text-white">{meeting.title}</h3>
                    <div className="flex items-center text-slate-400 text-sm mt-2">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{formatDate(meeting.startTime)} from {formatTime(meeting.startTime)} to {formatTime(meeting.endTime)}</span>
                    </div>
                     <div className="flex items-center text-slate-400 text-sm mt-1">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>Duration: {meeting.duration} minutes</span>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-1 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white"
                    aria-label="Close"
                >
                    <X className="w-5 h-5" />
                </button>
            </header>

            <div className="p-6 flex-1 overflow-y-auto">
                 <h4 className="font-semibold text-slate-300 mb-3 flex items-center">
                    <Users className="w-5 h-5 mr-2" /> 
                    {meeting.attendees.length} Attendees
                 </h4>
                 <div className="space-y-3">
                    {meeting.attendees.map(attendee => (
                        <div key={attendee.id} className="flex items-center">
                            <img 
                                src={attendee.avatarUrl} 
                                alt={attendee.name}
                                className="w-10 h-10 rounded-full"
                            />
                            <div className="ml-3">
                                <p className="font-medium text-slate-200">{attendee.name}</p>
                                <p className="text-sm text-slate-400">{attendee.email}</p>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>

            {isUpcoming && (
                <footer className="p-4 border-t border-slate-700 bg-slate-800/50 rounded-b-2xl flex justify-end items-center space-x-3">
                    <button 
                        onClick={handleCancelClick}
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-red-400 bg-transparent border border-red-400/50 rounded-md hover:bg-red-400/10 transition-colors"
                    >
                        <Trash className="w-4 h-4 mr-2"/>
                        Cancel Meeting
                    </button>
                    <button 
                        onClick={() => onEdit(meeting)}
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-brand-primary rounded-md shadow-sm hover:bg-indigo-700 transition-colors"
                    >
                         <Edit className="w-4 h-4 mr-2"/>
                        Edit
                    </button>
                </footer>
            )}
        </div>
    </div>
  );
};

export default MeetingDetailsModal;
