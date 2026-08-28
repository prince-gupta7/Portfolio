export * from './theme';

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  label: string;
  color?: string;
}

export interface SkillItem {
  name: string;
  level?: 'Advanced' | 'Intermediate' | 'Proficient' | 'Familiar';
  icon: string;
  category: 'cloud' | 'programming' | 'web' | 'core-cs' | 'tools' | 'soft-skills';
  description?: string;
  highlight?: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  category: 'cloud' | 'web' | 'python' | 'fullstack';
  featured: boolean;
  image: string;
  overview: string;
  problem: string;
  solution: string;
  features: string[];
  technologies: string[];
  developmentProcess: string[];
  challenges: string[];
  futureImprovements: string[];
  githubUrl: string;
  liveUrl?: string;
  architectureNotes?: string;
}

export interface ExperienceItem {
  id: string;
  institution: string;
  role: string;
  period: string;
  type: 'internship' | 'education' | 'leadership';
  location: string;
  badge?: string;
  description: string;
  responsibilities: string[];
  technologies?: string[];
  highlights?: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
  verificationUrl: string;
  icon: string;
  skills: string[];
  category: 'cloud' | 'programming' | 'security' | 'web';
}

export interface AchievementItem {
  id: string;
  title: string;
  category: 'Hackathon' | 'Coding' | 'Academic' | 'Leadership';
  issuer: string;
  date: string;
  description: string;
  metric?: string;
  badgeIcon: string;
  tags: string[];
}

export interface QuickStat {
  label: string;
  value: string;
  subtext: string;
  icon: string;
}
