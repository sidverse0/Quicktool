
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Loader2 } from "lucide-react";

export default function NoteResultPage() {
    const [noteUrl, setNoteUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [borderColor, setBorderColor] = useState("hsl(var(--border))");
    const router = useRouter();

    useEffect(() => {
        const url = sessionStorage.getItem("noteImageDataUrl");
        const color = sessionStorage.getItem("toolColor");

        if (url) {
            setNoteUrl(url);
            if (color) {
                setBorderColor(color);
            }
        } else {
            router.replace("/text/notes");
        }
        setLoading(false);
    }, [router]);

    const handleStartOver = () => {
        sessionStorage.removeItem("noteImageDataUrl");
        sessionStorage.removeItem("toolColor");
        router.push("/text/notes");
    }

    if (loading || !noteUrl) {
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
      <div className="flex-1 flex flex-col justify-center p-4 space-y-4">
        <div className="relative w-full aspect-[4/5] border-2 border-dashed rounded-lg bg-white" style={{ borderColor }}>
            <Image src={noteUrl} alt="Generated Note" layout="fill" className="object-contain p-4" />
        </div>
        <div className="space-y-2">
            <a href={noteUrl} download="handwritten-note.png">
                <Button className="w-full">
                    <Download className="mr-2 h-4 w-4" /> Download
                </Button>
            </a>
            <Button variant="secondary" className="w-full" onClick={handleStartOver}>
                <RefreshCw className="mr-2 h-4 w-4" /> Create Another
            </Button>
        </div>
      </div>
    </div>
  );
}
