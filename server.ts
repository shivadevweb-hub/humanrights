import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Simple JSON "database"
  const COMPLAINTS_FILE = path.join(process.cwd(), "complaints.json");
  const TEAM_FILE = path.join(process.cwd(), "team.json");
  const GALLERY_FILE = path.join(process.cwd(), "gallery.json");

  const getData = (file: string, initialData: any[] = []) => {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    try {
      return JSON.parse(fs.readFileSync(file, "utf-8"));
    } catch (e) {
      return initialData;
    }
  };

  const saveData = (file: string, data: any[]) => {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  };

  // Initial Data
  const initialTeam = [
    { id: "1", name: "Dr. Sarah Jenkins", role: "Lead Legal Counsel", image: "https://picsum.photos/seed/sarah/400/400", bio: "Former human rights attorney with 15 years of experience in international law." },
    { id: "2", name: "Marcus Thorne", role: "AI Ethics Director", image: "https://picsum.photos/seed/marcus/400/400", bio: "Specialist in algorithmic fairness and transparent AI systems." },
    { id: "3", name: "Elena Rodriguez", role: "User Advocacy Lead", image: "https://picsum.photos/seed/elena/400/400", bio: "Dedicated to making legal assistance accessible to marginalized communities." },
    { id: "4", name: "David Kim", role: "Chief Technology Officer", image: "https://picsum.photos/seed/david/400/400", bio: "Expert in building secure, scalable platforms for social impact." }
  ];

  const initialGallery = [
    { id: "1", url: "https://picsum.photos/seed/justice1/800/600", caption: "International Justice Summit 2025" },
    { id: "2", url: "https://picsum.photos/seed/justice2/800/600", caption: "Community Advocacy Workshop" },
    { id: "3", url: "https://picsum.photos/seed/justice3/800/600", caption: "Legal Tech Innovation Awards" },
    { id: "4", url: "https://picsum.photos/seed/justice4/800/600", caption: "Human Rights Day Celebration" },
    { id: "5", url: "https://picsum.photos/seed/justice5/800/600", caption: "Global Rights Network Meeting" },
    { id: "6", url: "https://picsum.photos/seed/justice6/800/600", caption: "AI Ethics Symposium" }
  ];

  // API Routes
  // Complaints
  app.get("/api/complaints", (req, res) => {
    res.json(getData(COMPLAINTS_FILE));
  });

  app.post("/api/complaints", (req, res) => {
    const complaints = getData(COMPLAINTS_FILE);
    const newComplaint = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...req.body
    };
    complaints.push(newComplaint);
    saveData(COMPLAINTS_FILE, complaints);
    res.status(201).json(newComplaint);
  });

  app.delete("/api/complaints/:id", (req, res) => {
    const complaints = getData(COMPLAINTS_FILE);
    const filtered = complaints.filter((c: any) => c.id !== req.params.id);
    saveData(COMPLAINTS_FILE, filtered);
    res.json({ success: true });
  });

  // Team
  app.get("/api/team", (req, res) => {
    res.json(getData(TEAM_FILE, initialTeam));
  });

  app.post("/api/team", (req, res) => {
    const team = getData(TEAM_FILE, initialTeam);
    const newMember = { id: Date.now().toString(), ...req.body };
    team.push(newMember);
    saveData(TEAM_FILE, team);
    res.status(201).json(newMember);
  });

  app.put("/api/team/:id", (req, res) => {
    const team = getData(TEAM_FILE, initialTeam);
    const index = team.findIndex((m: any) => m.id === req.params.id);
    if (index !== -1) {
      team[index] = { ...team[index], ...req.body };
      saveData(TEAM_FILE, team);
      res.json(team[index]);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  app.delete("/api/team/:id", (req, res) => {
    const team = getData(TEAM_FILE, initialTeam);
    const filtered = team.filter((m: any) => m.id !== req.params.id);
    saveData(TEAM_FILE, filtered);
    res.json({ success: true });
  });

  // Gallery
  app.get("/api/gallery", (req, res) => {
    res.json(getData(GALLERY_FILE, initialGallery));
  });

  app.post("/api/gallery", (req, res) => {
    const gallery = getData(GALLERY_FILE, initialGallery);
    const newImage = { id: Date.now().toString(), ...req.body };
    gallery.push(newImage);
    saveData(GALLERY_FILE, gallery);
    res.status(201).json(newImage);
  });

  app.put("/api/gallery/:id", (req, res) => {
    const gallery = getData(GALLERY_FILE, initialGallery);
    const index = gallery.findIndex((img: any) => img.id === req.params.id);
    if (index !== -1) {
      gallery[index] = { ...gallery[index], ...req.body };
      saveData(GALLERY_FILE, gallery);
      res.json(gallery[index]);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  app.delete("/api/gallery/:id", (req, res) => {
    const gallery = getData(GALLERY_FILE, initialGallery);
    const filtered = gallery.filter((img: any) => img.id !== req.params.id);
    saveData(GALLERY_FILE, filtered);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
