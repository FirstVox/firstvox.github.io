import React, { useEffect, useState } from 'react';
import { X, History } from './icons';
import type { Meeting } from '../types';

interface PastMeetingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetings: Meeting[];
  onViewMeetingDetails: (meeting: Meeting) => void;
}

const MeetingRow: React.FC<{meeting: Meeting, onClick: () => void}> = ({ meeting, onClick }) => {
  const formatTime = (date: Date) => date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const formatDate = (date: Date) => date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <button onClick={onClick} className="w-full text-left p-3 flex items-center justify-between rounded-lg transition-colors hover:bg-slate-700/50">
      <div>
        <h4 className="font-bold text-slate-200">{meeting.title}</h4>
        <p className="text-sm text-slate-400 mt-0.5">{formatDate(meeting.startTime)} &bull; {formatTime(meeting.startTime)}</p>
      </div>
       <div className="flex -space-x-2 overflow-hidden">
          {meeting.attendees.map(attendee => (
            <img 
              key={attendee.id} 
              className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-800" 
              src={attendee.avatarUrl} 
              alt={attendee.name}
              title={attendee.name}
            />
          ))}
        </div>
    </button>
  );
};


const PastMeetingsModal: React.FC<PastMeetingsModalProps> = ({ isOpen, onClose, meetings, onViewMeetingDetails }) => {
    const [isRendered, setIsRendered] = useState(isOpen);

    useEffect(() => {
        if (isOpen) setIsRendered(true);
    }, [isOpen]);

    const handleAnimationEnd = () => {
        if (!isOpen) setIsRendered(false);
    };

    const handleMeetingClick = (meeting: Meeting) => {
        onClose();
        // A short delay allows this modal to close before the details modal opens
        setTimeout(() => {
            onViewMeetingDetails(meeting);
        }, 150);
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
            className={`relative flex flex-col w-full max-w-2xl h-full max-h-[80vh] bg-slate-800/90 border border-slate-700 rounded-2xl shadow-2xl transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        >
            <header className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
                <h3 className="font-bold text-lg text-white flex items-center">
                    <History className="w-5 h-5 mr-2" />
                    All Past Meetings
                </h3>
                <button
                    onClick={onClose}
                    className="p-1 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white"
                    aria-label="Close"
                >
                    <X className="w-5 h-5" />
                </button>
            </header>

            <div className="p-4 flex-1 overflow-y-auto">
                {meetings.length > 0 ? (
                    <div className="space-y-2">
                        {meetings.map((meeting) => (
                            <MeetingRow key={meeting.id} meeting={meeting} onClick={() => handleMeetingClick(meeting)} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 h-full flex flex-col items-center justify-center">
                        <History className="w-12 h-12 mx-auto text-slate-500" />
                        <h4 className="mt-4 text-lg font-semibold text-slate-300">No Meeting History</h4>
                        <p className="mt-1 text-slate-400">Your past meetings will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default PastMeetingsModal;