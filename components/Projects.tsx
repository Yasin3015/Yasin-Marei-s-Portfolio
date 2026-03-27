"use client";

import { useEffect, useRef, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { projects as staticProjects } from "@/data";
import { MagicCard } from "./ui/Card";
import { CldImage } from "next-cloudinary";
import {
  extractCloudinaryPublicId,
  formatImageUrl,
  isCloudinaryUrl,
  isRemoteUrl,
} from "@/lib/utils";
import Link from "next/link";
import { FaLocationArrow } from "react-icons/fa6";
import MagicButton from "./ui/MagicButton";

/* ─── small helper for the per-card "Read more" toggle ─── */
function ProjectDescription({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [clamped, setClamped] = useState(false); // is currently clamped
  const [showBtn, setShowBtn] = useState(false); // does text overflow 2 lines

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // check on mount + resize
    const check = () => {
      if (el.scrollHeight > el.clientHeight + 1) {
        setShowBtn(true);
      }
    };
    setClamped(true); // start clamped
    // wait a tick for layout
    requestAnimationFrame(check);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [text]);

  return (
    <div>
      <p
        ref={ref}
        className={`text-sm leading-relaxed text-[#BEC1DD] transition-all duration-300 ${
          clamped ? "line-clamp-2" : ""
        }`}
      >
        {text}
      </p>
      {showBtn && (
        <button
          type="button"
          onClick={() => setClamped((v) => !v)}
          className="mt-1 text-xs font-medium text-[#A07CFE] hover:text-[#c4a8ff] transition-colors cursor-pointer"
        >
          {clamped ? "Read more ↓" : "Read less ↑"}
        </button>
      )}
    </div>
  );
}

/* ─── main component ─── */
type ProjectsProps = {
  embedded?: boolean;
};

function Projects({ embedded = false }: ProjectsProps) {
  const [projects, setProjects] = useState<any[]>(staticProjects);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const data: any[] = [];
          querySnapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
          setProjects(data);
        }
      } catch (error) {
        console.error("Failed to fetch projects from Firebase", error);
      }
    };
    fetchProjects();
  }, []);

  const content = (
    <div className={`${embedded ? "my-0" : "my-10"} ${embedded ? "" : "container"}`}>
      {!embedded && <div className="pt-0" />}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 sm:mt-10">
        {projects.map((project) => (
          <MagicCard key={project.id}>
            <div className="flex flex-col w-full group/card">
              {/* ── image ── */}
              <div className="relative w-full aspect-[16/10] rounded-[15px] overflow-hidden bg-[#020617]">
                {(() => {
                  const normalizedImage = formatImageUrl(project.img);
                  const useCloudinaryImage =
                    !!normalizedImage &&
                    (!isRemoteUrl(normalizedImage) || isCloudinaryUrl(normalizedImage));

                  if (useCloudinaryImage) {
                    return (
                      <CldImage
                        src={extractCloudinaryPublicId(normalizedImage)}
                        alt={project.title}
                        fill
                        crop="fill"
                        gravity="auto"
                        quality="auto"
                        format="auto"
                        loading="lazy"
                        className="rounded-[15px] w-full object-cover transform group-hover/card:scale-105 transition-transform duration-700 ease-out"
                      />
                    );
                  }

                  return (
                    <img
                      src={normalizedImage}
                      alt={project.title}
                      className="rounded-[15px] w-full h-full object-cover transform group-hover/card:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                  );
                })()}
                {/* gradient overlay at bottom of image */}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#020617]/80 to-transparent pointer-events-none rounded-b-[15px]" />
              </div>

              {/* ── content ── */}
              <div className="pt-4 pb-1 flex flex-col gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white line-clamp-1">
                  {project.title}
                </h2>

                <ProjectDescription text={project.des} />

                {/* separator */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-[#A07CFE]/30 to-transparent my-1" />

                {/* footer: tech icons + links */}
                <div className="flex justify-between items-center gap-x-3">
                  {/* tech icons */}
                  <div className="flex -space-x-1 overflow-hidden ps-1 py-1">
                    {project.iconsList?.map((icon: string, index: number) => (
                      <div
                        key={index}
                        className="border border-white/10 rounded-full bg-gradient-to-r from-[#04071D] to-[#0C0E23] lg:w-9 lg:h-9 w-7 h-7 flex justify-center items-center shadow-sm"
                        style={{
                          transform: `translateX(-${5 * index + 2}px)`,
                        }}
                      >
                        {icon.includes("/") && !icon.includes(" ") ? (
                          <img
                            src={icon}
                            alt="tech icon"
                            className="p-1.5 w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-[10px] sm:text-xs text-[#A07CFE] line-clamp-1 px-1">
                            {icon}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* links */}
                  <div className="flex items-center justify-center gap-3 text-white-100 text-xs sm:text-sm shrink-0">
                    {project.sourceCode && (
                      <Link
                        href={project.sourceCode}
                        target="_Blank"
                        className="flex items-center justify-center gap-1 hover:text-[#A07CFE] transition-colors duration-300"
                      >
                        GitHub <FaLocationArrow className="text-[10px]" />
                      </Link>
                    )}
                    <Link
                      href={project.link}
                      target="_Blank"
                      className="flex items-center justify-center gap-1 hover:text-[#A07CFE] transition-colors duration-300"
                    >
                      Demo <FaLocationArrow className="text-[10px]" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </MagicCard>
        ))}
      </div>
      <div className="flex items-center justify-center mt-5">
        <Link href={"https://github.com/Yasin3015"} target="_Blank">
          <MagicButton title="View All Projects" icon={<FaLocationArrow />} position="right" />
        </Link>
      </div>
    </div>
  );

  return embedded ? (
    content
  ) : (
    <section id="projects">{content}</section>
  );
}
export default Projects;
