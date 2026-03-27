"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FaLocationArrow } from "react-icons/fa6";
import { Spotlight } from "./ui/Spotlight";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";
import MagicButton from "./ui/MagicButton";
import Link from "next/link";
import { AnimatedGridPattern } from "./ui/AnimatedBgHero";
import { cn } from "@/lib/utils";
import { FadeText } from "./ui/FadeText";
import { cvUrl as staticCvUrl } from "@/data";

const Hero = () => {
  const [title, setTitle] = useState("Hi! I'm Yasin Marei, a Front-End Developer working with React & Next.js");
  const [cvUrl, setCvUrl] = useState(staticCvUrl);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "global");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.title) setTitle(data.title);
          if (data.cvUrl) setCvUrl(data.cvUrl);
        }
      } catch (error) {
        console.error("Failed to fetch settings", error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="pb-20 pt-36">
      <div>
        <Spotlight
          className="-top-[1200px] left-0 md:left-[16%] md:-top-[15%]"
          fill="white"
        />
      </div>
      <AnimatedGridPattern
        numSquares={10}
        maxOpacity={0.1}
        duration={3}
        className={cn(
          "[mask-image:radial-gradient(circle_at_center,white,transparent)]",
          "w-[80%] h-[90vh] absolute top-0 left-1/2 transform -translate-x-1/2"
        )}
      />
      <div className="flex justify-center relative my-20 z-10">
        <div className="max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center">
          <FadeText
            className="uppercase tracking-[2px] text-xs !text-center text-blue-100"
            direction="down"
            text="Crafting Digital Experiences with Modern Web Tech"
          />
          <TextGenerateEffect
            words="First impressions last so make it count"
            className="text-center text-[40px] md:text-5xl lg:text-7xl max-w-[800px] font-extrabold"
          />
          <div className="text-center md:tracking-wider mb-4 text-sm md:text-lg lg:text-2xl mt-4 text-gray-300">
            {title}
          </div>
          <FadeText
            text=""
            direction="up"
            framerProps={{
              show: { transition: { delay: 0.5 } },
            }}
          >
            <div className="flex gap-5 mt-5 md:mt-0">
              <Link href={cvUrl} target="_blank">
                <MagicButton
                  title="Download CV"
                  icon={<FaLocationArrow />}
                  position="right"
                />
              </Link>
              <Link href="#projects">
                <MagicButton
                  title="Show my work"
                  icon={<FaLocationArrow />}
                  position="right"
                />
              </Link>
            </div>
          </FadeText>
        </div>
      </div>
    </div>
  );
};

export default Hero;
