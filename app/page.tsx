import About from "@/components/About";
import Hero from "@/components/Hero";
import { FloatingNav } from "@/components/ui/FloatingNav";
import AppShell from "@/components/AppShell";
import dynamic from "next/dynamic";

// Lazy load below-fold sections for faster initial page load
const LazySkills = dynamic(() => import("@/components/Skills"), { ssr: true });
const LazyWorkTabs = dynamic(() => import("@/components/WorkTabs"), { ssr: true });
const LazyContact = dynamic(() => import("@/components/Contact"), { ssr: true });
const LazyFooter = dynamic(() => import("@/components/Footer"), { ssr: true });

export default function Home() {
  return (
    <AppShell>
      <main className="relative bg-black-100 text-white flex justify-center items-center flex-col overflow-clip mx-auto sm:px-10 px-5">
        <div className="max-w-7xl w-full">
          <FloatingNav navItems={[
            { name: "About", link: "#about" },
            { name: "Projects", link: "#projects" },
            { name: "Experience", link: "#experience" },
            { name: "Contact", link: "#contact" },
          ]} />
          <Hero />
          <About />
          <LazySkills />
          <LazyWorkTabs />
          <LazyContact />
        </div>
        <LazyFooter />
      </main>
    </AppShell>
  );
}
