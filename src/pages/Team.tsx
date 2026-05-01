import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { TeamMember } from "../types";

export default function Team() {
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    fetch("/api/team")
      .then(res => res.json())
      .then(data => setTeam(data))
      .catch(err => console.error("Failed to fetch team", err));
  }, []);

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
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
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


