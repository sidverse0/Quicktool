"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, RefreshCw, Loader2 } from "lucide-react";

interface ConvertedImage {
  url: string;
  page: number;
}

export default function PdfToImageResultPage() {
    const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);
    const [imageType, setImageType] = useState<string>("png");
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const imagesStr = sessionStorage.getItem("convertedImages");
        const format = sessionStorage.getItem("imageType");

        if (imagesStr && format) {
            setConvertedImages(JSON.parse(imagesStr));
            setImageType(format);
        } else {
            router.replace("/photo/pdf-to-image");
        }
        setLoading(false);
    }, [router]);

    const handleStartOver = () => {
        sessionStorage.removeItem("convertedImages");
        sessionStorage.removeItem("imageType");
        router.push("/photo/pdf-to-image");
    }

    if (loading) {
        return (
             <div className="flex flex-col h-full">
                <PageHeader title="Conversion Result" showBackButton />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            </div>
        )
    }


  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Conversion Result" showBackButton />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {convertedImages.map(image => (
          <Card key={image.page}>
            <CardContent className="p-4 space-y-4">
              <p className="text-sm font-medium text-center">Page {image.page}</p>
              <div className="relative w-full aspect-[8.5/11] border rounded-lg bg-white">
                  <Image src={image.url} alt={`Page ${image.page}`} layout="fill" className="object-contain p-2" />
              </div>
              <a href={image.url} download={`page-${image.page}.${imageType}`}>
                  <Button className="w-full">
                      <Download className="mr-2 h-4 w-4" /> Download Image
                  </Button>
              </a>
            </CardContent>
          </Card>
        ))}
        <Card>
            <CardContent className="p-4">
                <Button variant="secondary" className="w-full" onClick={handleStartOver}>
                    <RefreshCw className="mr-2 h-4 w-4" /> Convert Another PDF
                </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
