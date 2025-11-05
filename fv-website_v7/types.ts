
export enum AvailabilityStatus {
  EMPTY = 'EMPTY',
  AVAILABLE = 'AVAILABLE',
  PREFERRED = 'PREFERRED',
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

export interface TimeSlot {
  id: string;
  time: string; // e.g., "9:00 AM"
  fullDate?: Date; // Added for easier scheduling
}

export type AvailabilityData = {
  [key: string]: AvailabilityStatus; // key format: `day-timeSlotId`
};

export type TeamAvailabilities = Record<string, AvailabilityData>;

export interface Meeting {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  attendees: User[];
  duration?: number; // Duration in minutes
}

export interface DecodedJwt {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  nbf: number;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
  jti: string;
}