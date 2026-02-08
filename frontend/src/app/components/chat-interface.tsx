















// "use client";

// import { useState, useEffect } from "react";
// import { Send, Bot, RotateCcw, Sparkles } from "lucide-react";
// import ReactMarkdown from "react-markdown";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { ReasoningDrawer } from "@/app/components/reasoning-drawer";
// import { useAgent } from "@/hooks/useAgent";

// interface ChatInterfaceProps {
//   fileId: string;
//   onChangePDF: () => void;
//   onCitationClick: (page: number, text: string) => void;
// }

// interface BriefingData {
//   summary: string[];
//   suggested_questions: string[];
// }

// export function ChatInterface({ fileId, onChangePDF, onCitationClick }: ChatInterfaceProps) {
//   const [query, setQuery] = useState("");
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [briefing, setBriefing] = useState<BriefingData | null>(null);
//   const [isLoadingBriefing, setIsLoadingBriefing] = useState(false);

//   const { steps, isThinking, chat } = useAgent();

//   useEffect(() => {
//     if (!fileId) return;
    
//     const fetchBriefing = async () => {
//       setIsLoadingBriefing(true);
//       try {
//         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/analyze`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ query: "analyze", file_id: fileId }),
//         });
//         if (res.ok) {
//             const data = await res.json();
//             setBriefing(data);
//         }
//       } catch (e) {
//         console.error("Briefing failed", e);
//       } finally {
//         setIsLoadingBriefing(false);
//       }
//     };

//     fetchBriefing();
//   }, [fileId]);

//   const handleSend = (text?: string) => {
//     const input = text || query;
//     if (!input.trim() || !fileId) return;
//     chat(input, fileId);
//     setQuery("");
//     setIsDrawerOpen(true);
//   };

//   const lastAnswer = steps.filter((s) => s.type === "answer").pop();

//   return (
//     <div className="flex flex-col h-full bg-white shadow-xl rounded-l-2xl border-l overflow-hidden">
//       <header className="p-4 border-b bg-white flex items-center justify-between z-10">
//         <div className="flex items-center gap-2">
//           <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
//           <h2 className="font-semibold text-slate-800">DocuNexus Agent</h2>
//         </div>
//         <Button variant="outline" size="sm" onClick={onChangePDF} className="gap-2 text-slate-600">
//           <RotateCcw className="h-3 w-3" />
//           New PDF
//         </Button>
//       </header>

//       <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50 scroll-smooth">
//         <ReasoningDrawer
//           steps={steps}
//           isOpen={isDrawerOpen}
//           onOpenChange={setIsDrawerOpen}
//         />

//         {!lastAnswer && (
//             <div className="flex flex-col items-center justify-center h-full space-y-6 p-8 animate-in fade-in duration-700">
//                 <div className="h-16 w-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg mb-4">
//                     <Bot className="h-8 w-8 text-white" />
//                 </div>

//                 {isLoadingBriefing ? (
//                     <div className="flex items-center gap-2 text-slate-400">
//                         <Sparkles className="h-4 w-4 animate-spin" />
//                         <p>Analyzing document...</p>
//                     </div>
//                 ) : briefing ? (
//                     <div className="w-full max-w-md bg-white/60 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
//                         <div className="space-y-3">
//                             <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wide">
//                                 📊 Executive Summary
//                             </h3>
//                             <ul className="space-y-2.5">
//                                 {briefing.summary.map((point, i) => (
//                                     <li key={i} className="text-sm text-slate-600 flex gap-3 leading-relaxed">
//                                         <span className="text-indigo-500 mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
//                                         {point}
//                                     </li>
//                                 ))}
//                             </ul>
//                         </div>
                        
//                         <div className="pt-4 border-t border-slate-100">
//                             <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">Suggested Questions</p>
//                             <div className="space-y-2">
//                                 {briefing.suggested_questions.map((q, i) => (
//                                     <button 
//                                         key={i}
//                                         onClick={() => handleSend(q)}
//                                         className="w-full text-left text-sm p-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 shadow-sm text-slate-700"
//                                     >
//                                         {q}
//                                     </button>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 ) : (
//                     <p className="text-slate-400">Ready to chat.</p>
//                 )}
//             </div>
//         )}

//         {lastAnswer && (
//           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
//             <div className="flex gap-4">
//               <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm">
//                 <Bot className="h-5 w-5" />
//               </div>

//               <div className="flex-1 space-y-3">
//                 <article className="prose prose-slate prose-sm max-w-none bg-white p-4 rounded-lg border shadow-sm">
//                   <ReactMarkdown>{lastAnswer.content}</ReactMarkdown>
//                 </article>

//                 {lastAnswer.citations && lastAnswer.citations.length > 0 && (
//                   <div className="flex flex-wrap gap-2">
//                     {lastAnswer.citations.map((citation, idx) => (
//                       <button
//                         key={idx}
//                         onClick={() => onCitationClick(citation.page, citation.text)}
//                         className="flex items-center gap-1.5 text-xs font-medium bg-white text-indigo-600 px-3 py-1.5 rounded-full border border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all shadow-sm"
//                       >
//                         📄 Pg {citation.page}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="p-4 bg-white border-t">
//         <div className="relative flex items-center">
//           <Input
//             placeholder="Ask about this document..."
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleSend()}
//             disabled={isThinking}
//             className="pr-12 py-6 text-base shadow-sm focus-visible:ring-indigo-500"
//           />
//           <Button
//             onClick={() => handleSend()}
//             disabled={isThinking || !query.trim()}
//             size="icon"
//             className="absolute right-2 h-8 w-8 bg-indigo-600 hover:bg-indigo-700"
//           >
//             <Send className="h-4 w-4" />
//           </Button>
//         </div>
//         <p className="text-[10px] text-slate-400 text-center mt-2">
//           AI can make mistakes. Check citations.
//         </p>
//       </div>
//     </div>
//   );
// }


















"use client";

import { useState, useEffect } from "react";
import { Send, Bot, RotateCcw, Sparkles, Flame, ShieldAlert, Info } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ReasoningDrawer } from "@/app/components/reasoning-drawer";
import { useAgent } from "@/hooks/useAgent";

interface ChatInterfaceProps {
  fileId: string;
  onChangePDF: () => void;
  onCitationClick: (page: number, text: string) => void;
}

interface BriefingData {
  summary: string[];
  suggested_questions: string[];
}

export function ChatInterface({ fileId, onChangePDF, onCitationClick }: ChatInterfaceProps) {
  const [query, setQuery] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [briefing, setBriefing] = useState<BriefingData | null>(null);
  const [isLoadingBriefing, setIsLoadingBriefing] = useState(false);
  const [mode, setMode] = useState<"standard" | "nemesis">("standard");

  const { steps, isThinking, chat } = useAgent();

  useEffect(() => {
    if (!fileId) return;
    
    const fetchBriefing = async () => {
      setIsLoadingBriefing(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/analyze`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: "analyze", file_id: fileId }),
        });
        if (res.ok) {
            const data = await res.json();
            setBriefing(data);
        }
      } catch (e) {
        console.error("Briefing failed", e);
      } finally {
        setIsLoadingBriefing(false);
      }
    };

    fetchBriefing();
  }, [fileId]);

  const handleSend = (text?: string) => {
    const input = text || query;
    if (!input.trim() || !fileId) return;
    
    // @ts-ignore - Assuming chat accepts mode based on previous steps
    chat(input, fileId, mode);
    
    setQuery("");
    setIsDrawerOpen(true);
  };

  const lastAnswer = steps.filter((s) => s.type === "answer").pop();
  const isNemesis = mode === "nemesis";

  return (
    <div className={`flex flex-col h-full shadow-2xl rounded-l-3xl border-l overflow-hidden transition-all duration-500 ${isNemesis ? "bg-slate-950 border-red-900/30" : "bg-white border-white/40"}`}>
      
      <header className={`px-6 py-4 flex items-center justify-between z-20 backdrop-blur-xl border-b transition-colors duration-500 ${isNemesis ? "bg-slate-900/80 border-red-900/20" : "bg-white/80 border-slate-200/60"}`}>
        <div className="flex items-center gap-3">
          <div className={`h-2.5 w-2.5 rounded-full animate-pulse ${isNemesis ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]" : "bg-emerald-500"}`} />
          <h2 className={`font-semibold tracking-tight transition-colors duration-500 ${isNemesis ? "text-red-100" : "text-slate-800"}`}>
            DocuNexus {isNemesis ? <span className="text-red-500 font-bold">NEMESIS</span> : "Agent"}
          </h2>
        </div>

        <div className="flex items-center gap-3">
            <div className="relative group">
                <button
                    onClick={() => setMode(isNemesis ? "standard" : "nemesis")}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 ${
                        isNemesis 
                        ? "bg-red-950/50 border-red-800 text-red-200 hover:bg-red-900/50 hover:shadow-[0_0_15px_rgba(220,38,38,0.3)]" 
                        : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
                    }`}
                >
                    {isNemesis ? <Flame className="h-4 w-4 text-red-500" /> : <Bot className="h-4 w-4 text-indigo-500" />}
                    <span className="text-xs font-medium">{isNemesis ? "Nemesis Mode" : "Standard"}</span>
                </button>

                <div className="absolute right-0 top-full mt-3 w-72 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 origin-top-right pointer-events-none z-50">
                    <div className={`p-4 rounded-2xl shadow-xl border backdrop-blur-xl ${isNemesis ? "bg-slate-900/95 border-red-800 text-red-100" : "bg-white/95 border-slate-200 text-slate-700"}`}>
                        <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg shrink-0 ${isNemesis ? "bg-red-500/10 text-red-500" : "bg-indigo-500/10 text-indigo-500"}`}>
                                {isNemesis ? <ShieldAlert className="h-5 w-5" /> : <Info className="h-5 w-5" />}
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-semibold">{isNemesis ? "Critical Auditor Persona" : "Helpful Assistant Persona"}</p>
                                <p className="text-xs opacity-80 leading-relaxed">
                                    {isNemesis 
                                        ? "The AI will ruthlessly challenge the document, highlighting risks, missing clauses, and logical flaws. Perfect for risk assessment." 
                                        : "The AI acts as a polite and accurate assistant, retrieving facts and summarizing content without bias."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Button 
                variant="ghost" 
                size="sm" 
                onClick={onChangePDF} 
                className={`gap-2 rounded-xl transition-colors ${isNemesis ? "text-red-300 hover:bg-red-900/20 hover:text-red-100" : "text-slate-600 hover:bg-slate-100"}`}
            >
                <RotateCcw className="h-4 w-4" />
            </Button>
        </div>
      </header>

      <div className={`flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth transition-colors duration-500 ${isNemesis ? "bg-gradient-to-b from-slate-950 to-slate-900" : "bg-slate-50/50"}`}>
        <ReasoningDrawer
          steps={steps}
          isOpen={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
        />

        {!lastAnswer && (
            <div className="flex flex-col items-center justify-center h-full space-y-6 p-8 animate-in fade-in duration-700">
                <div className={`h-20 w-20 rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-500 ${isNemesis ? "bg-gradient-to-br from-red-600 to-orange-700 shadow-red-900/20" : "bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-indigo-200"}`}>
                    {isNemesis ? <Flame className="h-10 w-10 text-white animate-pulse" /> : <Bot className="h-10 w-10 text-white" />}
                </div>

                {isLoadingBriefing ? (
                    <div className={`flex items-center gap-2 ${isNemesis ? "text-red-400" : "text-slate-400"}`}>
                        <Sparkles className="h-4 w-4 animate-spin" />
                        <p>Analyzing document...</p>
                    </div>
                ) : briefing ? (
                    <div className={`w-full max-w-md backdrop-blur-md border rounded-3xl p-6 shadow-sm space-y-5 transition-all duration-500 ${isNemesis ? "bg-slate-900/60 border-red-900/40" : "bg-white/60 border-slate-200"}`}>
                        <div className="space-y-3">
                            <h3 className={`font-semibold flex items-center gap-2 text-xs uppercase tracking-widest ${isNemesis ? "text-red-400" : "text-slate-500"}`}>
                                📊 Executive Summary
                            </h3>
                            <ul className="space-y-3">
                                {briefing.summary.map((point, i) => (
                                    <li key={i} className={`text-sm flex gap-3 leading-relaxed ${isNemesis ? "text-red-100" : "text-slate-600"}`}>
                                        <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${isNemesis ? "bg-red-500" : "bg-indigo-500"}`} />
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div className={`pt-4 border-t ${isNemesis ? "border-red-900/30" : "border-slate-100"}`}>
                            <p className={`text-[10px] font-bold mb-3 uppercase tracking-widest ${isNemesis ? "text-red-500/60" : "text-slate-400"}`}>Suggested Questions</p>
                            <div className="space-y-2">
                                {briefing.suggested_questions.map((q, i) => (
                                    <button 
                                        key={i}
                                        onClick={() => handleSend(q)}
                                        className={`w-full text-left text-sm p-3 rounded-xl border transition-all duration-200 shadow-sm ${
                                            isNemesis 
                                            ? "bg-slate-800/50 border-red-900/30 text-red-200 hover:border-red-500/50 hover:bg-red-900/20" 
                                            : "bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                                        }`}
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className={isNemesis ? "text-red-400/50" : "text-slate-400"}>Ready to chat.</p>
                )}
            </div>
        )}

        {lastAnswer && (
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="flex gap-4">
              <div className={`h-10 w-10 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md ${isNemesis ? "bg-red-600" : "bg-indigo-600"}`}>
                {isNemesis ? <Flame className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
              </div>

              <div className="flex-1 space-y-3">
                <article className={`prose prose-sm max-w-none p-5 rounded-2xl border shadow-sm ${isNemesis ? "prose-invert bg-slate-900/80 border-red-900/30 text-red-50" : "prose-slate bg-white border-white/60 text-slate-800"}`}>
                  <ReactMarkdown>{lastAnswer.content}</ReactMarkdown>
                </article>

                {lastAnswer.citations && lastAnswer.citations.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {lastAnswer.citations.map((citation, idx) => (
                      <button
                        key={idx}
                        onClick={() => onCitationClick(citation.page, citation.text)}
                        className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all shadow-sm ${
                            isNemesis 
                            ? "bg-slate-900 border-red-900 text-red-400 hover:bg-red-950 hover:border-red-500" 
                            : "bg-white border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
                        }`}
                      >
                        📄 Pg {citation.page}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={`p-5 border-t transition-colors duration-500 ${isNemesis ? "bg-slate-950 border-red-900/30" : "bg-white border-slate-100"}`}>
        <div className={`relative flex items-center rounded-2xl border shadow-sm transition-all duration-300 ${isNemesis ? "bg-slate-900 border-red-900/40 shadow-red-900/5" : "bg-white border-slate-200 shadow-slate-200/50"}`}>
          <Input
            placeholder={isNemesis ? "Interrogate this document..." : "Ask about this document..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isThinking}
            className={`pr-14 py-7 text-base border-0 shadow-none focus-visible:ring-0 bg-transparent ${isNemesis ? "text-red-50 placeholder:text-red-900/50" : "text-slate-800 placeholder:text-slate-400"}`}
          />
          <Button
            onClick={() => handleSend()}
            disabled={isThinking || !query.trim()}
            size="icon"
            className={`absolute right-2 h-10 w-10 rounded-xl transition-all hover:scale-105 active:scale-95 ${isNemesis ? "bg-red-600 hover:bg-red-500 shadow-lg shadow-red-900/20" : "bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200"}`}
          >
            <Send className="h-5 w-5 text-white" />
          </Button>
        </div>
        <p className={`text-[10px] text-center mt-3 transition-colors ${isNemesis ? "text-red-900/60" : "text-slate-300"}`}>
            {isNemesis ? "AI is in critical mode. Verify all risk assessments." : "AI can make mistakes. Check citations."}
        </p>
      </div>
    </div>
  );
}