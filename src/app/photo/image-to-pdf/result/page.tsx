
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Loader2, FileType } from "lucide-react";

export default function ImageToPdfResultPage() {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [fileName, setFileName] = useState("converted.pdf");
    const [loading, setLoading] = useState(true);
    const [borderColor, setBorderColor] = useState("hsl(var(--border))");
    const router = useRouter();

    useEffect(() => {
        const url = sessionStorage.getItem("pdfDataUrl");
        const name = sessionStorage.getItem("pdfFileName");
        const color = sessionStorage.getItem("toolColor");

        if (url && name) {
            setPdfUrl(url);
            setFileName(name);
            if (color) {
                setBorderColor(color);
            }
        } else {
            router.replace("/photo/image-to-pdf");
        }
        setLoading(false);
    }, [router]);

    const handleStartOver = () => {
        sessionStorage.removeItem("pdfDataUrl");
        sessionStorage.removeItem("pdfFileName");
        sessionStorage.removeItem("toolColor");
        router.push("/photo/image-to-pdf");
    }

    if (loading || !pdfUrl) {
        return (
             <div className="flex flex-col h-full">
                <PageHeader title="Result" showBackButton />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            </div>
        )
    }

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Result" showBackButton />
      <div className="flex-1 flex flex-col justify-center items-center p-4 space-y-4">
        <div 
          className="w-48 h-64 flex flex-col items-center justify-center bg-secondary rounded-lg border-2 border-dashed" 
          style={{ borderColor }}
        >
            <FileType className="h-24 w-24" style={{ color: borderColor }} />
            <p className="mt-4 text-sm font-medium text-center break-all px-2">{fileName}</p>
        </div>
        <div className="w-full max-w-sm space-y-2">
            <a href={pdfUrl} download={fileName}>
                <Button className="w-full">
                    <Download className="mr-2 h-4 w-4" /> Download PDF
                </Button>
            </a>
            <Button variant="secondary" className="w-full" onClick={handleStartOver}>
                <RefreshCw className="mr-2 h-4 w-4" /> Convert Another
            </Button>
        </div>
      </div>
    </div>
  );
}
