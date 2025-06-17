export interface Project {
    id: number;
    shortName: string;
    description: string;
    securityLevel: 'low' | 'medium' | 'high';
    archived: boolean;
  }
  