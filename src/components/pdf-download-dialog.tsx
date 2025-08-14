
"use client";

import { useState, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { Download } from "lucide-react";
import { SuccessDialog } from "./success-dialog";

interface PdfDownloadDialogProps {
  children: React.ReactNode;
  pdfDataUrl: string | null;
  fileName: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PdfDownloadDialog({
  pdfDataUrl,
  fileName: initialFileName,
  children,
  isOpen,
  onOpenChange,
}: PdfDownloadDialogProps) {
  const [fileName, setFileName] = useState(initialFileName);
  const { toast } = useToast();
  const [showSuccess, setShowSuccess] = useState(false);


  useEffect(() => {
    if (isOpen) {
        setFileName(initialFileName);
    }
  }, [isOpen, initialFileName]);

  const handleDownload = () => {
    if (!pdfDataUrl) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No PDF data to download.",
      });
      return;
    }

    const link = document.createElement("a");
    link.href = pdfDataUrl;
    link.download = `${fileName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onOpenChange(false);
    setShowSuccess(true);
  };

  return (
    <>
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Download PDF</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="filename">Filename</Label>
                <Input
                id="filename"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                addonAfter=".pdf"
                />
            </div>
            </div>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" /> Download
            </Button>
            </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
        <SuccessDialog
            isOpen={showSuccess}
            onClose={() => setShowSuccess(false)}
            title="Download Complete"
            description="Your PDF has been successfully downloaded."
        />
    </>
  );
}
