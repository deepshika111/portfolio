import SmoothScroll from "@/components/SmoothScroll";
import Loader from "@/components/Loader";
import Cursor from "@/components/Cursor";
import Stamper from "@/components/Stamper";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Work from "@/components/Work";
import Record from "@/components/Record";
import Subjects from "@/components/Subjects";
import Contact from "@/components/Contact";
import { CaseStudyProvider } from "@/components/CaseStudy";

export default function Home() {
  return (
    <SmoothScroll>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-cocoa focus:px-4 focus:py-2 focus:text-card"
      >
        Skip to content
      </a>
      <Loader />
      <Cursor />
      <Stamper />
      <CaseStudyProvider>
        <Nav />
        <main id="main">
          <Hero />
          <About />
          <Work />
          <Record />
          <Subjects />
        </main>
        <Contact />
      </CaseStudyProvider>
    </SmoothScroll>
  );
}
