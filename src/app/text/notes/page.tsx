
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Pipette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useUserData } from "@/hooks/use-user-data";
import { UsageLimitDialog } from "@/components/usage-limit-dialog";
import { ColorPickerDialog } from "@/components/color-picker-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const toolName = "handwrittenNotes";
const toolColor = "#e8d55d";

const fontOptions = [
    { value: "'Kalam', cursive", label: "Kalam" },
    { value: "'Great Vibes', cursive", label: "Great Vibes" },
    { value: "'Parisienne', cursive", label: "Parisienne" },
    { value: "'Sacramento', cursive", label: "Sacramento" },
    { value: "'Dancing Script', cursive", label: "Dancing Script" },
    { value: "'Pacifico', cursive", label: "Pacifico" },
];

export default function HandwrittenNotesPage() {
  const [text, setText] = useState("This is a sample note. You can write multiple lines here and the text will automatically wrap to the next line when it reaches the end of the page.");
  const [inkColor, setInkColor] = useState("#1E40AF");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [showLines, setShowLines] = useState(true);
  const [fontSize, setFontSize] = useState(24);
  const [fontFamily, setFontFamily] = useState(fontOptions[0].value);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { canUseTool, incrementToolUsage } = useUserData();
  const [showUsageLimitDialog, setShowUsageLimitDialog] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (previewRef.current) {
        previewRef.current.scrollTop = previewRef.current.scrollHeight;
    }
  }, [text]);

  const lineHeight = fontSize * 1.6;
  const noteStyle: React.CSSProperties = {
    fontFamily: fontFamily,
    fontSize: `${fontSize}px`,
    color: inkColor,
    lineHeight: `${lineHeight}px`,
    whiteSpace: 'pre-wrap',
    overflowWrap: 'break-word',
    backgroundColor: bgColor,
    backgroundSize: showLines ? `auto ${lineHeight}px` : undefined,
    backgroundImage: showLines ? `linear-gradient(to bottom, transparent ${lineHeight - 1}px, #aab5f1 1px)` : undefined,
    paddingTop: `${lineHeight * 0.25}px`,
    paddingLeft: '15px',
    paddingRight: '15px',
    paddingBottom: '20px',
    height: `${lineHeight * 22}px`,
  };
  
  const handleGenerate = () => {
    if (!text) {
        toast({ variant: "destructive", title: "Text is empty!" });
        return;
    }
    
    if (!canUseTool(toolName)) {
      setShowUsageLimitDialog(true);
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
        try {
            const FULL_PAGE_LINES = 22;
            const paddingX = 10;
            const paddingTop = lineHeight * 0.25;
            const paddingBottom = 20;

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("Canvas context not available");

            const dpr = window.devicePixelRatio || 1;
            const canvasWidth = (previewRef.current?.offsetWidth || 300);
            const canvasHeight = (lineHeight * FULL_PAGE_LINES) + paddingTop + paddingBottom;
            const maxWidth = canvasWidth - (paddingX * 2);

            canvas.width = canvasWidth * dpr;
            canvas.height = canvasHeight * dpr;
            
            ctx.scale(dpr, dpr);
            
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            
            if (showLines) {
                ctx.strokeStyle = '#aab5f1';
                ctx.lineWidth = 1;
                for (let i = 0; i < FULL_PAGE_LINES; i++) {
                    const y = paddingTop + (i * lineHeight) + (fontSize * 0.9);
                     if (y < canvasHeight - paddingBottom/2) {
                        ctx.beginPath();
                        ctx.moveTo(0, y);
                        ctx.lineTo(canvasWidth, y);
                        ctx.stroke();
                    }
                }
            }
            
            ctx.font = `${fontSize}px ${fontFamily.split(',')[0].replace(/'/g, "")}`;
            ctx.fillStyle = inkColor;
            ctx.textBaseline = 'alphabetic';

            function wrapText(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
                const paragraphs = text.split('\n');
                let lineIndex = 0;

                for (const paragraph of paragraphs) {
                    const words = paragraph.split(' ');
                    let line = '';

                    for (let n = 0; n < words.length; n++) {
                        const testLine = line + words[n] + ' ';
                        const metrics = context.measureText(testLine);
                        const testWidth = metrics.width;
                        if (testWidth > maxWidth && n > 0) {
                            context.fillText(line, x, y + (lineIndex * lineHeight));
                            line = words[n] + ' ';
                            lineIndex++;
                        } else {
                            line = testLine;
                        }
                    }
                    context.fillText(line, x, y + (lineIndex * lineHeight));
                    lineIndex++;
                }
            }
            
            const firstLineY = paddingTop + (fontSize * 0.9);
            wrapText(ctx, text, paddingX, firstLineY, maxWidth, lineHeight);
            
            const dataUrl = canvas.toDataURL("image/png");
            
            incrementToolUsage(toolName);
            sessionStorage.setItem("toolColor", toolColor);
            sessionStorage.setItem("noteImageDataUrl", dataUrl);
            router.push('/text/notes/result');

        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Generation Failed",
                description: "Could not generate the note image.",
            });
        } finally {
            setIsProcessing(false);
        }
    }, 100);
  };


  return (
    <div className="flex flex-col h-full">
      <UsageLimitDialog isOpen={showUsageLimitDialog} onOpenChange={setShowUsageLimitDialog} />
      <PageHeader title="Hand-written Notes" showBackButton />
      <div className="flex-1 flex flex-col p-4 space-y-4 min-h-0">
        <div 
            ref={previewRef}
            className="flex-1 min-h-0 w-full rounded-lg border shadow-inner overflow-y-auto"
            style={noteStyle}
        >
          <div className="whitespace-pre-wrap break-words">{text}</div>
        </div>
          
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="noteText">Text</Label>
                <Textarea 
                    id="noteText"
                    value={text} 
                    onChange={e => setText(e.target.value)} 
                    placeholder="Write your notes here..."
                    rows={3}
                />
            </div>

            <div className="space-y-2">
              <Label>Font Style</Label>
              <Select value={fontFamily} onValueChange={setFontFamily}>
                  <SelectTrigger>
                      <SelectValue placeholder="Select a font" />
                  </SelectTrigger>
                  <SelectContent>
                      {fontOptions.map(font => (
                          <SelectItem key={font.value} value={font.value}>
                              <span style={{fontFamily: font.value}}>{font.label}</span>
                          </SelectItem>
                      ))}
                  </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4 items-end">
                <div className="space-y-2">
                    <Label>Font Size: {fontSize}px</Label>
                    <Slider value={[fontSize]} onValueChange={([val]) => setFontSize(val)} min={12} max={48} step={1} />
                </div>
                 <div className="flex items-center space-x-2">
                    <Switch id="show-lines" checked={showLines} onCheckedChange={setShowLines} />
                    <Label htmlFor="show-lines">Show Lines</Label>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2 flex flex-col items-center">
                    <Label>Ink Color</Label>
                    <ColorPickerDialog value={inkColor} onChange={setInkColor}>
                        <button className="h-10 w-10 rounded-full border-2 border-muted" style={{ backgroundColor: inkColor }} aria-label="Select ink color" />
                    </ColorPickerDialog>
                </div>
                <div className="space-y-2 flex flex-col items-center">
                    <Label>Paper Color</Label>
                    <ColorPickerDialog value={bgColor} onChange={setBgColor}>
                        <button className="h-10 w-10 rounded-full border-2 border-muted" style={{ backgroundColor: bgColor }} aria-label="Select background color" />
                    </ColorPickerDialog>
                </div>
            </div>
        </div>

        <Button className="w-full mt-4 shrink-0" onClick={handleGenerate} disabled={isProcessing}>
            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Generate Note"}
        </Button>

      </div>
    </div>
  );
}
