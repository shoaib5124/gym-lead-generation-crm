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
  fitnessGoal: string;
}
export interface Lead {
  _id: string;
  name: string;
  email: string;
  purpose: string;
  status: string;
  createdAt: string;
}