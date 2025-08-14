
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { IndianRupee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const toolColor = "#5de87a";

export default function UpiPaymentPage() {
  const [payeeName, setPayeeName] = useState("Jane Doe");
  const [upiId, setUpiId] = useState("jane.doe@upi");
  const [phone, setPhone] = useState("");
  const router = useRouter();
  const { toast } = useToast();

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
    
    if (upiId.trim()) {
        upiUrl += `&pa=${encodeURIComponent(upiId)}`;
    } else if (phone.trim()) {
        upiUrl += `&pa=${encodeURIComponent(phone)}@paytm`; // Example, should be configurable or detected
    }

    const params = new URLSearchParams({
        text: upiUrl,
        color: '#000000',
        bgColor: '#FFFFFF',
    });
    sessionStorage.setItem("toolColor", toolColor);
    router.push(`/qr/maker/result?${params.toString()}`);
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="UPI Payment QR Code" showBackButton />
      <div className="flex-1 flex flex-col justify-center p-4 space-y-6">
          <Card className="shadow-none border-none">
            <CardContent className="space-y-4 p-0">
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
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </CardContent>
          </Card>
           <Card className="shadow-none border-none">
             <CardContent className="p-0">
                <Button
                  className="w-full"
                  onClick={handleGenerate}
                >
                  <IndianRupee className="mr-2 h-4 w-4" />
                  Generate Payment QR
                </Button>
             </CardContent>
           </Card>
      </div>
    </div>
  );
}
