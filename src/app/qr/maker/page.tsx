"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text, Download, Loader2, Palette } from "lucide-react";

export default function QrMakerPage() {
  const [text, setText] = useState("https://firebase.google.com/");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [debouncedText, setDebouncedText] = useState(text);
  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedText(text);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [text]);

  useEffect(() => {
    if (debouncedText) {
      generateQrCode();
    } else {
      setQrCodeUrl("");
    }
  }, [debouncedText, color, bgColor]);

  const generateQrCode = () => {
    setIsLoading(true);
    const colorHex = color.substring(1);
    const bgColorHex = bgColor.substring(1);
    const url = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
      debouncedText
    )}&size=512x512&margin=20&format=png&color=${colorHex}&bgcolor=${bgColorHex}`;
    setQrCodeUrl(url);
  };


  const handleDownload = async () => {
    if (!qrCodeUrl) return;
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "qrcode.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download QR code", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="QR Code Maker" showBackButton />
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        <Card>
            <CardHeader>
              <CardTitle>Your QR Code</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center aspect-square bg-gray-100 rounded-lg">
              {isLoading && (
                <div className="flex flex-col items-center text-muted-foreground">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <p className="mt-2">Generating...</p>
                </div>
              )}
              {qrCodeUrl && (
                <Image
                  src={qrCodeUrl}
                  alt="Generated QR Code"
                  width={512}
                  height={512}
                  className={`transition-opacity duration-300 ${
                    isLoading ? "opacity-0" : "opacity-100"
                  }`}
                  onLoad={() => setIsLoading(false)}
                  unoptimized
                />
              )}
              {!qrCodeUrl && !text && (
                <div className="text-center text-muted-foreground">
                  <p>Enter some text to generate a QR code.</p>
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Text className="mr-2 h-5 w-5 text-primary" />
                Enter Your Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text">Text or URL</Label>
                <Input
                  id="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="mr-2 h-5 w-5 text-primary" />
                Customize Colors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="color">Dot Color</Label>
                  <Input id="color" type="color" value={color} onChange={e => setColor(e.target.value)} className="p-1 h-10"/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bgColor">Background Color</Label>
                  <Input id="bgColor" type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="p-1 h-10"/>
                </div>
              </div>
            </CardContent>
          </Card>
           <Card>
             <CardHeader>
                <CardTitle>Download</CardTitle>
             </CardHeader>
             <CardContent>
                <Button
                  className="w-full"
                  onClick={handleDownload}
                  disabled={!qrCodeUrl || isLoading}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download QR Code
                </Button>
             </CardContent>
           </Card>
      </div>
    </div>
  );
}
