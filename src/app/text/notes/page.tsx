"use client";

import { useState, useRef } from "react";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export default function HandwrittenNotesPage() {
  const [text, setText] = useState("This is a sample note.\nYou can write multiple lines here.");
  const [color, setColor] = useState("#1E40AF"); // A nice blue ink color
  const [fontSize, setFontSize] = useState(24);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const noteStyle: React.CSSProperties = {
    fontFamily: "'Kalam', cursive",
    fontSize: `${fontSize}px`,
    color: color,
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap',
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

            const dpr = window.devicePixelRatio || 1;
            canvas.width = preview.offsetWidth * dpr;
            canvas.height = preview.offsetHeight * dpr;
            
            ctx.scale(dpr, dpr);
            ctx.fillStyle = "#FFFFFF"; // White paper background
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.font = `400 ${fontSize}px 'Kalam', cursive`;
            ctx.fillStyle = color;
            ctx.textBaseline = 'top';

            const lines = text.split('\n');
            const lineHeight = fontSize * 1.6;
            const padding = 20;

            for (let i = 0; i < lines.length; i++) {
                ctx.fillText(lines[i], padding, padding + (i * lineHeight));
            }

            const link = document.createElement("a");
            link.download = "handwritten-note.png";
            link.href = canvas.toDataURL("image/png");
            link.click();
            
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Download Failed",
                description: "Could not generate the note image.",
            });
        } finally {
            setIsDownloading(false);
        }
    }, 100);
  };


  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="Hand-written Notes" showBackButton />
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          <Card>
            <CardHeader>
                <CardTitle>Your Note</CardTitle>
                <CardDescription>This is a preview of your note.</CardDescription>
            </CardHeader>
            <CardContent>
                <div 
                    ref={previewRef} 
                    className="w-full aspect-[4/5] max-h-[500px] p-5 bg-white rounded-lg border shadow-inner overflow-y-auto bg-[linear-gradient(to_bottom,transparent_29px,hsl(var(--primary))_30px),linear-gradient(to_right,transparent_29px,hsl(var(--primary))_30px)] bg-size-[30px_30px]"
                    style={{ backgroundPosition: "-1px -1px", backgroundOrigin: "content-box", backgroundColor: "#fff" }}
                >
                    <div style={noteStyle}>{text || "Start typing..."}</div>
                </div>
                 <canvas ref={canvasRef} className="hidden" />
            </CardContent>
          </Card>
          
          <Card>
              <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-primary"/>
                    Customize
                  </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="noteText">Text</Label>
                    <Textarea 
                        id="noteText"
                        value={text} 
                        onChange={e => setText(e.target.value)} 
                        placeholder="Write your notes here..."
                        rows={5}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="color">Ink Color</Label>
                        <Input id="color" type="color" value={color} onChange={e => setColor(e.target.value)} className="p-1 h-10 w-full" />
                    </div>
                     <div className="space-y-2">
                        <Label>Font Size: {fontSize}px</Label>
                        <Slider value={[fontSize]} onValueChange={([val]) => setFontSize(val)} min={12} max={48} step={1} />
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
