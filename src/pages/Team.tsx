import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { TeamMember } from "../types";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Team() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    try {
      const snap = await getDocs(collection(db, "team"));
      if (snap.empty) {
        const localTeam = [
          { id: '1', name: 'Dr. Sarah Chen', role: 'Executive Director', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop', bio: 'Expert in international human rights law with 15 years of advocacy experience.' },
          { id: '2', name: 'Marcus Rodriguez', role: 'Head of Advocacy', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop', bio: 'Strategic lead for global campaigns and grassroots mobilization.' }
        ];
        setTeam(localTeam);
      } else {
        setTeam(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeamMember)));
      }
    } catch (err) {
      console.error("Failed to fetch team", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-10">
        <div className="text-center mb-20">
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tighter mb-6">THE ARCHITECTS</h1>
          <p className="text-muted max-w-2xl mx-auto font-medium">
            Meet the experts dedicated to bridging the gap between technology and human rights advocacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {team.map((member, i) => (
            <motion.div
              key={member.id || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <div className="relative aspect-square overflow-hidden rounded-3xl mb-6 bg-[#F1F5F9]">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-xl font-extrabold tracking-tight mb-1 uppercase">{member.name}</h3>
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-accent mb-3">{member.role}</div>
              <p className="text-sm text-muted leading-relaxed font-medium">
                {member.bio}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}


