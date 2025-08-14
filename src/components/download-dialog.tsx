
"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Download } from "lucide-react";

interface DownloadDialogProps {
  children: React.ReactNode;
  dataUrl: string | null;
  fileName: string;
  triggerButton?: React.ReactNode;
}

export function DownloadDialog({ dataUrl, fileName: initialFileName, children }: DownloadDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [fileName, setFileName] = useState(initialFileName);
  const [format, setFormat] = useState<"png" | "jpeg">("png");
  const { toast } = useToast();

  const handleDownload = () => {
    if (!dataUrl) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No image data to download.",
      });
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
       toast({ variant: "destructive", title: "Error", description: "Canvas not supported." });
       return;
    }
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        if (format === 'jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);
        const link = document.createElement("a");
        link.href = canvas.toDataURL(`image/${format}`, format === 'jpeg' ? 0.9 : undefined);
        link.download = `${fileName}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: "Success!", description: "Your image has been downloaded." });
        setIsOpen(false);
    }
    img.onerror = () => {
        toast({ variant: "destructive", title: "Error", description: "Could not load image for download." });
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
            {children}
        </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Download Options</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="filename">Filename</Label>
                <Input id="filename" value={fileName} onChange={(e) => setFileName(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="format">Format</Label>
                <Select value={format} onValueChange={(value: "png" | "jpeg") => setFormat(value)}>
                    <SelectTrigger id="format">
                        <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="png">PNG</SelectItem>
                        <SelectItem value="jpeg">JPG</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={handleDownload}><Download className="mr-2 h-4 w-4" /> Download</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
