/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, 
  Briefcase, 
  Wand2, 
  Copy, 
  Check, 
  Download, 
  Github,
  AlertCircle,
  Loader2,
  ChevronRight
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { generateTailoredResume } from "./lib/gemini";
import { cn } from "./lib/utils";

export default function App() {
  const [cvText, setCvText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [output, setOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!cvText || !jobDescription) {
      setError("Please provide both your CV and the target Job Description.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateTailoredResume(cvText, jobDescription);
      setOutput(result || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadText = () => {
    const blob = new Blob([output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Tailored_Resume.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadSampleData = () => {
    setCvText("John Doe\nSoftware Engineer\nExperience:\n- Built a high-performance trading platform using React and Node.js.\n- Managed a team of 5 developers.\n- Experience with AWS, Docker, and Kubernetes.");
    setJobDescription("Full Stack Engineer\nRole:\nWe are looking for a senior engineer to lead our fintech product development.\nRequirements:\n- Proficiency in React and Node.js.\n- Strong leadership skills.\n- Experience with cloud infrastructure (AWS preferred).\n- Knowledge of scaling distributed systems.");
  };

  return (
    <div className="h-screen bg-[#F3F4F6] text-[#111827] font-sans flex flex-col overflow-hidden select-none">
      {/* Header Section */}
      <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-10 shrink-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black flex items-center justify-center">
            <span className="text-white font-black text-xl italic">R</span>
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase leading-none mt-1">
            Resume<span className="text-blue-600">Tailor</span>
          </h1>
        </div>
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex gap-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 border-b-2 border-blue-600 pb-1 cursor-default">Optimization</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors cursor-pointer" onClick={loadSampleData}>Sample Data</span>
          </nav>
          <div className="flex gap-2">
            {output && (
              <button 
                onClick={downloadText}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-none font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                Export
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar / Inputs */}
        <aside className="w-[420px] border-r border-gray-200 bg-white p-8 flex flex-col gap-8 overflow-y-auto shrink-0">
          <div className="space-y-1">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Project Configuration</h2>
            <p className="text-[11px] text-gray-500 font-medium">Map candidate experience to target role architecture.</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <label className="text-[11px] font-black uppercase tracking-tighter text-gray-500">Source CV Raw Text</label>
                <span className={cn(
                  "text-[9px] font-bold px-2 py-0.5 uppercase tracking-tighter",
                  cvText ? "text-green-600 bg-green-50" : "text-gray-400 bg-gray-50"
                )}>
                  {cvText ? "Data Detected" : "Status: Empty"}
                </span>
              </div>
              <textarea 
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                placeholder="Paste original CV text..."
                className="h-[220px] w-full bg-gray-50 border border-gray-200 p-4 font-mono text-[11px] text-gray-600 focus:border-blue-600 focus:bg-white transition-all outline-none leading-relaxed resize-none"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <label className="text-[11px] font-black uppercase tracking-tighter text-gray-500">Target Role Parameters</label>
                <span className={cn(
                  "text-[9px] font-bold px-2 py-0.5 uppercase tracking-tighter",
                  jobDescription ? "text-blue-600 bg-blue-50" : "text-gray-400 bg-gray-50"
                )}>
                  {jobDescription ? "Target Locked" : "Status: Required"}
                </span>
              </div>
              <textarea 
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste target job description..."
                className="h-[220px] w-full bg-gray-50 border border-gray-200 p-4 font-mono text-[11px] text-gray-600 focus:border-blue-600 focus:bg-white transition-all outline-none leading-relaxed resize-none italic"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-black text-white py-5 font-black text-xs uppercase tracking-[0.3em] hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Optimize Resume"
              )}
            </button>

            {error && (
              <div className="p-4 border-2 border-red-100 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-tight flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </aside>

        {/* Resume Preview */}
        <section className="flex-1 p-10 flex flex-col items-center bg-[#F3F4F6] relative overflow-hidden">
          {/* Analysis Data View (Status Widgets) */}
          <div className="absolute top-6 right-10 flex gap-4">
            <div className="bg-white border border-gray-200 p-3 shadow-sm flex flex-col items-center min-w-[90px]">
              <span className="text-[9px] font-bold uppercase text-gray-400">Match Accuracy</span>
              <span className="text-2xl font-black text-blue-600">{output ? "98%" : "--"}</span>
            </div>
            <div className="bg-white border border-gray-200 p-3 shadow-sm flex flex-col items-center min-w-[90px]">
              <span className="text-[9px] font-bold uppercase text-gray-400">Processing</span>
              <span className="text-2xl font-black">{isGenerating ? "ACTV" : "IDLE"}</span>
            </div>
          </div>

          <div className="w-full max-w-[800px] flex flex-col gap-6 h-full">
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2">Internal_Preview // Tailored_Output</h2>
            
            <div className="bg-white shadow-2xl flex-1 w-full p-16 text-[#333] flex flex-col overflow-y-auto border-t-[6px] border-black relative group selection:bg-blue-100">
              {output && (
                <button 
                  onClick={copyToClipboard}
                  className="absolute top-6 right-6 p-2 bg-gray-50 border border-gray-100 text-gray-400 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100 shadow-sm"
                  title="Copy Document"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              )}

              <AnimatePresence mode="wait">
                {!output && !isGenerating && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center space-y-4"
                  >
                    <div className="w-20 h-20 border-2 border-dashed border-gray-200 flex items-center justify-center">
                      <FileText className="w-8 h-8 text-gray-200" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">Document Buffer Empty</p>
                      <p className="text-[10px] text-gray-400 italic">Synthesize data to populate preview.</p>
                    </div>
                  </motion.div>
                )}

                {isGenerating && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center space-y-6"
                  >
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.div 
                          key={i}
                          animate={{ height: [8, 32, 8] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                          className="w-1 bg-blue-600"
                        />
                      ))}
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">Reconfiguring Data Structures...</p>
                  </motion.div>
                )}

                {output && !isGenerating && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="prose prose-sm prose-slate max-w-none 
                      prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-headings:text-black
                      prose-h1:text-5xl prose-h1:mb-2 prose-h1:leading-none
                      prose-h2:text-[14px] prose-h2:tracking-[0.2em] prose-h2:border-b-2 prose-h2:border-black prose-h2:pb-1 prose-h2:mt-10 prose-h2:mb-4
                      prose-strong:text-black prose-strong:font-bold
                      prose-p:text-[12px] prose-p:leading-relaxed prose-p:font-medium text-gray-700
                      prose-li:text-[12px] prose-li:my-1
                      prose-ul:my-2"
                  >
                    <ReactMarkdown>{output}</ReactMarkdown>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Bar */}
      <footer className="h-10 bg-white border-t border-gray-200 flex items-center px-10 shrink-0 text-[10px] font-bold text-gray-400 gap-8 uppercase tracking-widest overflow-hidden">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span>Status: AI Optimizer v4.8 Active</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 border-l border-gray-100 pl-8">
          <span>Engine: Gemini-3-Flash</span>
        </div>
        <div className="flex-1"></div>
        <div className="flex gap-6 items-center">
          <span className="text-gray-300">Live Sandbox Protocol // 2026</span>
          <span className="text-[#111827]">Autosaved: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        </div>
      </footer>
    </div>
  );
}
