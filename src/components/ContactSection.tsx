import { useState } from "react";
import { Send, Mail, CheckCircle, Loader2 } from "lucide-react";
import { RevealSection } from "./ScrollReveal";
import MotionCard from "./MotionCard";

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'success' | 'error' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      });

      if (response.ok) {
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
      } else {
        throw new Error('Send failed');
      }
    } catch (error) {
      console.error('Send error:', error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
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
                    name="from_name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl border border-border bg-card/55 px-4 py-3 font-sans text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Email</label>
                  <input
                    type="email"
                    required
                    name="from_email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-xl border border-border bg-card/55 px-4 py-3 font-sans text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Message</label>
                <textarea
                  required
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full resize-none rounded-xl border border-border bg-card/55 px-4 py-3 font-sans text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Tell us about your idea or project..."
                />
              </div>
              <button
                disabled={loading}
                type="submit"
                className="neural-button flex items-center gap-2 rounded-xl px-8 py-3.5 type-button disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </MotionCard>
        </RevealSection>

        {status === 'success' && (
          <RevealSection delay={200}>
            <div className="mt-8 flex items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/10 p-4 text-foreground shadow-[0_0_24px_rgba(34,211,238,0.08)]">
              <CheckCircle size={20} />
              <span>Message sent successfully! We'll get back to you soon.</span>
            </div>
          </RevealSection>
        )}
        {status === 'error' && (
          <RevealSection delay={200}>
            <div className="mt-8 flex items-center justify-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-destructive">

            </div>
          </RevealSection>
        )}
        <RevealSection delay={200}>
          <div className="mt-8 text-center">
            <a
              href="mailto:team.abhinavan@gmail.com"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <Mail size={16} />
              Or email: team.abhinavan@gmail.com
            </a>
          </div>
        </RevealSection>
      </div>
    </section>
  );
};

export default ContactSection;
