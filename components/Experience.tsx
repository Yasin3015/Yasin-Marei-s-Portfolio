"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { GradualSpacing } from "./ui/GradualSpacing";
import { ShineBorder } from "./ui/ShineBorder";
import { motion } from "framer-motion";

type TimestampLike = { toMillis: () => number };
type CreatedAt = TimestampLike | number | null | undefined;

interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  duration: string;
  description: string;
  createdAt?: CreatedAt;
}

type ExperienceProps = {
  embedded?: boolean;
  cardMaxWidthClassName?: string;
};

export default function Experience({
  embedded = false,
  cardMaxWidthClassName = "max-w-[680px]",
}: ExperienceProps) {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "experience"));
        if (!querySnapshot.empty) {
          const data: ExperienceItem[] = [];
          querySnapshot.forEach((doc) => {
            const docData = doc.data() as Partial<ExperienceItem>;
            data.push({
              id: doc.id,
              title: docData.title ?? "",
              company: docData.company ?? "",
              duration: docData.duration ?? "",
              description: docData.description ?? "",
              createdAt: docData.createdAt,
            });
          });

          // Sort oldest -> newest so the timeline flows naturally.
          setExperiences(
            data.sort((a, b) => {
              const aMsRaw =
                a.createdAt && typeof a.createdAt === "object" && "toMillis" in a.createdAt
                  ? a.createdAt.toMillis()
                  : a.createdAt;
              const bMsRaw =
                b.createdAt && typeof b.createdAt === "object" && "toMillis" in b.createdAt
                  ? b.createdAt.toMillis()
                  : b.createdAt;

              const aMs = typeof aMsRaw === "number" ? aMsRaw : 0;
              const bMs = typeof bMsRaw === "number" ? bMsRaw : 0;

              if (aMs === bMs) return 0;
              return aMs > bMs ? 1 : -1;
            })
          );
        }
      } catch (error) {
        console.error("Failed to fetch experiences", error);
      }
    };
    fetchExperiences();
  }, []);

  if (experiences.length === 0) return null;

  const content = (
    <div className={embedded ? "my-0" : "my-10 container"}>
      {!embedded && <GradualSpacing text="My Experience" className="pt-14 pb-8" />}

      <div className="relative">
        {/* Center timeline line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-gradient-to-b from-[#A07CFE]/70 via-[#4F46E5]/50 to-[#FE8FB5]/60 opacity-60" />

        {experiences.map((exp, index) => {
          const isLeft = index % 2 === 0;

          return (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="relative grid grid-cols-1 gap-8 py-6 md:grid-cols-2 md:gap-14"
            >
              {/* Card area */}
              {isLeft ? (
                <>
                  <div className="md:col-start-1 md:col-end-2 flex justify-end">
                    <ShineBorder
                      className={`relative w-full ${cardMaxWidthClassName} flex-col overflow-hidden rounded-lg border !bg-[#020617] p-7 text-start shadow-xl`}
                      color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                    >
                      <h3 className="text-2xl font-bold text-white tracking-wide">{exp.title}</h3>
                      <div className="flex items-center gap-2 mt-2 mb-4">
                        <span className="text-[#A07CFE] font-semibold text-lg">{exp.company}</span>
                      </div>
                      <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {exp.description}
                      </p>
                    </ShineBorder>
                  </div>
                  <div className="md:col-start-2 md:col-end-3" />
                </>
              ) : (
                <>
                  <div className="md:col-start-1 md:col-end-2" />
                  <div className="md:col-start-2 md:col-end-3 flex justify-start">
                    <ShineBorder
                      className={`relative w-full ${cardMaxWidthClassName} flex-col overflow-hidden rounded-lg border !bg-[#020617] p-7 text-start shadow-xl`}
                      color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                    >
                      <h3 className="text-2xl font-bold text-white tracking-wide">{exp.title}</h3>
                      <div className="flex items-center gap-2 mt-2 mb-4">
                        <span className="text-[#A07CFE] font-semibold text-lg">{exp.company}</span>
                      </div>
                      <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {exp.description}
                      </p>
                    </ShineBorder>
                  </div>
                </>
              )}

              {/* Center dot + duration badge */}
              <div className="absolute left-1/2 top-10 -translate-x-1/2 flex flex-col items-center">
                <div className="h-6 w-6 rounded-full bg-[#020617] border-4 border-[#A07CFE] shadow-[0_0_0_6px_rgba(160,124,254,0.12)]" />
                <div className="mt-2 text-[11px] sm:text-xs bg-[#020617]/80 border border-white/10 text-gray-300 rounded-full px-3 py-1 whitespace-nowrap">
                  {exp.duration}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  return embedded ? (
    content
  ) : (
    <section id="experience">
      {content}
    </section>
  );
}
