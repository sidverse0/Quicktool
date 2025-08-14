"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, RefreshCw, Loader2 } from "lucide-react";

export default function SignatureResultPage() {
    const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const url = sessionStorage.getItem("signatureImageDataUrl");

        if (url) {
            setSignatureUrl(url);
        } else {
            router.replace("/text/signature");
        }
        setLoading(false);
    }, [router]);

    const handleStartOver = () => {
        sessionStorage.removeItem("signatureImageDataUrl");
        router.push("/text/signature");
    }

    if (loading || !signatureUrl) {
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
                <CardHeader><CardTitle>Your Signature</CardTitle></CardHeader>
                <CardContent>
                    <div className="relative w-full h-48 flex items-center justify-center bg-secondary rounded-lg border">
                        <Image src={signatureUrl} alt="Generated Signature" layout="fill" className="object-contain p-4" />
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <a href={signatureUrl} download="signature.png">
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
