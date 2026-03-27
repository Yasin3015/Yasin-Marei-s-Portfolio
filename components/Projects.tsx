"use client";

import { useEffect, useState } from "react";
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
      {!embedded && (
        // Lazy import removed in tabs mode; keep old page usage compatible if needed
        <div className="pt-0" />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-10 sm:mt-10">
        {projects.map((project) => (
          <MagicCard key={project.id}>
            <div className="flex flex-col items-center w-full h-full transform hover:shadow-xl transition-shadow duration-500">
              <div className="relative w-full h-80 rounded-sm overflow-hidden bg-[#020617]">
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
                        className="rounded w-full object-cover transform hover:scale-105 transition-transform duration-500"
                      />
                    );
                  }

                  return (
                    <img
                      src={normalizedImage}
                      alt={project.title}
                      className="rounded w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  );
                })()}
              </div>
              <div className="pt-5 w-full">
                <h2 className="text-2xl font-bold line-clamp-1 h-[32px]">
                  {project.title}
                </h2>
                <p className="mt-3 text-sm text-white-100 line-clamp-2 h-[45px]">
                  {project.des}
                </p>
                <div className="flex justify-between items-center gap-x-3 mt-5">
                  <div className="flex -space-x-1 overflow-hidden ps-1 py-2">
                    {project.iconsList?.map((icon: string, index: number) => (
                      <div
                        key={index}
                        className="border rounded-full bg-gradient-to-r from-[#04071D] to-[#0C0E23] lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center"
                        style={{
                          transform: `translateX(-${5 * index + 2}px)`,
                        }}
                      >
                        {icon.includes("/") && !icon.includes(" ") ? (
                          <img
                            src={icon}
                            alt="tech icon"
                            className="p-2 w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-[10px] sm:text-xs text-[#A07CFE] line-clamp-1 px-1">
                            {icon}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-4 text-white-100 text-xs sm:text-lg">
                    {project.sourceCode && (
                      <Link
                        href={project.sourceCode}
                        target="_Blank"
                        className="flex items-center justify-center gap-1 hover:text-[#A07CFE] transition-colors"
                      >
                        GitHub <FaLocationArrow />
                      </Link>
                    )}
                    <Link
                      href={project.link}
                      target="_Blank"
                      className="flex items-center justify-center gap-1 hover:text-[#A07CFE] transition-colors"
                    >
                      Demo <FaLocationArrow />
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

  return (
    embedded ? (
      content
    ) : (
      <section id="projects">
        {content}
      </section>
    )
  );
}
export default Projects;
