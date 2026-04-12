import { useState } from "react";
import { Send, Mail } from "lucide-react";
import { RevealSection } from "./ScrollReveal";

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailto = `mailto:team.abhinavan@gmail.com?subject=Collaboration from ${form.name}&body=${encodeURIComponent(form.message)}%0A%0AFrom: ${form.name} (${form.email})`;
    window.open(mailto);
  };

  return (
    <section id="contact" className="section-padding relative">
      <div className="container mx-auto max-w-4xl">
        <RevealSection>
          <div className="text-center mb-14">
            <p className="text-primary font-mono text-sm mb-3 tracking-widest uppercase">Get In Touch</p>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Let's Build the Future <span className="text-gradient">with AI</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Whether it's a hackathon collab, research partnership, or just a chat about AI — we're always open.
            </p>
          </div>
        </RevealSection>

        <RevealSection delay={100}>
          <form onSubmit={handleSubmit} className="glass-card p-8 md:p-10 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Message</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
                placeholder="Tell us about your idea or project..."
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity glow-blue"
            >
              <Send size={18} />
              Send Message
            </button>
          </form>
        </RevealSection>

        <RevealSection delay={200}>
          <div className="mt-8 text-center">
            <a href="mailto:team.abhinavan@gmail.com" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
              <Mail size={16} />
              team.abhinavan@gmail.com
            </a>
          </div>
        </RevealSection>
      </div>
    </section>
  );
};

export default ContactSection;
