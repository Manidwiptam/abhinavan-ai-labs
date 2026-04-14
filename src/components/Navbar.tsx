import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu } from "lucide-react";
import abhinavanLogo from "@/assets/abhinavan-loader.png";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Hackathons", href: "#hackathons" },
  { label: "Team", href: "#team" },
  { label: "Skills", href: "#skills" },
  { label: "Stats", href: "#stats" },
  { label: "Contact", href: "#contact" },
] as const;

const FLOATING_OFFSET = 104;

const Navbar = () => {
  const reduceMotion = useReducedMotion();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHref, setActiveHref] = useState<(typeof navLinks)[number]["href"]>("#about");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const setFromHash = () => {
      const hash = window.location.hash as (typeof navLinks)[number]["href"];
      if (navLinks.some((link) => link.href === hash)) {
        setActiveHref(hash);
      }
    };

    setFromHash();
    window.addEventListener("hashchange", setFromHash);
    return () => window.removeEventListener("hashchange", setFromHash);
  }, []);

  useEffect(() => {
    const updateActiveSection = () => {
      const markerPosition = window.scrollY + FLOATING_OFFSET + 40;
      const pageBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;

      if (pageBottom) {
        setActiveHref(navLinks[navLinks.length - 1].href);
        return;
      }

      let currentSection = navLinks[0].href;
      for (const link of navLinks) {
        const section = document.querySelector<HTMLElement>(link.href);
        if (!section) {
          continue;
        }

        if (markerPosition >= section.offsetTop) {
          currentSection = link.href;
        } else {
          break;
        }
      }

      setActiveHref((previous) => (previous === currentSection ? previous : currentSection));
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  const scrollToSection = (href: (typeof navLinks)[number]["href"]) => {
    setMobileOpen(false);

    const targetSection = document.querySelector<HTMLElement>(href);
    if (!targetSection) {
      return;
    }

    const targetTop = targetSection.getBoundingClientRect().top + window.scrollY - FLOATING_OFFSET;
    window.history.replaceState(null, "", href);
    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  const scrollToTop = () => {
    setMobileOpen(false);
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <motion.nav
      className="fixed left-0 right-0 top-4 z-50 px-3 sm:px-6"
      initial={false}
      animate={{ y: 0, opacity: 1 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-5">
        <a
          href="#"
          onClick={(event) => {
            event.preventDefault();
            scrollToTop();
          }}
          className="group relative z-10 inline-flex items-center gap-1.5"
          aria-label="Scroll to top"
        >
          <img
            src={abhinavanLogo}
            alt="Abhinavan"
            className="h-11 w-11 object-contain transition-transform duration-300 group-hover:scale-110"
          />
          <span className="font-display text-base font-bold tracking-[-0.03em] text-foreground sm:text-lg">
            ABHINAVAN
          </span>
        </a>

        <div
          className={cn(
            "relative z-10 hidden overflow-hidden rounded-full border border-primary/25 bg-card/60 px-4 py-1.5 md:flex items-center backdrop-blur-xl",
            scrolled
              ? "shadow-[inset_0_1px_0_rgba(248,250,252,0.14),0_0_24px_rgba(34,211,238,0.14),0_0_56px_rgba(139,92,246,0.12)]"
              : "shadow-[inset_0_1px_0_rgba(248,250,252,0.1),0_0_20px_rgba(34,211,238,0.1),0_0_42px_rgba(139,92,246,0.08)]",
          )}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/12 via-secondary/5 to-transparent"
          />
          {!reduceMotion && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-primary/25 to-transparent"
              animate={{ x: ["0%", "260%"] }}
              transition={{ duration: 5.8, repeat: Infinity, ease: "linear", repeatDelay: 1.2 }}
            />
          )}
          <NavigationMenu className="relative z-10">
            <NavigationMenuList className="gap-1">
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <NavigationMenuLink asChild>
                    <a
                      href={link.href}
                      onClick={(event) => {
                        event.preventDefault();
                        scrollToSection(link.href);
                      }}
                      aria-current={activeHref === link.href ? "page" : undefined}
                      className={cn(
                        "relative rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                        activeHref === link.href ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {link.label}
                      {activeHref === link.href && (
                        <motion.span
                          layout
                          layoutId="active-nav-underline"
                          className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-[hsl(var(--highlight))] shadow-[0_0_12px_rgba(66,165,245,0.55)]"
                          transition={{ type: "spring", stiffness: 260, damping: 28 }}
                        />
                      )}
                    </a>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="relative z-10 hidden md:block">
          <Button
            onClick={() => scrollToSection("#contact")}
            className="neural-button rounded-full px-5 type-button"
          >
            Collaborate
          </Button>
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative z-10 rounded-full border border-primary/30 bg-card/60 text-foreground hover:bg-primary/10 md:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[86%] border-primary/20 bg-background/90 pt-12 backdrop-blur-2xl sm:max-w-sm"
          >
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <AnimatePresence mode="wait">
              {mobileOpen && (
                <motion.div
                  key="mobile-nav"
                  initial={reduceMotion ? undefined : "hidden"}
                  animate={reduceMotion ? undefined : "visible"}
                  exit={reduceMotion ? undefined : "hidden"}
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.06, delayChildren: 0.05 },
                    },
                  }}
                  className="mt-6 flex flex-col gap-2"
                >
                  {navLinks.map((link) => (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      onClick={(event) => {
                        event.preventDefault();
                        scrollToSection(link.href);
                      }}
                      className={cn(
                        "rounded-xl px-4 py-3.5 text-base font-medium transition-colors",
                        activeHref === link.href
                          ? "bg-[rgba(25,118,210,0.12)] text-foreground"
                          : "text-muted-foreground hover:bg-primary/10 hover:text-foreground",
                      )}
                      variants={{
                        hidden: { x: 18, opacity: 0 },
                        visible: { x: 0, opacity: 1 },
                      }}
                    >
                      {link.label}
                    </motion.a>
                  ))}

                  <motion.div
                    variants={{
                      hidden: { y: 10, opacity: 0 },
                      visible: { y: 0, opacity: 1 },
                    }}
                    className="pt-2"
                  >
                    <Button
                      onClick={() => scrollToSection("#contact")}
                      className="neural-button w-full rounded-xl py-6 text-base type-button"
                    >
                      Collaborate
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </SheetContent>
        </Sheet>
      </div>
    </motion.nav>
  );
};

export default Navbar;
