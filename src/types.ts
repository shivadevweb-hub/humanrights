export interface AIResult {
  category: string;
  problem_summary: string;
  key_issues: string[];
  rights_violated: string;
  legal_explanation: string;
  suggestions: string[];
  step_by_step_actions: string[];
  follow_up_questions: string[];
}

export interface Complaint {
  id: string;
  timestamp: string;
  userName: string;
  userEmail: string;
  originalText: string;
  aiResult: AIResult;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
}
