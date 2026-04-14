import { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Brain, Mail, BarChart3, Bell, Building2, ChevronRight, Check, ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";

const features = [
  {
    icon: Shield,
    title: "AI Threat Detection",
    description: "Monitor network traffic and logs in real-time. ML models detect suspicious patterns before they become breaches.",
  },
  {
    icon: Brain,
    title: "Anomaly Detection",
    description: "Unsupervised learning algorithms flag abnormal user and system behavior instantly.",
  },
  {
    icon: Mail,
    title: "Phishing Scanner",
    description: "NLP-powered analysis of emails and URLs to identify phishing attempts with high accuracy.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Dashboard",
    description: "Visualize threats, traffic patterns, and system health with an intuitive analytics dashboard.",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "Severity-based notifications via email and SMS so your team responds to the right threats first.",
  },
  {
    icon: Building2,
    title: "Multi-Tenant",
    description: "Securely manage multiple institutions — universities, government offices, and SMEs — from one platform.",
  },
];

const plans = [
  {
    name: "Starter",
    price: "$49",
    period: "/month",
    description: "For small institutions getting started with cybersecurity",
    features: ["Up to 100 endpoints", "Basic threat detection", "Email alerts", "Dashboard access", "Community support"],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Professional",
    price: "$199",
    period: "/month",
    description: "For universities and mid-size organizations",
    features: [
      "Up to 1,000 endpoints",
      "Advanced AI detection",
      "Phishing scanner",
      "SMS & email alerts",
      "Priority support",
      "Custom reports",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For government institutions and large deployments",
    features: [
      "Unlimited endpoints",
      "Full AI suite",
      "Dedicated instance",
      "24/7 support",
      "On-premise option",
      "SLA guarantee",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const stats = [
  { value: "99.7%", label: "Threat Detection Rate" },
  { value: "<50ms", label: "Response Time" },
  { value: "200+", label: "Institutions Protected" },
  { value: "15M+", label: "Threats Blocked" },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", institution: "", message: "" });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setContactForm({ name: "", email: "", institution: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="fixed top-0 z-50 w-full border-b border-border/50 glass">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary" />
            <span className="font-heading text-xl font-bold tracking-tight">SalamaNet AI</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a>
            <Link to="/dashboard">
              <Button size="sm">Go to Dashboard <ArrowRight className="ml-1 h-4 w-4" /></Button>
            </Link>
          </div>
          <button className="md:hidden text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="border-t border-border/50 bg-background px-4 py-4 md:hidden flex flex-col gap-4">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-sm text-muted-foreground">Features</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-sm text-muted-foreground">Pricing</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-sm text-muted-foreground">Contact</a>
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button size="sm" className="w-full">Go to Dashboard</Button>
            </Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden pt-16">
        {/* Glow effects */}
        <div className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-[300px] w-[300px] rounded-full bg-accent/10 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <Badge variant="outline" className="mb-6 border-primary/30 text-primary">
            🛡️ AI-Powered Cybersecurity for Africa
          </Badge>
          <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-7xl">
            Protect Your Institution with{" "}
            <span className="text-gradient">SalamaNet AI</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
            AI-powered threat detection, anomaly monitoring, and phishing prevention — built for Africa's universities, government bodies, and public institutions.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow px-8">
                Start Free Trial <ChevronRight className="ml-1 h-5 w-5" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="outline" size="lg">See How It Works</Button>
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/50 bg-card/30">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 px-4 py-12 sm:py-16 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-heading text-3xl font-bold text-primary sm:text-4xl">{s.value}</div>
              <div className="mt-1 text-xs text-muted-foreground sm:text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <Badge variant="outline" className="mb-4 border-accent/30 text-accent">Core Capabilities</Badge>
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">Everything You Need to Stay Secure</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Purpose-built for institutions operating in resource-constrained environments.
            </p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <Card key={f.title} className="bg-gradient-card border-border/50 shadow-card hover:shadow-glow transition-shadow duration-300">
                <CardHeader>
                  <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-border/50 bg-card/20 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">Pricing</Badge>
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">Affordable Security for Every Institution</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Transparent pricing designed for African institutions. No hidden fees.
            </p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative flex flex-col border-border/50 shadow-card ${plan.popular ? "border-primary/50 shadow-glow" : "bg-gradient-card"}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-primary text-primary-foreground">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="font-heading text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <ul className="flex-1 space-y-3 py-4">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span className="text-muted-foreground">{feat}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className={`mt-4 w-full ${plan.popular ? "bg-gradient-primary text-primary-foreground shadow-glow" : ""}`} variant={plan.popular ? "default" : "outline"}>
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="border-t border-border/50 py-20 sm:py-28">
        <div className="mx-auto max-w-2xl px-4">
          <div className="text-center">
            <Badge variant="outline" className="mb-4 border-accent/30 text-accent">Get in Touch</Badge>
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">Ready to Secure Your Institution?</h2>
            <p className="mt-3 text-muted-foreground">
              Tell us about your needs and we'll tailor a solution for you.
            </p>
          </div>
          <form onSubmit={handleContactSubmit} className="mt-10 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Name *</label>
                <Input
                  placeholder="Your name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  maxLength={100}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Email *</label>
                <Input
                  type="email"
                  placeholder="you@institution.ac.ke"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  maxLength={255}
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Institution</label>
              <Input
                placeholder="University / Organization name"
                value={contactForm.institution}
                onChange={(e) => setContactForm({ ...contactForm, institution: e.target.value })}
                maxLength={200}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Message *</label>
              <Textarea
                placeholder="Tell us about your cybersecurity needs…"
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                maxLength={1000}
                rows={5}
              />
            </div>
            <Button type="submit" size="lg" className="w-full bg-gradient-primary text-primary-foreground shadow-glow">
              Send Message <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-heading text-sm font-semibold">SalamaNet AI</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 SalamaNet AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
