"use client";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, BrainCircuit, CheckCircle2, Loader2 } from "lucide-react";
import { AgentStep } from "@/hooks/useAgent";
import { Badge } from "@/components/ui/badge";

interface ReasoningDrawerProps {
  steps: AgentStep[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReasoningDrawer({ steps, isOpen, onOpenChange }: ReasoningDrawerProps) {
  const logs = steps.filter(s => s.type === "log");
  const isThinking = logs.some(l => l.status === "pending");

  if (logs.length === 0) return null;

  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange} className="w-full border rounded-lg bg-slate-50 mb-4">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-slate-100 transition-colors rounded-t-lg">
        <div className="flex items-center gap-2">
          <BrainCircuit className={`h-5 w-5 ${isThinking ? "text-amber-500 animate-pulse" : "text-green-600"}`} />
          <span className="font-medium text-sm text-slate-700">
            {isThinking ? "Agent is reasoning..." : "Reasoning complete"}
          </span>
          <Badge variant="outline" className="ml-2 bg-white">{logs.length} Steps</Badge>
        </div>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="p-4 pt-0 space-y-3">
          <div className="h-px bg-slate-200 mb-4" />
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-3 text-sm">
              {log.status === "pending" ? (
                <Loader2 className="h-4 w-4 text-amber-500 animate-spin mt-0.5" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
              )}
              <span className={`flex-1 ${log.status === "pending" ? "text-slate-600" : "text-slate-800"}`}>
                {log.content}
              </span>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
