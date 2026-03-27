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

/* ─── Skeleton Card ───────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="relative w-full rounded-lg border border-white/10 bg-[#020617] p-5 sm:p-7 shadow-xl overflow-hidden">
      {/* shimmer overlay */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* title */}
      <div className="h-6 sm:h-7 w-3/4 rounded-md bg-white/[0.06]" />
      {/* company */}
      <div className="mt-3 h-5 w-2/5 rounded-md bg-white/[0.06]" />
      {/* description lines */}
      <div className="mt-5 space-y-2.5">
        <div className="h-4 w-full rounded bg-white/[0.04]" />
        <div className="h-4 w-11/12 rounded bg-white/[0.04]" />
        <div className="h-4 w-4/5 rounded bg-white/[0.04]" />
      </div>
    </div>
  );
}

/* ─── Skeleton Timeline ───────────────────────────────────── */
function ExperienceSkeleton() {
  return (
    <div className="relative">
      {/* ── MOBILE skeleton (< md) ── */}
      <div className="block md:hidden">
        {/* left timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-white/10 via-white/5 to-transparent" />

        {[0, 1].map((i) => (
          <div key={i} className="relative pl-12 py-5">
            {/* dot */}
            <div className="absolute left-[7px] top-7 h-5 w-5 rounded-full border-[3px] border-white/10 bg-[#020617]" />
            {/* duration badge */}
            <div className="mb-3 h-6 w-32 rounded-full bg-white/[0.06]" />
            <SkeletonCard />
          </div>
        ))}
      </div>

      {/* ── DESKTOP skeleton (≥ md) ── */}
      <div className="hidden md:block">
        {/* center line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-gradient-to-b from-white/10 via-white/5 to-transparent" />

        {[0, 1].map((i) => {
          const isLeft = i % 2 === 0;
          return (
            <div key={i} className="relative grid grid-cols-2 gap-14 py-6">
              {isLeft ? (
                <>
                  <div className="flex justify-end">
                    <div className="w-full max-w-[760px]">
                      <SkeletonCard />
                    </div>
                  </div>
                  <div />
                </>
              ) : (
                <>
                  <div />
                  <div className="flex justify-start">
                    <div className="w-full max-w-[760px]">
                      <SkeletonCard />
                    </div>
                  </div>
                </>
              )}

              {/* dot */}
              <div className="absolute left-1/2 top-10 -translate-x-1/2 flex flex-col items-center">
                <div className="h-6 w-6 rounded-full bg-[#020617] border-4 border-white/10" />
                <div className="mt-2 h-6 w-28 rounded-full bg-white/[0.06]" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Experience Card (reusable) ──────────────────────────── */
function ExperienceCard({
  exp,
  maxWidth,
}: {
  exp: ExperienceItem;
  maxWidth: string;
}) {
  return (
    <ShineBorder
      className={`relative w-full ${maxWidth} flex-col overflow-hidden rounded-lg border !bg-[#020617] p-5 sm:p-7 text-start shadow-xl`}
      color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
    >
      <h3 className="text-lg sm:text-2xl font-bold text-white tracking-wide">
        {exp.title}
      </h3>
      <div className="flex items-center gap-2 mt-1.5 sm:mt-2 mb-3 sm:mb-4">
        <span className="text-[#A07CFE] font-semibold text-base sm:text-lg">
          {exp.company}
        </span>
      </div>
      <p className="text-sm sm:text-base text-gray-300 whitespace-pre-wrap leading-relaxed">
        {exp.description}
      </p>
    </ShineBorder>
  );
}

/* ─── Main Component ──────────────────────────────────────── */
export default function Experience({
  embedded = false,
  cardMaxWidthClassName = "max-w-[680px]",
}: ExperienceProps) {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);

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
                a.createdAt &&
                typeof a.createdAt === "object" &&
                "toMillis" in a.createdAt
                  ? a.createdAt.toMillis()
                  : a.createdAt;
              const bMsRaw =
                b.createdAt &&
                typeof b.createdAt === "object" &&
                "toMillis" in b.createdAt
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
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  /* ── Skeleton while loading ── */
  if (loading) {
    const skeletonContent = (
      <div className={embedded ? "my-0" : "my-10 container"}>
        {!embedded && (
          <GradualSpacing text="My Experience" className="pt-14 pb-8" />
        )}
        <ExperienceSkeleton />
      </div>
    );

    return embedded ? (
      skeletonContent
    ) : (
      <section id="experience">{skeletonContent}</section>
    );
  }

  if (experiences.length === 0) return null;

  const content = (
    <div className={embedded ? "my-0" : "my-10 container"}>
      {!embedded && (
        <GradualSpacing text="My Experience" className="pt-14 pb-8" />
      )}

      <div className="relative">
        {/* ────────────────────────────────────────────────── */}
        {/*  MOBILE LAYOUT (< md): timeline on the left side  */}
        {/* ────────────────────────────────────────────────── */}
        <div className="block md:hidden">
          {/* Left-side timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#A07CFE]/70 via-[#4F46E5]/50 to-[#FE8FB5]/60 opacity-60" />

          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: index * 0.1,
              }}
              className="relative pl-12 py-5"
            >
              {/* Dot on the timeline */}
              <div className="absolute left-[7px] top-7 h-5 w-5 rounded-full bg-[#020617] border-[3px] border-[#A07CFE] shadow-[0_0_0_5px_rgba(160,124,254,0.1)]" />

              {/* Duration badge */}
              <div className="mb-3 inline-block text-[11px] bg-[#020617]/80 border border-white/10 text-gray-300 rounded-full px-3 py-1 whitespace-nowrap">
                {exp.duration}
              </div>

              {/* Card */}
              <ExperienceCard exp={exp} maxWidth={cardMaxWidthClassName} />
            </motion.div>
          ))}
        </div>

        {/* ────────────────────────────────────────────────── */}
        {/*  DESKTOP LAYOUT (≥ md): centered timeline          */}
        {/* ────────────────────────────────────────────────── */}
        <div className="hidden md:block">
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
                className="relative grid grid-cols-2 gap-14 py-6"
              >
                {isLeft ? (
                  <>
                    <div className="flex justify-end">
                      <ExperienceCard
                        exp={exp}
                        maxWidth={cardMaxWidthClassName}
                      />
                    </div>
                    <div />
                  </>
                ) : (
                  <>
                    <div />
                    <div className="flex justify-start">
                      <ExperienceCard
                        exp={exp}
                        maxWidth={cardMaxWidthClassName}
                      />
                    </div>
                  </>
                )}

                {/* Center dot + duration badge */}
                <div className="absolute left-1/2 top-10 -translate-x-1/2 flex flex-col items-center">
                  <div className="h-6 w-6 rounded-full bg-[#020617] border-4 border-[#A07CFE] shadow-[0_0_0_6px_rgba(160,124,254,0.12)]" />
                  <div className="mt-2 text-xs bg-[#020617]/80 border border-white/10 text-gray-300 rounded-full px-3 py-1 whitespace-nowrap">
                    {exp.duration}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return embedded ? (
    content
  ) : (
    <section id="experience">{content}</section>
  );
}
