"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, collection, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { GradualSpacing } from "./ui/GradualSpacing";
import { ShineBorder } from "./ui/ShineBorder";
import { aboutData as staticAboutData } from "@/data";
import { CldImage } from "next-cloudinary";
import {
  extractCloudinaryPublicId,
  formatImageUrl,
  isCloudinaryUrl,
  isRemoteUrl,
} from "@/lib/utils";

function About() {
  const [aboutText, setAboutText] = useState("I am Yassin Abdelaal Marei, a passionate Front-End Developer with hands-on experience in building responsive, accessible, and high-performance web applications. Over the past years, I have contributed to real-world projects across different industries, including e-commerce platforms, corporate websites, and cultural initiatives. I specialize in modern JavaScript frameworks such as React.js, Next.js, and TypeScript, focusing on delivering scalable solutions with clean architecture and seamless user experiences. With a strong foundation in UI/UX design principles, API integration, and performance optimization, I strive to transform ideas into impactful digital products that drive real value.");
  const [aboutData, setAboutData] = useState(staticAboutData);
  const [profileImg, setProfileImg] = useState("280");
  const normalizedProfileImg = formatImageUrl(profileImg);
  const useCloudinaryImage =
    !!normalizedProfileImg &&
    (!isRemoteUrl(normalizedProfileImg) || isCloudinaryUrl(normalizedProfileImg));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "settings", "global");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.aboutText) setAboutText(data.aboutText);
          if (data.profileImgUrl) setProfileImg(data.profileImgUrl);
        }

        const projCol = collection(db, "projects");
        const clientsSnap = 5;
        const projSnap = await getCountFromServer(projCol);
        const projectsCount = projSnap.data().count;

        const date = new Date();
        const yearsOfExperience = date.getFullYear() - 2024;
        
        setAboutData([
          { number: yearsOfExperience, text: "Years of Experience" },
          { number: projectsCount > 0 ? projectsCount : 15, text: "Projects Completed" },
          { number: clientsSnap, text: "Clients" }
        ]);
      } catch (error) {
        console.error("Failed to fetch settings from Firebase");
      }
    };
    fetchData();
  }, []);

  return (
    <section id="about">
      <div className="flex flex-col items-center justify-center w-full py-20 container">
        <GradualSpacing text="About Me" className="mb-2" />
        <ShineBorder
          className="relative w-full flex-col overflow-hidden rounded-2xl border !bg-[#020617] md:shadow-xl p-5 sm:p-8 lg:p-10"
          color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
        >
          <div className="absolute -top-24 right-0 h-56 w-56 rounded-full bg-[#A07CFE]/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 left-4 h-48 w-48 rounded-full bg-[#FE8FB5]/15 blur-3xl pointer-events-none" />

          <div className="relative grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 lg:gap-10 w-full font-cairo items-start">
            <div className="mx-auto lg:mx-0 w-full max-w-[320px] rounded-2xl border border-white/10 bg-[#0B1226]/80 p-4">
              <div className="rounded-2xl overflow-hidden aspect-square bg-[#0E162B]">
                {useCloudinaryImage ? (
                  <CldImage
                    src={extractCloudinaryPublicId(normalizedProfileImg)}
                    alt="Yasin Marei"
                    width={500}
                    height={500}
                    className="w-full h-full object-cover"
                    quality="auto"
                    format="auto"
                    gravity="face"
                    crop="fill"
                  />
                ) : (
                  <img
                    src={normalizedProfileImg}
                    alt="Yasin Marei"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="mt-4 rounded-xl border border-[#A07CFE]/25 bg-[#0E162B]/70 px-3 py-2 text-center text-xs sm:text-sm tracking-wider text-[#C9B8FF]">
                Front-End Developer
              </div>
            </div>

            <div className="text-start">
              <p className="whitespace-pre-wrap leading-8 text-sm sm:text-base lg:text-lg text-gray-200">
                {aboutText}
              </p>
              <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {aboutData.map((item, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-white/10 bg-[#0B1226]/70 p-4 text-center hover:border-[#A07CFE]/45 transition-colors"
                  >
                    <div className="text-2xl sm:text-3xl font-bold text-white">+{item.number}</div>
                    <div className="mt-1 text-xs sm:text-sm text-gray-300">{item.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ShineBorder>
      </div>
    </section>
  );
}
export default About;
