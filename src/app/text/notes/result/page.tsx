"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, RefreshCw, Loader2 } from "lucide-react";

export default function NoteResultPage() {
    const [noteUrl, setNoteUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const url = sessionStorage.getItem("noteImageDataUrl");

        if (url) {
            setNoteUrl(url);
        } else {
            router.replace("/text/notes");
        }
        setLoading(false);
    }, [router]);

    const handleStartOver = () => {
        sessionStorage.removeItem("noteImageDataUrl");
        router.push("/text/notes");
    }

    if (loading || !noteUrl) {
        return (
             <div className="flex flex-col min-h-screen">
                <PageHeader title="Result" showBackButton />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            </div>
        )
    }


  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="Result" showBackButton />
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="w-full max-w-lg mx-auto space-y-4">
            <Card>
                <CardHeader><CardTitle>Your Note</CardTitle></CardHeader>
                <CardContent>
                    <div className="relative w-full h-auto aspect-[4/5] border rounded-lg flex items-center justify-center bg-white">
                        <Image src={noteUrl} alt="Generated Note" layout="fill" className="object-contain p-2" />
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <a href={noteUrl} download="handwritten-note.png">
                        <Button className="w-full">
                            <Download className="mr-2 h-4 w-4" /> Download
                        </Button>
                    </a>
                    <Button variant="secondary" className="w-full" onClick={handleStartOver}>
                        <RefreshCw className="mr-2 h-4 w-4" /> Create Another
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
