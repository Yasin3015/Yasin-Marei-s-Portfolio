"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import { motion } from "framer-motion";

type TabKey = "projects" | "experience";

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-lg border text-sm sm:text-base font-cairo transition-colors",
        active
          ? "border-[#A07CFE]/60 bg-[#0E162B]/70 text-white"
          : "border-white/10 bg-[#0E162B]/30 text-gray-300 hover:border-[#A07CFE]/30 hover:text-white"
      )}
    >
      {children}
    </button>
  );
}

export default function WorkTabs() {
  const [activeTab, setActiveTab] = useState<TabKey>("projects");

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#projects") {
        setActiveTab("projects");
      } else if (hash === "#experience") {
        setActiveTab("experience");
      }
    };

    handleHashChange(); // Check hash on mount

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <section className="container my-10">
      {/* anchors to keep existing nav working */}
      <span id="projects" className="block relative -top-24" />
      <span id="experience" className="block relative -top-24" />

      <div className="pt-14 pb-6 flex flex-col items-center gap-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="mx-auto text-center font-cairo font-bold tracking-[0.18em] text-3xl sm:text-4xl md:text-6xl text-white drop-shadow-sm"
        >
          WORK
        </motion.div>
        <div className="flex items-center gap-3">
          <TabButton 
            active={activeTab === "projects"} 
            onClick={() => {
              setActiveTab("projects");
              window.history.pushState(null, "", "#projects");
            }}
          >
            Projects
          </TabButton>
          <TabButton
            active={activeTab === "experience"}
            onClick={() => {
              setActiveTab("experience");
              window.history.pushState(null, "", "#experience");
            }}
          >
            Experience
          </TabButton>
        </div>
      </div>

      {activeTab === "projects" ? (
        <Projects embedded />
      ) : (
        <Experience embedded cardMaxWidthClassName="max-w-[760px]" />
      )}
    </section>
  );
}

