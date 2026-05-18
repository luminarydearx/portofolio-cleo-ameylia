import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Companies } from "@/components/sections/companies";
import { Projects } from "@/components/sections/projects";
import { Stats } from "@/components/sections/stats";
import { Services } from "@/components/sections/services";
import { Timeline } from "@/components/sections/timeline";
import { Contact } from "@/components/sections/contact";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { CursorGlow } from "@/components/ui/cursor-glow";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background">
      {/* Global effects */}
      <ScrollProgress />
      <CursorGlow />

      {/* Layout */}
      <Navbar />

      {/* Sections */}
      <Hero />
      <About />
      <Companies />
      <Projects />
      <Stats />
      <Timeline />
      <Services />
      <Contact />

      <Footer />
    </main>
  );
}
