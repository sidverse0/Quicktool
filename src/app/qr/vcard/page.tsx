
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserSquare, Square, Circle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ColorPickerDialog } from "@/components/color-picker-dialog";
import { cn } from "@/lib/utils";
import { useUserData } from "@/hooks/use-user-data";
import { UsageLimitDialog } from "@/components/usage-limit-dialog";

const toolName = "qrVCard";
const toolColor = "#de5de8";

export default function VCardPage() {
  const [name, setName] = useState("John Doe");
  const [phone, setPhone] = useState("123-456-7890");
  const [email, setEmail] = useState("john.doe@example.com");
  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [style, setStyle] = useState<"squares" | "dots">("squares");
  const router = useRouter();
  const { toast } = useToast();
  const { canUseTool, incrementToolUsage } = useUserData();
  const [showUsageLimitDialog, setShowUsageLimitDialog] = useState(false);

  const handleGenerate = () => {
    if (!canUseTool(toolName)) {
      setShowUsageLimitDialog(true);
      return;
    }

    const vCard = `BEGIN:VCARD
VERSION:3.0
N:${name}
FN:${name}
TEL;TYPE=CELL:${phone}
EMAIL:${email}
END:VCARD`;

    const params = new URLSearchParams({
        text: vCard,
        color,
        bgColor,
        style,
    });
    
    incrementToolUsage(toolName);
    sessionStorage.setItem("toolColor", toolColor);
    router.push(`/qr/maker/result?${params.toString()}`);
  };

  return (
    <div className="flex flex-col h-full">
      <UsageLimitDialog isOpen={showUsageLimitDialog} onOpenChange={setShowUsageLimitDialog} />
      <PageHeader title="vCard QR Code" showBackButton />
      <div className="flex-1 flex flex-col p-4 space-y-6 overflow-y-auto">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label>Colors</Label>
              <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center gap-2">
                      <ColorPickerDialog value={color} onChange={setColor}>
                          <button className="h-12 w-12 rounded-full border-2 border-muted" style={{ backgroundColor: color }} aria-label="Select dot color" />
                      </ColorPickerDialog>
                      <span className="text-xs">Dots</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                      <ColorPickerDialog value={bgColor} onChange={setBgColor}>
                          <button className="h-12 w-12 rounded-full border-2 border-muted" style={{ backgroundColor: bgColor }} aria-label="Select background color" />
                      </ColorPickerDialog>
                      <span className="text-xs">Background</span>
                  </div>
              </div>
            </div>
            <div className="space-y-4">
              <Label>Style</Label>
              <div className="flex items-center gap-4">
                  <button onClick={() => setStyle("squares")} className={cn("h-12 w-12 rounded-full border-2 flex items-center justify-center", style === 'squares' ? 'border-primary ring-2 ring-primary' : 'border-muted')}>
                      <Square className="h-6 w-6" />
                  </button>
                  <button onClick={() => setStyle("dots")} className={cn("h-12 w-12 rounded-full border-2 flex items-center justify-center", style === 'dots' ? 'border-primary ring-2 ring-primary' : 'border-muted')}>
                      <Circle className="h-6 w-6" />
                  </button>
              </div>
            </div>
          </div>

           <div className="pt-4">
            <Button
              className="w-full"
              onClick={handleGenerate}
              style={{ backgroundColor: toolColor }}
            >
              <UserSquare className="mr-2 h-4 w-4" />
              Generate vCard QR
            </Button>
           </div>
      </div>
    </div>
  );
}
