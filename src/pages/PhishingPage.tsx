import { useState } from "react";
import { Mail, Link, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ScanResult {
  score: number;
  verdict: "safe" | "suspicious" | "phishing";
  indicators: string[];
}

function analyzeInput(input: string): ScanResult {
  const lowerInput = input.toLowerCase();
  let score = 0;
  const indicators: string[] = [];

  const phishingKeywords = [
    "urgent", "verify your account", "click here", "password", "suspended",
    "confirm identity", "act now", "limited time", "bank", "login",
    "security alert", "unauthorized", "update payment",
  ];
  const suspiciousPatterns = [
    /bit\.ly/i, /tinyurl/i, /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/,
    /@.*@/, /\.ru\b/, /\.cn\b/, /free.*gift/i, /winner/i,
  ];

  phishingKeywords.forEach((kw) => {
    if (lowerInput.includes(kw)) {
      score += 15;
      indicators.push(`Contains phishing keyword: "${kw}"`);
    }
  });

  suspiciousPatterns.forEach((pat) => {
    if (pat.test(lowerInput)) {
      score += 20;
      indicators.push(`Matches suspicious pattern: ${pat.source}`);
    }
  });

  if (lowerInput.includes("http") && !lowerInput.includes("https")) {
    score += 10;
    indicators.push("Uses insecure HTTP link");
  }

  if (indicators.length === 0) {
    indicators.push("No known phishing indicators detected");
  }

  score = Math.min(score, 100);
  const verdict = score >= 60 ? "phishing" : score >= 30 ? "suspicious" : "safe";
  return { score, verdict, indicators };
}

export default function PhishingPage() {
  const [inputType, setInputType] = useState<"email" | "url">("email");
  const [input, setInput] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const handleScan = () => {
    if (!input.trim()) return;
    setScanning(true);
    setResult(null);
    setTimeout(() => {
      setResult(analyzeInput(input));
      setScanning(false);
    }, 1500);
  };

  const verdictColors = {
    safe: "text-primary border-primary/30 bg-primary/5",
    suspicious: "text-warning border-warning/30 bg-warning/5",
    phishing: "text-destructive border-destructive/30 bg-destructive/5",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-warning/10 p-2.5">
          <Mail className="h-5 w-5 text-warning" />
        </div>
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground">Phishing Detection</h2>
          <p className="text-xs text-muted-foreground">
            AI-powered NLP classification for emails & URLs
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        {/* Input Type Toggle */}
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

        {/* Input Area */}
        {inputType === "email" ? (
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste email content here for analysis..."
            rows={6}
            className="w-full rounded-lg border border-border bg-muted/30 px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        ) : (
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter URL to analyze..."
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
              Analyzing...
            </>
          ) : (
            "Scan for Phishing"
          )}
        </button>
      </div>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`rounded-xl border p-6 shadow-card ${verdictColors[result.verdict]}`}
          >
            <div className="flex items-center gap-3">
              {result.verdict === "safe" ? (
                <CheckCircle className="h-8 w-8" />
              ) : (
                <AlertTriangle className="h-8 w-8" />
              )}
              <div>
                <h3 className="font-heading text-lg font-bold uppercase">{result.verdict}</h3>
                <p className="text-sm opacity-80">
                  Phishing probability: <span className="font-mono font-bold">{result.score}%</span>
                </p>
              </div>
            </div>

            {/* Score Bar */}
            <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${result.score}%` }}
                transition={{ duration: 0.8 }}
                className={`h-full rounded-full ${
                  result.verdict === "safe"
                    ? "bg-primary"
                    : result.verdict === "suspicious"
                    ? "bg-warning"
                    : "bg-destructive"
                }`}
              />
            </div>

            {/* Indicators */}
            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider opacity-70">
                Indicators
              </p>
              {result.indicators.map((ind, i) => (
                <p key={i} className="flex items-center gap-2 text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {ind}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
