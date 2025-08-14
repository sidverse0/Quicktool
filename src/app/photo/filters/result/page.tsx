"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, RefreshCw, Loader2 } from "lucide-react";

export default function FilterResultPage() {
    const [filteredUrl, setFilteredUrl] = useState<string | null>(null);
    const [fileName, setFileName] = useState("filtered-image.png");
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const filtered = sessionStorage.getItem("filteredImageDataUrl");
        const name = sessionStorage.getItem("filteredImageFileName");

        if (filtered && name) {
            setFilteredUrl(filtered);
            setFileName(name);
        } else {
            router.replace("/photo/filters");
        }
        setLoading(false);
    }, [router]);

    const handleStartOver = () => {
        sessionStorage.removeItem("filteredImageDataUrl");
        sessionStorage.removeItem("filteredImageFileName");
        router.push("/photo/filters");
    }

    if (loading || !filteredUrl) {
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
                <CardHeader><CardTitle>Filtered Image</CardTitle></CardHeader>
                <CardContent>
                    <div className="relative w-full h-auto aspect-square border rounded-lg flex items-center justify-center bg-secondary/50">
                        <Image src={filteredUrl} alt="Filtered Image" layout="fill" className="rounded-lg object-contain p-2" />
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <a href={filteredUrl} download={fileName}>
                        <Button className="w-full">
                            <Download className="mr-2 h-4 w-4" /> Download
                        </Button>
                    </a>
                    <Button variant="secondary" className="w-full" onClick={handleStartOver}>
                        <RefreshCw className="mr-2 h-4 w-4" /> Filter Another
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
