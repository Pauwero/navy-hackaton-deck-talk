"use client";

import { AlertCircle, AlertTriangle, Info, CheckCircle } from "lucide-react";
import type { QualityGateResult } from "@/types";

export default function QualityGateDisplay({ result }: { result: QualityGateResult | null }) {
  if (!result) return null;

  return (
    <div className={`rounded-xl p-4 border ${
      result.passed
        ? "bg-success-500/10 border-success-500/30"
        : "bg-danger-500/10 border-danger-500/30"
    }`}>
      <div className="flex items-center gap-2 mb-3">
        {result.passed ? (
          <CheckCircle className="w-5 h-5 text-success-400" />
        ) : (
          <AlertCircle className="w-5 h-5 text-danger-400" />
        )}
        <span className="font-semibold text-sm">
          Quality Gate: {result.passed ? "Passed" : "Failed"} — Score: {result.score}/100
        </span>
      </div>

      {/* Score bar */}
      <div className="w-full bg-navy-800 rounded-full h-2 mb-3">
        <div
          className={`h-2 rounded-full transition-all ${
            result.score >= 80 ? "bg-success-400" : result.score >= 50 ? "bg-warning-400" : "bg-danger-400"
          }`}
          style={{ width: `${result.score}%` }}
        />
      </div>

      {result.issues.length > 0 && (
        <div className="space-y-1.5 mb-3">
          {result.issues.map((issue, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              {issue.severity === "error" && <AlertCircle className="w-4 h-4 text-danger-400 mt-0.5 shrink-0" />}
              {issue.severity === "warning" && <AlertTriangle className="w-4 h-4 text-warning-400 mt-0.5 shrink-0" />}
              {issue.severity === "info" && <Info className="w-4 h-4 text-accent-400 mt-0.5 shrink-0" />}
              <span className="text-navy-200">
                <span className="font-medium text-navy-100">{issue.field}:</span> {issue.message}
              </span>
            </div>
          ))}
        </div>
      )}

      {result.suggestions.length > 0 && (
        <div className="border-t border-navy-700 pt-2 mt-2">
          <p className="text-xs font-medium text-navy-400 mb-1">Suggestions:</p>
          {result.suggestions.map((s, i) => (
            <p key={i} className="text-xs text-navy-300 ml-2">• {s}</p>
          ))}
        </div>
      )}
    </div>
  );
}
