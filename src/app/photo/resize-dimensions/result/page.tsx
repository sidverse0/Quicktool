
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, RefreshCw, Loader2 } from "lucide-react";

export default function ResizeResultPage() {
    const [originalUrl, setOriginalUrl] = useState<string | null>(null);
    const [resizedUrl, setResizedUrl] = useState<string | null>(null);
    const [fileName, setFileName] = useState("resized-image.png");
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const original = sessionStorage.getItem("originalImageDataUrl");
        const resized = sessionStorage.getItem("resizedImageDataUrl");
        const name = sessionStorage.getItem("resizedImageFileName");

        if (resized && original && name) {
            setOriginalUrl(original);
            setResizedUrl(resized);
            setFileName(name);
        } else {
            // Redirect if data is not available
            router.replace("/photo/resize-dimensions");
        }
        setLoading(false);
    }, [router]);

    const handleStartOver = () => {
        sessionStorage.removeItem("originalImageDataUrl");
        sessionStorage.removeItem("resizedImageDataUrl");
        sessionStorage.removeItem("resizedImageFileName");
        router.push("/photo/resize-dimensions");
    }

    if (loading || !resizedUrl) {
        return (
             <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950">
                <PageHeader title="Resizing Result" showBackButton />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            </div>
        )
    }


  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950">
      <PageHeader title="Resizing Result" showBackButton />
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            <div className="space-y-4">
                <Card>
                    <CardHeader><CardTitle>Original</CardTitle></CardHeader>
                    <CardContent>
                        {originalUrl && <Image src={originalUrl} alt="Original Image" width={512} height={512} className="rounded-lg object-contain w-full h-auto border" />}
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-4">
                <Card>
                    <CardHeader><CardTitle>Resized</CardTitle></CardHeader>
                    <CardContent>
                        {resizedUrl && <Image src={resizedUrl} alt="Resized Image" width={512} height={512} className="rounded-lg object-contain w-full h-auto border" />}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <a href={resizedUrl} download={fileName}>
                            <Button className="w-full">
                                <Download className="mr-2 h-4 w-4" /> Download
                            </Button>
                        </a>
                        <Button variant="secondary" className="w-full" onClick={handleStartOver}>
                            <RefreshCw className="mr-2 h-4 w-4" /> Start Over
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </div>
  );
}

