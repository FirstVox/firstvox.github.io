import React, { useMemo } from 'react';
import type { Meeting, User, TeamAvailabilities, AvailabilityData, TimeSlot } from '../types';
import { DAYS_OF_WEEK, TIME_SLOTS } from '../constants';
import { AvailabilityStatus } from '../types';
import { Calendar, Users, Sparkles, History, Bell } from './icons';
import AvailabilityLegend from './AvailabilityLegend';
import TimeSlotCell from './TimeSlotCell';

interface WeekDay {
    name: string;
    date: number;
    fullDate: Date;
}

const MeetingCard: React.FC<{meeting: Meeting, onClick: () => void, isPast?: boolean}> = ({ meeting, onClick, isPast }) => {
  const formatTime = (date: Date) => date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const formatDate = (date: Date) => date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <button onClick={onClick} className={`w-full text-left bg-slate-800 border border-slate-700 rounded-lg p-3 transition-all hover:border-accent-cyan/50 hover:bg-slate-700/60 ${isPast ? 'opacity-70 hover:opacity-100' : ''}`}>
      <h4 className="font-bold text-slate-200 text-sm">{meeting.title}</h4>
      <div className="flex items-center text-slate-400 text-xs mt-1">
        <Calendar className="w-3 h-3 mr-1.5 flex-shrink-0" />
        <span>{formatDate(meeting.startTime)} &bull; {formatTime(meeting.startTime)}</span>
      </div>
      <div className="flex items-center mt-3">
        <div className="flex -space-x-2 overflow-hidden">
          {meeting.attendees.map(attendee => (
            <img 
              key={attendee.id} 
              className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-800" 
              src={attendee.avatarUrl} 
              alt={attendee.name}
              title={attendee.name}
            />
          ))}
        </div>
      </div>
    </button>
  );
};

interface TeamDashboardViewProps {
  user: User;
  teamMembers: User[];
  teamAvailabilities: TeamAvailabilities;
  weekDates: WeekDay[];
  userAvailability: AvailabilityData;
  onAvailabilityChange: (key: string, newStatus: AvailabilityStatus) => void;
  onSave: () => void;
  onSaveDefault: () => void;
  isDirty: boolean;
  showSaveSuccess: boolean;
  showDefaultSaveSuccess: boolean;
  onScheduleClick: (day: WeekDay, slot: TimeSlot) => void;
  upcomingMeetings: Meeting[];
  pastMeetings: Meeting[];
  onFindBestTime: () => void;
  onViewMeeting: (meeting: Meeting) => void;
  onViewAllPastMeetings: () => void;
  notificationPermission: string;
  onRequestNotificationPermission: () => void;
}

const TeamDashboardView: React.FC<TeamDashboardViewProps> = ({ 
    teamMembers, 
    teamAvailabilities, 
    weekDates,
    userAvailability,
    onAvailabilityChange,
    onSave,
    onSaveDefault,
    isDirty,
    showSaveSuccess,
    showDefaultSaveSuccess,
    onScheduleClick,
    upcomingMeetings,
    pastMeetings,
    onFindBestTime,
    onViewMeeting,
    onViewAllPastMeetings,
    notificationPermission,
    onRequestNotificationPermission
}) => {
    const totalMembers = teamMembers.length;

    const { counts, maxCount } = useMemo(() => {
        const counts: Record<string, number> = {};
        let maxCount = 0;
        for (const day of weekDates) {
            for (const slot of TIME_SLOTS) {
                const key = `${day.name}-${slot.id}`;
                const count = teamMembers.reduce((acc, member) => {
                    const memberAvailability = teamAvailabilities[member.id];
                    if (memberAvailability && (memberAvailability[key] === AvailabilityStatus.AVAILABLE || memberAvailability[key] === AvailabilityStatus.PREFERRED)) {
                        return acc + 1;
                    }
                    return acc;
                }, 0);
                counts[key] = count;
                if (count > maxCount) {
                    maxCount = count;
                }
            }
        }
        return { counts, maxCount };
    }, [teamMembers, teamAvailabilities, weekDates]);

    const getMemberAvailabilityForSlot = (key: string) => {
        const available: User[] = [];
        teamMembers.forEach(member => {
            const memberAvailability = teamAvailabilities[member.id];
            if (memberAvailability && (memberAvailability[key] === AvailabilityStatus.AVAILABLE || memberAvailability[key] === AvailabilityStatus.PREFERRED)) {
                available.push(member);
            }
        });
        return { available };
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Sidebar */}
            <aside className="w-full lg:w-64 xl:w-72 flex-shrink-0 space-y-6">
                {/* Team Members Card */}
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-base font-semibold text-slate-200 flex items-center"><Users className="w-5 h-5 mr-2 text-slate-400"/>Team</h3>
                    </div>
                    <div className="space-y-2">
                        {teamMembers.map(member => (
                            <div key={member.id} className="flex items-center">
                                <img 
                                    className="h-8 w-8 rounded-full" 
                                    src={member.avatarUrl} 
                                    alt={member.name}
                                />
                                <div className="ml-3">
                                    <div className="font-medium text-slate-300 text-sm">{member.name}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Meetings */}
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                    <h3 className="text-base font-semibold text-slate-200 mb-3 flex items-center"><Calendar className="w-5 h-5 mr-2 text-slate-400"/>Upcoming</h3>
                    {upcomingMeetings.length > 0 ? (
                        <div className="space-y-3">
                            {upcomingMeetings.map(meeting => <MeetingCard key={meeting.id} meeting={meeting} onClick={() => onViewMeeting(meeting)} />)}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-400 text-center py-4">No upcoming meetings.</p>
                    )}
                </div>

                {/* Previous Meetings */}
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                    <h3 className="text-base font-semibold text-slate-200 mb-3 flex items-center"><History className="w-5 h-5 mr-2 text-slate-400"/>Previous</h3>
                    {pastMeetings.length > 0 ? (
                        <div className="space-y-3">
                            {pastMeetings.slice(0, 4).map(meeting => <MeetingCard key={meeting.id} meeting={meeting} onClick={() => onViewMeeting(meeting)} isPast />)}
                            {pastMeetings.length > 4 && (
                                <button onClick={onViewAllPastMeetings} className="w-full text-center text-sm font-semibold text-accent-cyan hover:underline py-2">
                                    See all
                                </button>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-400 text-center py-4">No past meetings.</p>
                    )}
                </div>
            </aside>
            {/* Main Content: Availability Grid */}
            <div className="flex-1 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-white">Team Availability</h2>
                        <p className="text-slate-400 text-sm mt-1">Click a slot to mark your availability. Hover to schedule.</p>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                        {isDirty && (
                            <div className="relative">
                                <button 
                                    onClick={onSave} 
                                    className="px-4 py-2 text-sm font-semibold text-white bg-brand-primary rounded-md shadow-sm hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    Save Changes
                                </button>
                                {showSaveSuccess && <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs text-green-400 bg-slate-900 px-2 py-1 rounded-md animate-fade-in-up">Saved!</span>}
                            </div>
                        )}
                        <div className="relative">
                            <button 
                                onClick={onSaveDefault}
                                className="px-4 py-2 text-sm font-semibold text-slate-300 bg-slate-700 rounded-md hover:bg-slate-600"
                                title="Save current availability as your default for future weeks"
                            >
                                Save as Default
                            </button>
                            {showDefaultSaveSuccess && <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs text-green-400 bg-slate-900 px-2 py-1 rounded-md animate-fade-in-up">Default saved!</span>}
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-[auto_repeat(7,1fr)]">
                        <div className="row-start-2">
                            {TIME_SLOTS.map(slot => (
                                <div key={slot.id} className="h-16 flex items-center justify-center text-xs font-semibold text-slate-400 border-t border-slate-700 px-2 text-center">
                                    {slot.time}
                                </div>
                            ))}
                        </div>
                        {weekDates.map((day, dayIndex) => (
                            <div key={day.name} className={`col-start-${dayIndex + 2}`}>
                                <div className="h-12 flex flex-col items-center justify-center text-center p-1 border-b border-slate-700">
                                    <span className="font-semibold text-sm text-slate-200">{day.name.substring(0,3)}</span>
                                    <span className="text-2xl font-bold text-slate-400">{day.date}</span>
                                </div>
                                {TIME_SLOTS.map(slot => {
                                    const key = `${day.name}-${slot.id}`;
                                    const teamAvailabilityCount = counts[key] || 0;
                                    const isBestSlot = maxCount > 0 && teamAvailabilityCount === maxCount;
                                    const { available: availableMembers } = getMemberAvailabilityForSlot(key);
                                    
                                    return (
                                        <div key={slot.id} className="border-t border-l border-slate-700">
                                            <TimeSlotCell
                                                status={userAvailability[key] || AvailabilityStatus.EMPTY}
                                                onStatusChange={(newStatus) => onAvailabilityChange(key, newStatus)}
                                                onScheduleClick={() => onScheduleClick(day, slot)}
                                                teamAvailabilityCount={teamAvailabilityCount}
                                                totalTeamMembers={totalMembers}
                                                isBestSlot={isBestSlot}
                                                availableMembers={availableMembers}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <AvailabilityLegend />
                    </div>
                    <div className="flex gap-4">
                         {notificationPermission === 'default' && (
                            <button
                                onClick={onRequestNotificationPermission}
                                className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                            >
                                <Bell className="w-4 h-4" /> Enable Notifications
                            </button>
                        )}
                         <button
                            onClick={onFindBestTime}
                            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 text-base font-bold text-white bg-gradient-to-r from-brand-secondary to-accent-green rounded-lg shadow-lg hover:opacity-90 transition-opacity"
                        >
                            <Sparkles className="w-5 h-5" /> Find Best Time
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamDashboardView;
