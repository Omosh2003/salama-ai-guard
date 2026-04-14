import { useState } from "react";
import { Mail, Link, AlertTriangle, CheckCircle, Loader2, Shield, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

interface PhishingIndicator {
  indicator: string;
  severity: "safe" | "suspicious" | "dangerous";
  detail: string;
}

interface ScanResult {
  risk_score: number;
  risk_level: "info" | "low" | "medium" | "high" | "critical";
  indicators: PhishingIndicator[];
  summary: string;
  recommendation: string;
}

const riskColors: Record<string, string> = {
  info: "text-accent border-accent/30 bg-accent/5",
  low: "text-primary border-primary/30 bg-primary/5",
  medium: "text-warning border-warning/30 bg-warning/5",
  high: "text-destructive border-destructive/30 bg-destructive/5",
  critical: "text-destructive border-destructive/50 bg-destructive/10",
};

const severityDot: Record<string, string> = {
  safe: "bg-primary",
  suspicious: "bg-warning",
  dangerous: "bg-destructive",
};

export default function PhishingPage() {
  const [inputType, setInputType] = useState<"email" | "url">("email");
  const [input, setInput] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const handleScan = async () => {
    if (!input.trim()) return;
    setScanning(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-phishing", {
        body: { inputText: input, inputType },
      });

      if (error) {
        toast.error(error.message || "Analysis failed");
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      setResult(data as ScanResult);
    } catch (e) {
      toast.error("Failed to connect to analysis service");
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-warning/10 p-2.5">
          <Mail className="h-5 w-5 text-warning" />
        </div>
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground">AI Phishing Scanner</h2>
          <p className="text-xs text-muted-foreground">
            Powered by AI — analyzes emails & URLs for phishing indicators
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        <div className="mb-4 flex gap-2">
          {(["email", "url"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setInputType(t); setResult(null); }}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                inputType === t
                  ? "bg-primary/10 text-primary"
                  : "bg-secondary/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "email" ? <Mail className="h-4 w-4" /> : <Link className="h-4 w-4" />}
              {t === "email" ? "Email Text" : "URL"}
            </button>
          ))}
        </div>

        {inputType === "email" ? (
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste email content here for AI analysis..."
            rows={6}
            maxLength={5000}
            className="w-full rounded-lg border border-border bg-muted/30 px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        ) : (
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter URL to analyze..."
            maxLength={2000}
            className="w-full rounded-lg border border-border bg-muted/30 px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        )}

        <button
          onClick={handleScan}
          disabled={scanning || !input.trim()}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
        >
          {scanning ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              AI Analyzing...
            </>
          ) : (
            <>
              <Shield className="h-4 w-4" />
              Scan with AI
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`rounded-xl border p-6 shadow-card ${riskColors[result.risk_level]}`}
          >
            <div className="flex items-center gap-3">
              {result.risk_score < 30 ? (
                <CheckCircle className="h-8 w-8" />
              ) : (
                <AlertTriangle className="h-8 w-8" />
              )}
              <div>
                <h3 className="font-heading text-lg font-bold uppercase">{result.risk_level}</h3>
                <p className="text-sm opacity-80">
                  Risk score: <span className="font-mono font-bold">{result.risk_score}%</span>
                </p>
              </div>
            </div>

            <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${result.risk_score}%` }}
                transition={{ duration: 0.8 }}
                className={`h-full rounded-full ${
                  result.risk_score < 30 ? "bg-primary" : result.risk_score < 60 ? "bg-warning" : "bg-destructive"
                }`}
              />
            </div>

            {/* Summary */}
            <div className="mt-4 rounded-lg bg-background/50 p-3">
              <p className="text-sm font-medium">{result.summary}</p>
            </div>

            {/* Indicators */}
            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider opacity-70">Indicators</p>
              {result.indicators.map((ind, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${severityDot[ind.severity]}`} />
                  <div>
                    <span className="font-medium">{ind.indicator}</span>
                    <p className="text-xs opacity-70">{ind.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Recommendation */}
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-current/20 bg-background/30 p-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              <p className="text-sm">{result.recommendation}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
