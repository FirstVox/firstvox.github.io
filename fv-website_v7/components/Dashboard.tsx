
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { User, AvailabilityData, TeamAvailabilities, Meeting, TimeSlot } from '../types';
import Header from './Header';
import TeamDashboardView from './TeamDashboardView';
import MeetingScheduler from './MeetingScheduler';
import BestSlotsModal from './BestSlotsModal';
import MeetingDetailsModal from './MeetingDetailsModal';
import PastMeetingsModal from './PastMeetingsModal';
import { AvailabilityStatus } from '../types';
import { TIME_SLOTS, DAYS_OF_WEEK } from '../constants';

// Helper function to get Date objects for the current week (Mon-Sun)
const getWeekDates = () => {
  const weekDates = [];
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);

  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    weekDates.push(day);
  }
  return weekDates;
};

interface DashboardProps {
  user: User;
  onLogout: () => void;
  teamMembers: User[];
  teamAvailabilities: TeamAvailabilities;
  setTeamAvailabilities: React.Dispatch<React.SetStateAction<TeamAvailabilities>>;
  onNavigateHome: () => void;
  meetings: Meeting[];
  onAddMeeting: (meeting: Omit<Meeting, 'id'>) => void;
  onUpdateMeeting: (meeting: Meeting) => void;
  onCancelMeeting: (meetingId: string) => void;
  onSaveDefault: (userId: string, availability: AvailabilityData) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
    user, 
    onLogout, 
    teamMembers, 
    teamAvailabilities, 
    setTeamAvailabilities, 
    onNavigateHome,
    meetings,
    onAddMeeting,
    onUpdateMeeting,
    onCancelMeeting,
    onSaveDefault
}) => {
  const [draftAvailabilities, setDraftAvailabilities] = useState<AvailabilityData>(() => teamAvailabilities[user.id] || {});
  const [isDirty, setIsDirty] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [showDefaultSaveSuccess, setShowDefaultSaveSuccess] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isSchedulerOpen, setSchedulerOpen] = useState(false);
  const [isBestSlotsModalOpen, setBestSlotsModalOpen] = useState(false);
  const [viewingMeeting, setViewingMeeting] = useState<Meeting | null>(null);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [isPastMeetingsModalOpen, setPastMeetingsModalOpen] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState('default');

  useEffect(() => {
    // Check for notification support and permission status on mount
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    setDraftAvailabilities(teamAvailabilities[user.id] || {});
    setIsDirty(false);
  }, [user.id, teamAvailabilities]);

  const weekDates = useMemo(() => getWeekDates(), []);

  const formattedWeekDates = useMemo(() => {
    return weekDates.map(date => ({
        name: date.toLocaleDateString('en-US', { weekday: 'long' }),
        date: date.getDate(),
        fullDate: date,
    }));
  }, [weekDates]);

  const { upcomingMeetings, pastMeetings } = useMemo(() => {
    const now = new Date();
    const upcoming = meetings
      .filter(m => m.startTime >= now)
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    const past = meetings
      .filter(m => m.startTime < now)
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
    return { upcomingMeetings: upcoming, pastMeetings: past };
  }, [meetings]);

  const handleAvailabilityChange = (key: string, status: any) => {
    setDraftAvailabilities(prev => ({ ...prev, [key]: status }));
    setIsDirty(true);
    setShowSaveSuccess(false);
    setShowDefaultSaveSuccess(false);
  };
  
  const handleSave = () => {
    setTeamAvailabilities(prev => ({
        ...prev,
        [user.id]: draftAvailabilities,
    }));
    setIsDirty(false);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const handleSaveDefault = () => {
    onSaveDefault(user.id, draftAvailabilities);
    handleSave(); // Also save the current week's changes
    setShowDefaultSaveSuccess(true);
    setTimeout(() => setShowDefaultSaveSuccess(false), 3000);
  };
  
  const createDateFromSlot = (day: { name: string, fullDate: Date }, slot: TimeSlot): Date => {
      const slotDate = new Date(day.fullDate);
      const [time, ampm] = slot.time.split(' ');
      let [hours] = time.split(':').map(Number);

      if (ampm === 'PM' && hours !== 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
      
      slotDate.setHours(hours, 0, 0, 0);
      return slotDate;
  }

  const handleScheduleClick = (day: { name: string, fullDate: Date }, slot: TimeSlot) => {
    const slotDate = createDateFromSlot(day, slot);
    setSelectedSlot({ ...slot, fullDate: slotDate });
    setSchedulerOpen(true);
  };

  const handleScheduleFromSuggestion = (slot: { day: any, slot: TimeSlot, availableMembers: User[] }) => {
    setBestSlotsModalOpen(false);
    // A brief delay to allow the first modal to close smoothly
    setTimeout(() => {
      handleScheduleClick(slot.day, slot.slot);
    }, 150);
  };
  
  const handleCloseScheduler = () => {
    setSchedulerOpen(false);
    setSelectedSlot(null);
    setEditingMeeting(null);
  };

  const handleResetView = useCallback(() => {
    handleCloseScheduler();
    setBestSlotsModalOpen(false);
    setViewingMeeting(null);
    setEditingMeeting(null);
  }, []);

  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  }, []);

  const handleSaveMeeting = (meetingData: Omit<Meeting, 'id'> | Meeting) => {
    if ('id' in meetingData) {
      // This is an update
      onUpdateMeeting(meetingData);
    } else {
      // This is a new meeting
      onAddMeeting(meetingData);
      if (notificationPermission === 'granted') {
        const meetingTime = meetingData.startTime.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit'
        });
        new Notification('Meeting Scheduled!', {
          body: `${meetingData.title} at ${meetingTime}`,
          icon: '/logo.png',
        });
      }
    }
  };

  const handleEditMeeting = (meeting: Meeting) => {
    setViewingMeeting(null); // Close details modal
    // Find the corresponding day and slot for the scheduler
    const meetingDay = formattedWeekDates.find(d => 
        d.fullDate.getFullYear() === meeting.startTime.getFullYear() &&
        d.fullDate.getMonth() === meeting.startTime.getMonth() &&
        d.fullDate.getDate() === meeting.startTime.getDate()
    );

    const meetingHour = meeting.startTime.getHours();
    const slotId = `ts-${meetingHour.toString().padStart(2, '0')}00`;
    const meetingSlot = TIME_SLOTS.find(s => s.id === slotId);

    if (meetingDay && meetingSlot) {
        setSelectedSlot({ ...meetingSlot, fullDate: meeting.startTime });
        setEditingMeeting(meeting);
        setSchedulerOpen(true);
    } else {
        alert("Cannot edit meetings outside of the current week's view.");
    }
  };

  const handleCancelMeeting = (meetingId: string) => {
    onCancelMeeting(meetingId);
    setViewingMeeting(null);
  };

  const bestSlots = useMemo(() => {
    const counts: Record<string, number> = {};
    let maxCount = 0;
    
    formattedWeekDates.forEach(day => {
        TIME_SLOTS.forEach(slot => {
            const key = `${day.name}-${slot.id}`;
            const count = teamMembers.reduce((acc, member) => {
                const avail = teamAvailabilities[member.id];
                if (avail && (avail[key] === AvailabilityStatus.AVAILABLE || avail[key] === AvailabilityStatus.PREFERRED)) {
                    return acc + 1;
                }
                return acc;
            }, 0);
            counts[key] = count;
            if (count > maxCount) {
                maxCount = count;
            }
        });
    });

    if (maxCount === 0) return [];

    const topSlots = formattedWeekDates.flatMap(day => 
        TIME_SLOTS.map(slot => ({ day, slot }))
    ).filter(({ day, slot }) => {
        const key = `${day.name}-${slot.id}`;
        return counts[key] === maxCount;
    }).map(({ day, slot }) => {
        const key = `${day.name}-${slot.id}`;
        const availableMembers = teamMembers.filter(member => {
            const avail = teamAvailabilities[member.id];
            return avail && (avail[key] === AvailabilityStatus.AVAILABLE || avail[key] === AvailabilityStatus.PREFERRED);
        });
        return { day, slot, availableMembers, count: maxCount };
    });

    return topSlots.slice(0, 5); // Return top 5 best slots
  }, [teamMembers, teamAvailabilities, formattedWeekDates]);


  return (
    <div className="bg-slate-900 min-h-screen font-sans text-slate-300">
      <Header user={user} onLogout={onLogout} onTitleClick={handleResetView} onNavigateHome={onNavigateHome} />
      <main className="max-w-8xl mx-auto py-6 sm:px-6 lg:px-8">
          <TeamDashboardView 
            user={user}
            teamMembers={teamMembers}
            teamAvailabilities={teamAvailabilities}
            weekDates={formattedWeekDates}
            userAvailability={draftAvailabilities}
            onAvailabilityChange={handleAvailabilityChange}
            onSave={handleSave}
            onSaveDefault={handleSaveDefault}
            isDirty={isDirty}
            showSaveSuccess={showSaveSuccess}
            showDefaultSaveSuccess={showDefaultSaveSuccess}
            onScheduleClick={handleScheduleClick}
            upcomingMeetings={upcomingMeetings}
            pastMeetings={pastMeetings}
            onFindBestTime={() => setBestSlotsModalOpen(true)}
            onViewMeeting={setViewingMeeting}
            onViewAllPastMeetings={() => setPastMeetingsModalOpen(true)}
            notificationPermission={notificationPermission}
            onRequestNotificationPermission={requestNotificationPermission}
          />
      </main>
      {(selectedSlot || editingMeeting) && (
        <MeetingScheduler
          isOpen={isSchedulerOpen}
          onClose={handleCloseScheduler}
          teamMembers={teamMembers}
          selectedSlot={selectedSlot!}
          teamAvailabilities={teamAvailabilities}
          onSaveMeeting={handleSaveMeeting}
          currentUser={user}
          meetingToEdit={editingMeeting}
        />
      )}
      <BestSlotsModal
        isOpen={isBestSlotsModalOpen}
        onClose={() => setBestSlotsModalOpen(false)}
        bestSlots={bestSlots}
        totalMembers={teamMembers.length}
        onSchedule={handleScheduleFromSuggestion}
      />
      <MeetingDetailsModal
        isOpen={!!viewingMeeting}
        onClose={() => setViewingMeeting(null)}
        meeting={viewingMeeting}
        onEdit={handleEditMeeting}
        onCancel={handleCancelMeeting}
      />
      <PastMeetingsModal
        isOpen={isPastMeetingsModalOpen}
        onClose={() => setPastMeetingsModalOpen(false)}
        meetings={pastMeetings}
        onViewMeetingDetails={setViewingMeeting}
      />
    </div>
  );
};

export default Dashboard;