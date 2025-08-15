
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import LoadingIndicator from "@/components/layout/loading-indicator";
import { useToast } from "@/hooks/use-toast";

export default function SignatureResultPage() {
    const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [borderColor, setBorderColor] = useState("hsl(var(--border))");
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const url = sessionStorage.getItem("signatureImageDataUrl");
        const color = sessionStorage.getItem("toolColor");

        if (url) {
            setSignatureUrl(url);
            if (color) {
                setBorderColor(color);
            }
        } else {
            router.replace("/text/signature");
        }
        setLoading(false);
    }, [router]);

    const handleStartOver = () => {
        sessionStorage.removeItem("signatureImageDataUrl");
        sessionStorage.removeItem("toolColor");
        router.push("/text/signature");
    }

     const handleDownload = () => {
        if (!signatureUrl) return;
        const link = document.createElement("a");
        link.href = signatureUrl;
        link.download = "signature.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({
            title: "Download Started",
            description: "Your signature is downloading.",
        });
    }

    if (loading || !signatureUrl) {
        return (
             <div className="flex flex-col h-full">
                <PageHeader title="Result" showBackButton />
                <div className="flex-1 flex items-center justify-center">
                    <LoadingIndicator />
                </div>
            </div>
        )
    }


  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Result" showBackButton />
      <div className="flex-1 flex flex-col justify-center p-4 space-y-4">
        <div className="relative w-full h-48 flex items-center justify-center bg-secondary rounded-lg border-2 border-dashed" style={{ borderColor }}>
            <Image src={signatureUrl} alt="Generated Signature" layout="fill" className="object-contain p-4" />
        </div>
        <div className="space-y-2">
            <Button className="w-full" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" /> Download
            </Button>
            <Button variant="secondary" className="w-full" onClick={handleStartOver}>
                <RefreshCw className="mr-2 h-4 w-4" /> Create Another
            </Button>
        </div>
      </div>
    </div>
  );
}
