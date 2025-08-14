
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import LoadingIndicator from "@/components/layout/loading-indicator";

interface ConvertedImage {
  url: string;
  page: number;
}

export default function PdfToImageResultPage() {
    const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);
    const [imageType, setImageType] = useState<string>("png");
    const [loading, setLoading] = useState(true);
    const [toolColor, setToolColor] = useState("hsl(var(--primary))");
    const router = useRouter();

    useEffect(() => {
        const imagesStr = sessionStorage.getItem("convertedImages");
        const format = sessionStorage.getItem("imageType");
        const color = sessionStorage.getItem("toolColor");

        if (imagesStr && format) {
            setConvertedImages(JSON.parse(imagesStr));
            setImageType(format);
            if (color) {
                setToolColor(color);
            }
        } else {
            router.replace("/photo/pdf-to-image");
        }
        setLoading(false);
    }, [router]);

    const handleStartOver = () => {
        sessionStorage.removeItem("convertedImages");
        sessionStorage.removeItem("imageType");
        sessionStorage.removeItem("toolColor");
        router.push("/photo/pdf-to-image");
    }

    if (loading) {
        return (
             <div className="flex flex-col h-full">
                <PageHeader title="Conversion Result" showBackButton />
                <div className="flex-1 flex items-center justify-center">
                    <LoadingIndicator />
                </div>
            </div>
        )
    }


  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Conversion Result" showBackButton />
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {convertedImages.map(image => (
          <div key={image.page} className="space-y-2">
              <p className="text-sm font-medium text-center">Page {image.page}</p>
              <div className="relative w-full aspect-[8.5/11] border-2 border-dashed rounded-lg bg-secondary" style={{ borderColor: toolColor }}>
                  <Image src={image.url} alt={`Page ${image.page}`} layout="fill" className="object-contain p-2" />
                  <a href={image.url} download={`page-${image.page}.${imageType}`} className="absolute top-2 right-2">
                      <Button size="icon" className="h-9 w-9" style={{ backgroundColor: toolColor }}>
                          <Download className="h-5 w-5" />
                      </Button>
                  </a>
              </div>
          </div>
        ))}
        <div className="pt-4">
            <Button variant="secondary" className="w-full" onClick={handleStartOver}>
                <RefreshCw className="mr-2 h-4 w-4" /> Convert Another PDF
            </Button>
        </div>
      </div>
    </div>
  );
}
