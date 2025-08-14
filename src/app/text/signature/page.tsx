"use client";

import { useState, useRef, useEffect } from "react";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PenSquare, Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

export default function SignaturePage() {
  const [text, setText] = useState("Your Name");
  const [color, setColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(64);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const signatureStyle: React.CSSProperties = {
    fontFamily: "'Great Vibes', cursive",
    fontSize: `${fontSize}px`,
    color: color,
    whiteSpace: 'nowrap',
  };
  
  const handleDownload = () => {
    if (!text) {
        toast({ variant: "destructive", title: "Text is empty!" });
        return;
    }
    
    setIsDownloading(true);

    setTimeout(() => {
        try {
            const canvas = canvasRef.current;
            const preview = previewRef.current;
            if (!canvas || !preview) throw new Error("Elements not found");
            
            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("Canvas context not available");

            // Match canvas to preview element size
            const dpr = window.devicePixelRatio || 1;
            canvas.width = preview.offsetWidth * dpr;
            canvas.height = preview.offsetHeight * dpr;
            
            ctx.scale(dpr, dpr);
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Set styles from preview
            ctx.font = `${fontSize}px 'Great Vibes', cursive`;
            ctx.fillStyle = color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Draw text
            ctx.fillText(text, preview.offsetWidth / 2, preview.offsetHeight / 2);

            // Trigger download
            const link = document.createElement("a");
            link.download = "signature.png";
            link.href = canvas.toDataURL("image/png");
            link.click();
            
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Download Failed",
                description: "Could not generate the signature image.",
            });
        } finally {
            setIsDownloading(false);
        }
    }, 100);
  };


  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="Calligraphy Signature" showBackButton />
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          <Card>
            <CardHeader>
                <CardTitle>Your Signature</CardTitle>
                <CardDescription>This is how your signature will appear.</CardDescription>
            </CardHeader>
            <CardContent>
                <div ref={previewRef} className="w-full h-48 flex items-center justify-center bg-secondary rounded-lg border">
                    <span style={signatureStyle}>{text || "Your Name"}</span>
                </div>
                 <canvas ref={canvasRef} className="hidden" />
            </CardContent>
          </Card>
          
          <Card>
              <CardHeader>
                  <CardTitle className="flex items-center">
                    <PenSquare className="mr-2 h-5 w-5 text-primary"/>
                    Customize
                  </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="signatureText">Text</Label>
                    <Input id="signatureText" value={text} onChange={e => setText(e.target.value)} placeholder="Enter your name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="color">Color</Label>
                        <Input id="color" type="color" value={color} onChange={e => setColor(e.target.value)} className="p-1 h-10 w-full" />
                    </div>
                     <div className="space-y-2">
                        <Label>Font Size: {fontSize}px</Label>
                        <Slider value={[fontSize]} onValueChange={([val]) => setFontSize(val)} min={24} max={128} step={1} />
                    </div>
                </div>
              </CardContent>
          </Card>

          <Card>
             <CardHeader>
                <CardTitle>Download</CardTitle>
             </CardHeader>
             <CardContent>
                <Button className="w-full" onClick={handleDownload} disabled={isDownloading}>
                    {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Download className="mr-2 h-4 w-4" />}
                    Download as PNG
                </Button>
             </CardContent>
          </Card>

      </div>
    </div>
  );
}
