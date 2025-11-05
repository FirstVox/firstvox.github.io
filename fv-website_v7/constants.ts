import type { TimeSlot } from './types';

// IMPORTANT: Replace with your actual Google Client ID from the Google Cloud Console.
// This is required for Google Sign-In to work.
// Go to https://console.cloud.google.com/apis/credentials to create one.
export const GOOGLE_CLIENT_ID = '768067001698-v5pgt6v81ne2ng5l7qp2o4btkjcv3l5o.apps.googleusercontent.com';

// --- Security Configuration ---
// This array controls who can log into the Team Portal. 
// Only Google accounts with an email address listed here will be granted access.
export const AUTHORIZED_EMAILS: string[] = [
  'tim.owen09@gmail.com', // The initial administrator/user
];

export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const TIME_SLOTS: TimeSlot[] = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 10; // 10 AM to 9 PM (21:00)
    
    let displayHour = hour % 12;
    if (displayHour === 0) {
      displayHour = 12;
    }
    
    const ampm = hour < 12 || hour === 24 ? 'AM' : 'PM';
    
    return {
        id: `ts-${hour.toString().padStart(2, '0')}00`,
        time: `${displayHour}:00 ${ampm}`
    };
});
