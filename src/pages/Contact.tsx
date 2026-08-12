import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formDataToRecord, submitNetlifyForm } from "@/lib/netlifyForm";
import { Mail, MapPin, MessageSquare, Send, Instagram, ExternalLink, HelpCircle } from "lucide-react";

export default function Contact() {
  const [contactType, setContactType] = useState<string>("general");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setSubmitting(true);
    try {
      await submitNetlifyForm("wec-contact", {
        ...formDataToRecord(formData),
        type: contactType,
      });
      toast.success("Message sent! We'll get back to you within 2 business days.");
      form.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send message");
    } finally {
      setSubmitting(false);
    }
  };

  const contactTypes = [
    { id: "general", label: "General Inquiry", icon: MessageSquare },
    { id: "sponsorship", label: "Sponsorship", icon: ExternalLink },
    { id: "press", label: "Press & Media", icon: Mail },
    { id: "competitor_support", label: "Competitor Support", icon: HelpCircle },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cinnamon-950/20 to-transparent" />
        <div className="wec-container relative">
          <div className="max-w-4xl">
            <Mail className="w-10 h-10 text-cinnamon-400 mb-4" />
            <h1 className="text-4xl sm:text-5xl font-bold text-sand-100 mb-4">
              Get in <span className="wec-gradient-text">Touch</span>
            </h1>
            <p className="text-lg text-sand-400 max-w-2xl">
              Have a question, want to sponsor, or need competitor support? We
              are here to help.
            </p>
          </div>
        </div>
      </section>

      <section className="wec-section bg-[#140f0b]">
        <div className="wec-container">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-xl font-semibold text-sand-100 mb-6">
                Contact Information
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-cinnamon-950/50 border border-cinnamon-800/50 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-cinnamon-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-sand-200 mb-1">
                      Email
                    </h3>
                    <a
                      href="mailto:hello@worldespressochampionship.com"
                      className="text-sm text-sand-400 hover:text-cinnamon-400 transition-colors"
                    >
                      hello@worldespressochampionship.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-cinnamon-950/50 border border-cinnamon-800/50 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-cinnamon-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-sand-200 mb-1">
                      Next Event
                    </h3>
                    <p className="text-sm text-sand-400">
                      26 October 2026
                      <br />
                      Café Unido, Panama City
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-cinnamon-950/50 border border-cinnamon-800/50 flex items-center justify-center flex-shrink-0">
                    <Instagram className="w-5 h-5 text-cinnamon-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-sand-200 mb-1">
                      Social Media
                    </h3>
                    <a
                      href="https://www.instagram.com/worldespressochampionship"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-sand-400 hover:text-cinnamon-400 transition-colors"
                    >
                      @worldespressochampionship
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-cinnamon-950/50 border border-cinnamon-800/50 flex items-center justify-center flex-shrink-0">
                    <ExternalLink className="w-5 h-5 text-cinnamon-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-sand-200 mb-1">
                      Partner
                    </h3>
                    <a
                      href="https://objectivecoffeecommunity.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-sand-400 hover:text-cinnamon-400 transition-colors"
                    >
                      Objective Coffee Community (OCC)
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold text-sand-100 mb-6">
                Send a Message
              </h2>

              {/* Type Selector */}
              <div className="flex flex-wrap gap-2 mb-6">
                {contactTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setContactType(type.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                      contactType === type.id
                        ? "bg-cinnamon-600 text-sand-100"
                        : "bg-[#231a14] text-sand-400 hover:text-sand-200 border border-[#3a2a1f]"
                    }`}
                  >
                    <type.icon className="w-4 h-4" />
                    {type.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="Your Name *"
                    className="wec-input w-full px-4 py-3 rounded-lg text-sm"
                  />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="Email Address *"
                    className="wec-input w-full px-4 py-3 rounded-lg text-sm"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    name="company"
                    type="text"
                    placeholder="Company / Organisation"
                    className="wec-input w-full px-4 py-3 rounded-lg text-sm"
                  />
                  <input
                    name="phone"
                    type="text"
                    inputMode="tel"
                    placeholder="Phone Number"
                    className="wec-input w-full px-4 py-3 rounded-lg text-sm"
                  />
                </div>
                <input
                  name="subject"
                  type="text"
                  placeholder="Subject"
                  className="wec-input w-full px-4 py-3 rounded-lg text-sm"
                />
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Your message..."
                  className="wec-input w-full px-4 py-3 rounded-lg text-sm resize-none"
                />
                <Button
                  type="submit"
                  className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100"
                  disabled={submitting}
                >
                  {submitting ? "Sending..." : "Send Message"}
                  <Send className="ml-2 w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
