
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IndianRupee, Upload, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const toolColor = "#5de87a";

const colorPresets = [
    { name: "Black/White", fg: "#000000", bg: "#FFFFFF" },
    { name: "Neon Green", fg: "#39FF14", bg: "#000000" },
    { name: "Neon Blue", fg: "#00FFFF", bg: "#000000" },
    { name: "Hot Pink", fg: "#FF007F", bg: "#FFFFFF" },
    { name: "Purple/Yellow", fg: "#6f42c1", bg: "#f1e05a" },
];

export default function UpiPaymentPage() {
  const [payeeName, setPayeeName] = useState("Jane Doe");
  const [upiId, setUpiId] = useState("jane.doe@upi");
  const [phone, setPhone] = useState("");
  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [logo, setLogo] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          if (file.size > 1 * 1024 * 1024) { // 1MB limit
            toast({ variant: 'destructive', title: "Logo is too large!", description: "Please choose a file smaller than 1MB." });
            return;
          }
          setLogo(file);
      }
  }

  const handleGenerate = () => {
    if (!payeeName.trim() || (!upiId.trim() && !phone.trim())) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please enter Payee Name and either a UPI ID or Phone Number.",
      });
      return;
    }

    let upiUrl = `upi://pay?pn=${encodeURIComponent(payeeName)}&cu=INR`;
    
    // Prefer UPI ID if both are provided
    if (upiId.trim()) {
        upiUrl += `&pa=${encodeURIComponent(upiId.trim())}`;
    } else if (phone.trim()) {
        // Simple validation for phone number
        if (/^\d{10}$/.test(phone.trim())) {
             // This is a simplification. Real world might need provider detection.
             // Using a common example format.
            upiUrl += `&pa=${encodeURIComponent(phone.trim())}@paytm`;
        } else {
            toast({
                variant: "destructive",
                title: "Invalid Phone Number",
                description: "Please enter a valid 10-digit phone number.",
            });
            return;
        }
    }
    
    const processAndNavigate = (logoDataUrl: string | null) => {
        const params = new URLSearchParams({
            text: upiUrl,
            color,
            bgColor,
        });

        sessionStorage.setItem("toolColor", toolColor);
        if (logoDataUrl) {
            sessionStorage.setItem("qrLogo", logoDataUrl);
        } else {
            sessionStorage.removeItem("qrLogo");
        }
        router.push(`/qr/maker/result?${params.toString()}`);
    };

    if (logo) {
        const reader = new FileReader();
        reader.onload = (e) => {
            processAndNavigate(e.target?.result as string);
        };
        reader.readAsDataURL(logo);
    } else {
        processAndNavigate(null);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="UPI Payment QR Code" showBackButton />
      <div className="flex-1 flex flex-col p-4 space-y-6 overflow-y-auto">
          <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="payeeName">Payee Name</Label>
                <Input id="payeeName" value={payeeName} onChange={(e) => setPayeeName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="upiId">UPI ID</Label>
                <Input id="upiId" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
              </div>
               <div className="text-center text-sm text-muted-foreground">OR</div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit number" />
              </div>
          </div>
          
          <div className="space-y-4">
            <Label>Colors</Label>
            <div className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-2">
                     <div className="relative w-12 h-12">
                         <Input id="color" type="color" value={color} onChange={e => setColor(e.target.value)} className="w-full h-full p-0 border-none rounded-full cursor-pointer"/>
                     </div>
                     <span className="text-xs">Dots</span>
                </div>
                 <div className="flex flex-col items-center gap-2">
                     <div className="relative w-12 h-12">
                        <Input id="bgColor" type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-full h-full p-0 border-2 rounded-full cursor-pointer"/>
                     </div>
                     <span className="text-xs">Background</span>
                </div>
            </div>
            <div className="flex flex-wrap gap-2">
                {colorPresets.map(preset => (
                    <Button key={preset.name} variant="outline" size="sm" onClick={() => { setColor(preset.fg); setBgColor(preset.bg); }}>
                        {preset.name}
                    </Button>
                ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Logo (optional)</Label>
            <div className="flex items-center gap-4">
                <input type="file" accept="image/png, image/jpeg, image/svg+xml" ref={fileInputRef} onChange={handleLogoSelect} className="hidden" />
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4"/>
                    {logo ? "Change Logo" : "Upload Logo"}
                </Button>
                {logo && <span className="text-sm text-muted-foreground truncate">{logo.name}</span>}
            </div>
          </div>

           <div className="pt-4">
            <Button
              className="w-full"
              onClick={handleGenerate}
              style={{ backgroundColor: toolColor }}
            >
              <IndianRupee className="mr-2 h-4 w-4" />
              Generate Payment QR
            </Button>
           </div>
      </div>
    </div>
  );
}
