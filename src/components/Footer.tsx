import { Github, Linkedin } from "lucide-react";
import abhinavanLogo from "@/assets/abhinavan-mark.png";

const Footer = () => (
  <footer className="border-t border-border bg-background/50 backdrop-blur-sm">
    <div className="container mx-auto max-w-6xl py-12 px-4 md:px-8">
      <div className="grid md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src={abhinavanLogo} alt="Abhinavan" className="h-8 w-8 object-contain" />
            <span className="font-display text-lg font-bold tracking-[-0.03em] text-foreground">ABHINAVAN</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Innovation, relentless building, futuristic intelligence, and technical mastery.
          </p>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold tracking-[-0.02em] text-foreground mb-4">Quick Links</h4>
          <div className="flex flex-col gap-2">
            {["About", "Projects", "Hackathons", "Team", "Contact"].map((link) => (
              <button
                key={link}
                onClick={() => document.querySelector(`#${link.toLowerCase()}`)?.scrollIntoView({ behavior: "smooth" })}
                className="text-sm font-sans text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                {link}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold tracking-[-0.02em] text-foreground mb-4">Connect</h4>
          <div className="flex gap-3">
            <a href="https://github.com/Soumya03007" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg glass-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <Github size={18} />
            </a>
            <a href="https://www.linkedin.com/in/soumyadeeppaul7/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg glass-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <Linkedin size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Team Abhinavan. Built with passion and intelligence.
      </div>
    </div>
  </footer>
);

export default Footer;
