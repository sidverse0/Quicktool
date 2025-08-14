
"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import MainLayout from "@/components/layout/main-layout";
import PageHeader from "@/components/layout/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Image, LifeBuoy, User as UserIcon, Moon, Sun, Languages, Wrench, Coins, Gem, Video, Star } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useUserData } from "@/hooks/use-user-data";
import { useToast } from "@/hooks/use-toast";
import { RewardedAdDialog } from "@/components/rewarded-ad-dialog";

const PREMIUM_COST = 499;

export default function ProfilePage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState("en");
  const { userData, addCoins, unlockPremium } = useUserData();
  const { toast } = useToast();
  const [showAdDialog, setShowAdDialog] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleUnlock = () => {
    if (userData.coins >= PREMIUM_COST) {
      unlockPremium();
      toast({ title: "Success!", description: "Premium unlocked. All features are now unlimited." });
    } else {
        const upiUrl = `upi://pay?pa=8521672813@ybl&pn=Quick%20Tool&am=100.00&cu=INR&tn=Unlock%20Premium`;
        window.location.href = upiUrl;
    }
  }

  if (!mounted) {
    return (
      <MainLayout>
        <div className="flex flex-col h-full">
          <PageHeader title="Profile" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        <RewardedAdDialog
          isOpen={showAdDialog}
          onOpenChange={setShowAdDialog}
          onReward={() => addCoins(10)}
        />
        <PageHeader title="Profile" />
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="relative p-1 rounded-full bg-gradient-to-tr from-primary to-accent">
                <Avatar className="h-24 w-24 border-4 border-background">
                  <AvatarImage src="https://i.postimg.cc/kXnSKfgf/wrench.png" alt="Quick Tool Logo" />
                  <AvatarFallback>
                    <UserIcon className="h-10 w-10 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <h2 className="text-2xl font-bold font-headline mt-4 flex items-center gap-2">
                Quick Tool
                <Wrench className="h-6 w-6 text-primary" />
              </h2>
              <p className="text-muted-foreground">quicktool@sid.com</p>
            </CardContent>
          </Card>

          <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                    <Coins className="mr-2 h-5 w-5 text-amber-500" />
                    My Coins
                </CardTitle>
                <CardDescription>Earn coins to unlock premium features.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="p-4 bg-secondary rounded-lg flex justify-between items-center">
                    <p className="text-lg font-semibold">Your Balance:</p>
                    <div className="flex items-center gap-2">
                        <Coins className="h-6 w-6 text-amber-500" />
                        <p className="text-2xl font-bold">{userData.coins}</p>
                    </div>
                 </div>
                 <Button className="w-full" onClick={() => setShowAdDialog(true)}>
                    <Video className="mr-2" /> Earn 10 Coins
                 </Button>
              </CardContent>
          </Card>

          {!userData.isPremium && (
            <Card className="border-primary/50">
              <CardHeader>
                  <CardTitle className="flex items-center text-primary">
                      <Gem className="mr-2 h-5 w-5" />
                      Unlock Premium
                  </CardTitle>
                  <CardDescription>Get unlimited access to all tools forever.</CardDescription>
              </CardHeader>
              <CardContent>
                  <Button className="w-full" onClick={handleUnlock}>
                     {userData.coins >= PREMIUM_COST ? `Unlock for ${PREMIUM_COST} Coins` : `Unlock for 100 INR or ${PREMIUM_COST} Coins`}
                  </Button>
              </CardContent>
            </Card>
          )}

          {userData.isPremium && (
             <Card className="bg-gradient-to-tr from-amber-400 to-yellow-500 text-black">
                <CardContent className="pt-6 flex items-center gap-4">
                    <Star className="h-10 w-10 text-white" fill="white" />
                    <div>
                        <CardTitle>Premium Member</CardTitle>
                        <CardDescription className="text-black/80">You have unlimited access to all tools.</CardDescription>
                    </div>
                </CardContent>
             </Card>
          )}

          <Card>
            <CardHeader>
                <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label htmlFor="dark-mode" className="text-base flex items-center">
                    {theme === 'dark' ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
                    Dark Mode
                    </Label>
                </div>
                <Switch
                    id="dark-mode"
                    checked={theme === "dark"}
                    onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
                />
                </div>
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Languages className="mr-2 h-5 w-5 text-muted-foreground" />
                    Language
                </CardTitle>
                <CardDescription>Select your preferred language.</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
                <Button onClick={() => setLanguage('en')} variant={language === 'en' ? 'default' : 'outline'} className="w-full">English</Button>
                <Button onClick={() => setLanguage('hi')} variant={language === 'hi' ? 'default' : 'outline'} className="w-full">Hindi</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Support</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                  <LifeBuoy className="mr-2 h-4 w-4"/>
                  Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
