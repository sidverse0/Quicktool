"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, RefreshCw, Loader2 } from "lucide-react";

export default function EnhanceResultPage() {
    const [originalUrl, setOriginalUrl] = useState<string | null>(null);
    const [enhancedUrl, setEnhancedUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const original = sessionStorage.getItem("originalImageDataUrl");
        const enhanced = sessionStorage.getItem("enhancedImageDataUrl");

        if (enhanced && original) {
            setOriginalUrl(original);
            setEnhancedUrl(enhanced);
        } else {
            router.replace("/photo/enhance");
        }
        setLoading(false);
    }, [router]);

    const handleStartOver = () => {
        sessionStorage.removeItem("originalImageDataUrl");
        sessionStorage.removeItem("enhancedImageDataUrl");
        router.push("/photo/enhance");
    }

    if (loading || !enhancedUrl || !originalUrl) {
        return (
             <div className="flex flex-col min-h-screen">
                <PageHeader title="Enhancement Result" showBackButton />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            </div>
        )
    }


  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="Enhancement Result" showBackButton />
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="w-full max-w-lg mx-auto space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Card>
                  <CardHeader><CardTitle>Original</CardTitle></CardHeader>
                  <CardContent>
                      <div className="relative w-full h-auto aspect-square border rounded-lg flex items-center justify-center bg-secondary/50">
                          <Image src={originalUrl} alt="Original Image" layout="fill" className="rounded-lg object-contain p-2" />
                      </div>
                  </CardContent>
              </Card>
              <Card>
                  <CardHeader><CardTitle>Enhanced</CardTitle></CardHeader>
                  <CardContent>
                      <div className="relative w-full h-auto aspect-square border rounded-lg flex items-center justify-center bg-secondary/50">
                          <Image src={enhancedUrl} alt="Enhanced Image" layout="fill" className="rounded-lg object-contain p-2" />
                      </div>
                  </CardContent>
              </Card>
            </div>

             <Card>
                <CardHeader>
                    <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <a href={enhancedUrl} download="enhanced-photo.png">
                        <Button className="w-full">
                            <Download className="mr-2 h-4 w-4" /> Download
                        </Button>
                    </a>
                    <Button variant="secondary" className="w-full" onClick={handleStartOver}>
                        <RefreshCw className="mr-2 h-4 w-4" /> Enhance Another
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
