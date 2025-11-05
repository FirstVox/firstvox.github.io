import React, { useState, useCallback } from 'react';
import type { User, DecodedJwt, TeamAvailabilities, AvailabilityData, Meeting } from '../types';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import { jwtDecode } from 'jwt-decode';
import type { CredentialResponse } from '../globals';
import { AUTHORIZED_EMAILS } from '../constants';

interface TeamPortalProps {
  onNavigateHome: () => void;
}

const TeamPortal: React.FC<TeamPortalProps> = ({ onNavigateHome }) => {
  const [user, setUser] = useState<User | null>(null);
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [teamAvailabilities, setTeamAvailabilities] = useState<TeamAvailabilities>({});
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [defaultAvailabilities, setDefaultAvailabilities] = useState<TeamAvailabilities>({});
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleAddMeeting = useCallback((newMeeting: Omit<Meeting, 'id'>) => {
    setMeetings(prev => {
        const fullMeeting: Meeting = {
            id: `m-${Date.now()}`,
            ...newMeeting,
        };
        // Sort meetings by start time
        return [...prev, fullMeeting].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    });
  }, []);

  const handleUpdateMeeting = useCallback((updatedMeeting: Meeting) => {
    setMeetings(prev => {
      const updatedMeetings = prev.map(m => m.id === updatedMeeting.id ? updatedMeeting : m);
      return updatedMeetings.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    });
  }, []);

  const handleCancelMeeting = useCallback((meetingId: string) => {
    setMeetings(prev => prev.filter(m => m.id !== meetingId));
  }, []);

  const handleSaveDefault = useCallback((userId: string, availability: AvailabilityData) => {
    setDefaultAvailabilities(prev => ({ ...prev, [userId]: availability }));
  }, []);

  const handleLogin = useCallback((credentialResponse: CredentialResponse) => {
    setLoginError(null); // Clear previous errors
    if (credentialResponse.credential) {
      try {
        const decoded: DecodedJwt = jwtDecode(credentialResponse.credential);
        
        // Security Check: Only allow users from the authorized list
        if (!AUTHORIZED_EMAILS.includes(decoded.email)) {
          setLoginError(`Access Denied: Your email (${decoded.email}) is not authorized. For development, add it to AUTHORIZED_EMAILS in constants.ts.`);
          return;
        }

        const loggedInUser: User = {
          id: decoded.sub,
          name: decoded.name,
          email: decoded.email,
          avatarUrl: decoded.picture,
        };
        setUser(loggedInUser);
        
        // Initialize team with only the logged-in user
        setTeamMembers([loggedInUser]);

        // Load default availability if it exists for the logged-in user, otherwise start fresh
        const userDefault = defaultAvailabilities[loggedInUser.id];
        setTeamAvailabilities(userDefault ? { [loggedInUser.id]: userDefault } : {});
        
        // Start with no meetings
        setMeetings([]); 
      } catch (error) {
        console.error("Error decoding JWT:", error);
        setLoginError('An error occurred during sign-in. Please try again.');
      }
    } else {
       console.error("Login failed: No credential returned");
       setLoginError('Login failed. No credential was returned from Google.');
    }
  }, [defaultAvailabilities]);

  const handleLogout = useCallback(() => {
    setUser(null);
    setTeamMembers([]);
    setTeamAvailabilities({});
    setMeetings([]);
    setLoginError(null);
  }, []);

  return (
    <div className="min-h-screen font-sans">
      {user ? (
        <Dashboard 
          user={user} 
          onLogout={handleLogout}
          teamMembers={teamMembers}
          teamAvailabilities={teamAvailabilities}
          setTeamAvailabilities={setTeamAvailabilities}
          onNavigateHome={onNavigateHome}
          meetings={meetings}
          onAddMeeting={handleAddMeeting}
          onUpdateMeeting={handleUpdateMeeting}
          onCancelMeeting={handleCancelMeeting}
          onSaveDefault={handleSaveDefault}
        />
      ) : (
        <LoginPage onLogin={handleLogin} loginError={loginError} />
      )}
    </div>
  );
};

export default TeamPortal;