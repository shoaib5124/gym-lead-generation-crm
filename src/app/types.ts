export interface Program {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  altText: string;
}

export interface StandardFeature {
  id: string;
  title: string;
  description: string;
  iconName: 'psychology' | 'fitness_center' | 'target' | 'group';
}

export interface StatItem {
  value: string;
  label: string;
  hasStar?: boolean;
}

export interface FreeTrialFormData {
  fullName: string;
  email: string;
  phone: string;
  fitnessGoal: string;
}
export type LeadStatusType =
  | "new"
  | "contacted"
  | "Notresponed"
  | "interested"
  | "trial-booked"
  | "joined";

  export interface Note {
    author: string;
    id: string;
  _id: string;
  text: string;
  createdAt: string ;
}
export interface Lead {
  _id: string;
  name: string;
  email: string;
  purpose: string;
  phone: string;
  source: string;
  status: LeadStatusType;
   notes: Note[];
  createdAt: string;
  updatedAt: string;
}
