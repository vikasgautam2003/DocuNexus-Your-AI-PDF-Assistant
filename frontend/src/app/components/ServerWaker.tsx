"use client";

import { useState, useEffect } from "react";
import { Loader2, Server, CloudCog } from "lucide-react";

export default function ServerWaker() {
  const [status, setStatus] = useState<"sleeping" | "waking" | "ready">("sleeping");
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const wakeUpServices = async () => {
      try {
        setStatus("waking");

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL;

        const pings = [];

        if (apiUrl) {
          pings.push(fetch(`${apiUrl}/health`));
        }

        if (workerUrl) {
                // [!] ADD mode: "no-cors"
                // This ignores the CORS error and successfully wakes the server
                pings.push(fetch(`${workerUrl}/`, { method: "HEAD", mode: "no-cors" })); 
            }

        await Promise.all(pings);

        setStatus("ready");
      } catch (error) {
        console.log("Still waking up...", error);

        setTimeout(() => {
          setAttempts((prev) => prev + 1);
        }, 2000);
      }
    };

    if (status !== "ready") {
      wakeUpServices();
    }
  }, [attempts]);

  if (status === "ready") return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/90 backdrop-blur-md transition-all duration-500">
      <div className="bg-white p-8 rounded-2xl shadow-2xl border border-blue-100 flex flex-col items-center max-w-sm text-center">
        <div className="relative flex gap-4 mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
            <div className="relative bg-white p-3 rounded-full border-2 border-blue-100">
              <Server className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-purple-100 rounded-full animate-ping opacity-75 delay-150"></div>
            <div className="relative bg-white p-3 rounded-full border-2 border-purple-100">
              <CloudCog className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <h3 className="font-bold text-xl text-gray-900">System Waking Up...</h3>

        <p className="mt-3 text-sm text-gray-500 leading-relaxed">
          The <strong>API</strong> and <strong>Worker</strong> are booting up from cold storage.
          <br />
          This typically takes <strong>45-60 seconds</strong>.
        </p>

        <div className="w-64 bg-gray-100 h-1.5 rounded-full mt-6 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-progress origin-left w-full"></div>
        </div>

        <div className="mt-5 flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
          <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
          <span>Attempt #{attempts + 1}</span>
          <span className="text-gray-300">|</span>
          <span>Est. wait: {Math.max(0, 50 - attempts * 2)}s</span>
        </div>
      </div>
    </div>
  );
}
