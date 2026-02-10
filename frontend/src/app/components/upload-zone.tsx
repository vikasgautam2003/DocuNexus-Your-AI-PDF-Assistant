// "use client";

// import { useState } from "react";
// import { UploadCloud, FileText, Loader2 } from "lucide-react";
// import { Card } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { toast } from "sonner";


// interface UploadZoneProps{
//     onUploadComplete: (fileId: string, file: File) => void;
// }

// export function UploadZone({ onUploadComplete }: UploadZoneProps) {
//     const [isDragging, setIsDragging] = useState(false);
//     const [isUploading, setIsUploading] = useState(false);
//     const [progress, setProgress] = useState(0);

//     const handleUpload = async (file: File) => {
//         setIsUploading(true);
//         setProgress(10);

//         const formData = new FormData();
//         formData.append("file", file);


//         try {
//             const response = await fetch(
//                 `${process.env.NEXT_PUBLIC_API_URL}/api/v1/upload`,
//                 {
//                     method: "POST",
//                     body: formData,
//                 }
//             );

//             setProgress(60);

//             if (!response.ok) throw new Error("Upload failed");

//             const data = await response.json();
//             setProgress(100);


//             toast.success("File Uploaded", {
//                 description: `${data.filename} is ready for chat.`,
//             });



//             onUploadComplete(data.id, file);
//         } 
//         catch (error) {
//             toast.error("Upload Failed", {
//                 description: "Could not process the document. Please try again.",
//             });
//             setProgress(0);
//             } finally {
//             setIsUploading(false);
//         }
//     }

//     return (
//     <div className="w-full max-w-2xl mx-auto mt-10">
//       <Card
//         className={`p-10 border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-4
//           ${
//             isDragging
//               ? "border-blue-500 bg-blue-50/50"
//               : "border-gray-200 hover:border-gray-300"
//           }
//         `}
//         onDragOver={(e) => {
//           e.preventDefault();
//           setIsDragging(true);
//         }}
//         onDragLeave={() => setIsDragging(false)}
//         onDrop={(e) => {
//           e.preventDefault();
//           setIsDragging(false);
//           if (e.dataTransfer.files?.[0]) handleUpload(e.dataTransfer.files[0]);
//         }}
//         onClick={() => document.getElementById("file-upload")?.click()}
//       >
//         <input
//           id="file-upload"
//           type="file"
//           className="hidden"
//           accept="application/pdf"
//           onChange={(e) =>
//             e.target.files?.[0] && handleUpload(e.target.files[0])
//           }
//         />

//         <div className="p-4 rounded-full bg-blue-50 text-blue-500">
//           {isUploading ? (
//             <Loader2 className="h-8 w-8 animate-spin" />
//           ) : (
//             <UploadCloud className="h-8 w-8" />
//           )}
//         </div>

//         <div className="text-center">
//           <h3 className="font-semibold text-lg">
//             {isUploading ? "Processing Document..." : "Drop your PDF here"}
//           </h3>
//           <p className="text-sm text-gray-500 mt-1">
//             {isUploading
//               ? "Parsing vectors and generating embeddings"
//               : "or click to browse (Max 10MB)"}
//           </p>
//         </div>

//         {isUploading && <Progress value={progress} className="w-[60%] mt-4 h-2" />}
//       </Card>
//     </div>
//   );
// }









"use client";

import { useState, useEffect, useRef } from "react"; // [!] Added useEffect & useRef
import { UploadCloud, FileText, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface UploadZoneProps {
  onUploadComplete: (fileId: string, file: File) => void;
}

export function UploadZone({ onUploadComplete }: UploadZoneProps) {
  // [!] Fix 1: Add Mounted State to prevent Hydration Errors
  const [isMounted, setIsMounted] = useState(false);
  
  // [!] Fix 2: Use Ref instead of getElementById (More stable)
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // [!] Fix 1: Only render after client-side load
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setProgress(10);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Note: Make sure NEXT_PUBLIC_API_URL is actually set in .env.local
      // If not, use relative path: "/api/v1/upload" (via proxy) or hardcode for test
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      
      const response = await fetch(
        `${apiUrl}/api/v1/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      setProgress(60);

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setProgress(100);

      toast.success("File Uploaded", {
        description: `${data.filename} is ready for chat.`,
      });

      onUploadComplete(data.id, file);
    } catch (error) {
      toast.error("Upload Failed", {
        description: "Could not process the document. Please try again.",
      });
      setProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  // [!] Fix 3: Prevent rendering until browser is ready
  if (!isMounted) {
    return (
        <div className="w-full max-w-2xl mx-auto mt-10 h-64 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
        </div>
    ); 
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-10">
      <Card
        className={`p-10 border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-4
          ${
            isDragging
              ? "border-blue-500 bg-blue-50/50"
              : "border-gray-200 hover:border-gray-300"
          }
        `}
        // Drag Handlers
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation(); // Stop event bubbling
          setIsDragging(true);
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
          if (e.dataTransfer.files?.[0]) handleUpload(e.dataTransfer.files[0]);
        }}
        
        // Click Handler (Uses Ref)
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef} // [!] Connected Ref
          type="file"
          className="hidden"
          accept="application/pdf"
          onChange={(e) =>
            e.target.files?.[0] && handleUpload(e.target.files[0])
          }
        />

        <div className="p-4 rounded-full bg-blue-50 text-blue-500">
          {isUploading ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : (
            <UploadCloud className="h-8 w-8" />
          )}
        </div>

        <div className="text-center">
          <h3 className="font-semibold text-lg">
            {isUploading ? "Processing Document..." : "Drop your PDF here"}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {isUploading
              ? "Parsing vectors and generating embeddings"
              : "or click to browse (Max 10MB)"}
          </p>
        </div>

        {isUploading && <Progress value={progress} className="w-[60%] mt-4 h-2" />}
      </Card>
    </div>
  );
}



