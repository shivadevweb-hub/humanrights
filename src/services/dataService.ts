import { Complaint, TeamMember, GalleryImage, Service } from "../types";

const KEYS = {
  COMPLAINTS: "civis_complaints",
  TEAM: "civis_team",
  GALLERY: "civis_gallery",
  SERVICES: "civis_services",
};

// Seed data
const defaultTeam: TeamMember[] = [
  {
    id: "1",
    name: "Dr. Elena Vance",
    role: "Legal Strategist",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    bio: "Specializing in international human rights law and digital privacy."
  },
  {
    id: "2",
    name: "Marcus Thorne",
    role: "AI Ethics Lead",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
    bio: "Ensuring algorithmic transparency and fairness in automated legal systems."
  }
];

const defaultGallery: GalleryImage[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1589262804704-c5aa9e6db3b8?auto=format&fit=crop&q=80&w=800",
    caption: "Legal Workshop 2024: Empowering Local Communities"
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1573163231162-8352cf209c4d?auto=format&fit=crop&q=80&w=800",
    caption: "Digital Rights Summit: Shaping the Future of Privacy"
  }
];

const defaultServices: Service[] = [
  {
    id: "1",
    title: "AI Analysis",
    description: "Submit your situation and our AI will analyze potential human rights violations based on international legal frameworks.",
    icon: "FileSearch"
  },
  {
    id: "2",
    title: "Legal Guidance",
    description: "Receive step-by-step instructions and practical suggestions on how to address identified issues through legal channels.",
    icon: "ShieldAlert"
  },
  {
    id: "3",
    title: "Impact Gallery",
    description: "Explore the real-world impact of our platform through our curated gallery of success stories and community events.",
    icon: "Image"
  }
];

// Helper to get from localstorage
const getLocal = <T>(key: string, defaultValue: T): T => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

// Helper to save to localstorage
const saveLocal = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const dataService = {
  // Complaints
  getComplaints: (): Complaint[] => getLocal(KEYS.COMPLAINTS, []),
  saveComplaint: (complaint: Complaint) => {
    const list = dataService.getComplaints();
    saveLocal(KEYS.COMPLAINTS, [complaint, ...list]);
  },
  deleteComplaint: (id: string) => {
    const list = dataService.getComplaints().filter(c => c.id !== id);
    saveLocal(KEYS.COMPLAINTS, list);
  },

  // Team
  getTeam: (): TeamMember[] => getLocal(KEYS.TEAM, defaultTeam),
  saveTeamMember: (member: TeamMember) => {
    const list = dataService.getTeam();
    const index = list.findIndex(m => m.id === member.id);
    if (index > -1) {
      list[index] = member;
      saveLocal(KEYS.TEAM, list);
    } else {
      saveLocal(KEYS.TEAM, [...list, member]);
    }
  },
  deleteTeamMember: (id: string) => {
    const list = dataService.getTeam().filter(m => m.id !== id);
    saveLocal(KEYS.TEAM, list);
  },

  // Gallery
  getGallery: (): GalleryImage[] => getLocal(KEYS.GALLERY, defaultGallery),
  saveGalleryImage: (image: GalleryImage) => {
    const list = dataService.getGallery();
    const index = list.findIndex(img => img.id === image.id);
    if (index > -1) {
      list[index] = image;
      saveLocal(KEYS.GALLERY, list);
    } else {
      saveLocal(KEYS.GALLERY, [...list, image]);
    }
  },
  deleteGalleryImage: (id: string) => {
    const list = dataService.getGallery().filter(img => img.id !== id);
    saveLocal(KEYS.GALLERY, list);
  },

  // Services
  getServices: (): Service[] => getLocal(KEYS.SERVICES, defaultServices),
  saveService: (service: Service) => {
    const list = dataService.getServices();
    const index = list.findIndex(s => s.id === service.id);
    if (index > -1) {
      list[index] = service;
      saveLocal(KEYS.SERVICES, list);
    } else {
      saveLocal(KEYS.SERVICES, [...list, service]);
    }
  },
  deleteService: (id: string) => {
    const list = dataService.getServices().filter(s => s.id !== id);
    saveLocal(KEYS.SERVICES, list);
  }
};
