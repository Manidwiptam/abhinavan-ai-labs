import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import abhinavanLogo from "@/assets/abhinavan-logo.png";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Hackathons", href: "#hackathons" },
  { label: "Team", href: "#team" },
  { label: "Skills", href: "#skills" },
  { label: "Stats", href: "#stats" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const sections = navLinks.map((link) => document.querySelector(link.href));

    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
      const triggerPoint = window.innerHeight * 0.28;
      let active = 0;

      sections.forEach((section, index) => {
        if (!section) return;
        const rect = section.getBoundingClientRect();
        if (rect.top <= triggerPoint && rect.bottom > triggerPoint) {
          active = index;
        }
      });

      setActiveIndex(active);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useLayoutEffect(() => {
    const node = buttonRefs.current[activeIndex];
    const container = containerRef.current;

    if (!node || !container) return;

    const rect = node.getBoundingClientRect();
    const parentRect = container.getBoundingClientRect();

    setIndicator({
      left: rect.left - parentRect.left + 8,
      width: Math.max(48, rect.width - 16),
    });
  }, [activeIndex, mobileOpen]);

  const handleClick = (href: string, index?: number) => {
    setMobileOpen(false);
    if (typeof index === "number") setActiveIndex(index);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed inset-x-0 top-4 z-50 px-4 transition-all duration-500">
      <div
        className={`navbar-shell mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-[2rem] px-4 py-3 transition-all duration-500 ${
          scrolled ? "shadow-[0_35px_70px_rgba(6,9,23,0.25)]" : "shadow-[0_24px_52px_rgba(6,9,23,0.18)]"
        }`}
      >
        <button
          type="button"
          className="flex items-center gap-3 rounded-3xl px-3 py-2 transition-transform duration-300 hover:scale-[1.01]"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <img src={abhinavanLogo} alt="Abhinavan" className="h-9 w-9 object-contain" />
          <span className="font-display text-base font-semibold tracking-[-0.03em] text-foreground">ABHINAVAN</span>
        </button>

        <div className="relative hidden items-center gap-1 md:flex" ref={containerRef}>
          <motion.span
            className="absolute bottom-1 h-0.5 rounded-full bg-gradient-to-r from-cyan to-violet shadow-[0_0_20px_rgba(56,189,248,0.32)]"
            animate={{ left: indicator.left, width: indicator.width }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            style={{ width: indicator.width }}
          />

          {navLinks.map((link, index) => (
            <button
              key={link.href}
              type="button"
              ref={(element) => {
                buttonRefs.current[index] = element;
              }}
              onClick={() => handleClick(link.href, index)}
              className={`navbar-link group ${activeIndex === index ? "navbar-link-active" : "text-muted-foreground"}`}
            >
              {link.label}
              <span
                className={`absolute inset-0 rounded-full transition-opacity duration-300 pointer-events-none ${
                  activeIndex === index ? "opacity-20" : "opacity-0 group-hover:opacity-100"
                }`}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => handleClick("#contact")}
          className="hidden rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:opacity-90 glow-blue md:inline-flex"
        >
          Collaborate
        </button>

        <button className="md:hidden text-foreground p-2" type="button" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border animate-fade-in">
          <div className="flex flex-col py-4 px-6 gap-2">
            {navLinks.map((link, index) => (
              <button
                key={link.href}
                type="button"
                onClick={() => handleClick(link.href, index)}
                className="rounded-3xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-cyan/10 hover:text-foreground text-left"
              >
                {link.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleClick("#contact", navLinks.length - 1)}
              className="mt-2 rounded-3xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:opacity-90"
            >
              Collaborate
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
