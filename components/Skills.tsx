"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { skills as staticSkills } from "@/data";
import { buildCloudinaryUrl } from "@/lib/utils";
import { motion } from "framer-motion";
import { Marquee } from "./ui/Marquee";

type SkillItem = {
  id?: string | number;
  name?: string;
  text?: string;
  iconUrl?: string;
  icon?: ReactNode;
};

function Skills() {
  const [skills, setSkills] = useState<SkillItem[]>(staticSkills as SkillItem[]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "skills"));
        if (!querySnapshot.empty) {
          const data: SkillItem[] = [];
          querySnapshot.forEach((docSnap) => {
            const d = docSnap.data() as Partial<SkillItem>;
            data.push({
              id: docSnap.id,
              name: d.name,
              text: d.text,
              iconUrl: d.iconUrl,
              icon: d.icon as ReactNode,
            });
          });
          setSkills(data);
        }
      } catch (error) {
        console.error("Failed to fetch skills from Firebase", error);
      }
    };
    fetchSkills();
  }, []);

  const { row1Skills, row2Skills, row3Skills } = useMemo(() => {
    const r1: SkillItem[] = [];
    const r2: SkillItem[] = [];
    const r3: SkillItem[] = [];

    skills.forEach((s, i) => {
      if (i % 3 === 0) r1.push(s);
      else if (i % 3 === 1) r2.push(s);
      else r3.push(s);
    });

    return { row1Skills: r1, row2Skills: r2, row3Skills: r3 };
  }, [skills]);

  return (
    <div id="skills">
      {/* Full-bleed section (break out of centered container layouts) */}
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen px-4 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="mx-auto mb-8 w-fit bg-[#0E162B]/60 border border-[#A07CFE]/25 rounded-md px-7 py-2.5 text-center font-cairo tracking-widest text-sm sm:text-base text-[#7dd3fc] drop-shadow-sm"
        >
          MY SKILLS
        </motion.div>

        <div className="flex flex-col gap-5 pb-14">
          <Marquee
            reverse={false}
            pauseOnHover
            className="w-full [--duration:30s] [--gap:0.9rem] bg-transparent"
          >
            {row1Skills.map((skill, i) => {
              const label = skill.name || skill.text || "";
              return (
                <div
                  key={`${skill.id ?? "s"}-r1-${i}`}
                  className="shrink-0 font-cairo border border-[#A07CFE]/20 bg-[#0E162B]/40 rounded-lg px-6 py-3 text-[#7dd3fc] text-sm sm:text-base hover:border-[#A07CFE]/45 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {skill.iconUrl ? (
                      <img
                        src={buildCloudinaryUrl(skill.iconUrl, 40, 40)}
                        alt={label}
                        className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
                      />
                    ) : (
                      <span className="text-[#A07CFE] text-lg sm:text-xl leading-none">
                        {skill.icon}
                      </span>
                    )}
                    <span className="whitespace-nowrap">{label}</span>
                  </div>
                </div>
              );
            })}
          </Marquee>

          <Marquee
            reverse
            pauseOnHover
            className="w-full [--duration:28s] [--gap:0.9rem] bg-transparent"
          >
            {row2Skills.map((skill, i) => {
              const label = skill.name || skill.text || "";
              return (
                <div
                  key={`${skill.id ?? "s"}-r2-${i}`}
                  className="shrink-0 font-cairo border border-[#FE8FB5]/20 bg-[#0E162B]/40 rounded-lg px-6 py-3 text-[#7dd3fc] text-sm sm:text-base hover:border-[#FE8FB5]/45 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {skill.iconUrl ? (
                      <img
                        src={buildCloudinaryUrl(skill.iconUrl, 40, 40)}
                        alt={label}
                        className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
                      />
                    ) : (
                      <span className="text-[#FE8FB5] text-lg sm:text-xl leading-none">
                        {skill.icon}
                      </span>
                    )}
                    <span className="whitespace-nowrap">{label}</span>
                  </div>
                </div>
              );
            })}
          </Marquee>

          <Marquee
            reverse={false}
            pauseOnHover
            className="w-full [--duration:30s] [--gap:0.9rem] bg-transparent"
          >
            {row3Skills.map((skill, i) => {
              const label = skill.name || skill.text || "";
              return (
                <div
                  key={`${skill.id ?? "s"}-r3-${i}`}
                  className="shrink-0 font-cairo border border-[#A07CFE]/20 bg-[#0E162B]/40 rounded-lg px-6 py-3 text-[#7dd3fc] text-sm sm:text-base hover:border-[#A07CFE]/45 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {skill.iconUrl ? (
                      <img
                        src={buildCloudinaryUrl(skill.iconUrl, 40, 40)}
                        alt={label}
                        className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
                      />
                    ) : (
                      <span className="text-[#A07CFE] text-lg sm:text-xl leading-none">
                        {skill.icon}
                      </span>
                    )}
                    <span className="whitespace-nowrap">{label}</span>
                  </div>
                </div>
              );
            })}
          </Marquee>
        </div>
      </div>
    </div>
  );
}
export default Skills;
