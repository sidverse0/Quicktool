
"use client";

import { useState, useEffect, useRef } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Coins, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface RewardedAdDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onReward: () => void;
}

const COUNTDOWN_SECONDS = 30;

export function RewardedAdDialog({ isOpen, onOpenChange, onReward }: RewardedAdDialogProps) {
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [canClaim, setCanClaim] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!isOpen) {
      setHasStarted(false);
      setCountdown(COUNTDOWN_SECONDS);
      setCanClaim(false);
      videoRef.current?.pause();
      return;
    }

    if (!hasStarted) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanClaim(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, hasStarted]);

  const handleClaim = () => {
    onReward();
    onOpenChange(false);
    toast({
        title: "Reward Claimed!",
        description: "You've earned 10 coins.",
    });
  };

  const handleStart = () => {
    setHasStarted(true);
    videoRef.current?.play();
  }
  
  const videoSrc = "https://files.catbox.moe/3v5etq.mp4";

  return (
      <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
        <AlertDialogContent className="max-w-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">Watch & Earn</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="aspect-video relative w-full bg-black rounded-md overflow-hidden flex items-center justify-center">
             {!hasStarted && (
                <button onClick={handleStart} className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white/80 hover:text-white transition-colors bg-black/50">
                    <PlayCircle className="h-20 w-20" />
                    <span className="font-semibold mt-2">Tap to Play</span>
                </button>
             )}
             <video
                ref={videoRef}
                src={videoSrc}
                playsInline
                className="w-full h-full object-contain"
             />
          </div>
          {hasStarted && (
            <AlertDialogFooter>
              <Button onClick={handleClaim} disabled={!canClaim} className="w-full">
                {canClaim ? (
                    <><Coins className="mr-2 h-4 w-4" /> Claim 10 Coins</>
                ) : (
                    `Claim in ${countdown}s`
                )}
              </Button>
            </AlertDialogFooter>
          )}
        </AlertDialogContent>
      </AlertDialog>
  );
}
