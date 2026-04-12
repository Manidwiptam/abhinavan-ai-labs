import { useState } from "react";
import { Send, Mail } from "lucide-react";
import { RevealSection } from "./ScrollReveal";
import MotionCard from "./MotionCard";

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
          <div className="mb-14 text-center">
            <p className="type-eyebrow mb-3">Get In Touch</p>
            <h2 className="type-section-heading mb-4">
              Let&apos;s Build the Future <span className="text-gradient">with AI</span>
            </h2>
            <p className="mx-auto max-w-xl text-lg text-muted-foreground">
              Whether it&apos;s a hackathon collab, research partnership, or just a chat about AI, we&apos;re always open.
            </p>
          </div>
        </RevealSection>

        <RevealSection delay={100}>
          <MotionCard className="p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl border border-border bg-muted/50 px-4 py-3 font-sans text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary/50 focus:outline-none"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-xl border border-border bg-muted/50 px-4 py-3 font-sans text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary/50 focus:outline-none"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full resize-none rounded-xl border border-border bg-muted/50 px-4 py-3 font-sans text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary/50 focus:outline-none"
                  placeholder="Tell us about your idea or project..."
                />
              </div>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-primary-foreground type-button transition-opacity hover:opacity-90 glow-blue"
              >
                <Send size={18} />
                Send Message
              </button>
            </form>
          </MotionCard>
        </RevealSection>

        <RevealSection delay={200}>
          <div className="mt-8 text-center">
            <a
              href="mailto:team.abhinavan@gmail.com"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
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
