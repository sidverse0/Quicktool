
"use client";

import { useState, useEffect } from "react";
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

const VIDEO_ID = "ebV9x7xktLg";
const COUNTDOWN_SECONDS = 30;

export function RewardedAdDialog({ isOpen, onOpenChange, onReward }: RewardedAdDialogProps) {
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [canClaim, setCanClaim] = useState(false);
  const [isAdStarted, setIsAdStarted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!isOpen) {
      setCountdown(COUNTDOWN_SECONDS);
      setCanClaim(false);
      setIsAdStarted(false);
      return;
    }

    if (!isAdStarted) return;

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
  }, [isOpen, isAdStarted]);

  const handleClaim = () => {
    onReward();
    toast({
        title: "Reward Claimed!",
        description: "You've earned 10 coins.",
    })
    onOpenChange(false);
  };
  
  const handlePlay = () => {
      setIsAdStarted(true);
  }

  const videoSrc = `https://www.youtube.com/embed/${VIDEO_ID}?controls=0&loop=1&playlist=${VIDEO_ID}`;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">Watch & Earn</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="aspect-w-9 aspect-h-16 relative w-full bg-black rounded-md">
          <iframe
            src={videoSrc}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className={cn("w-full h-full rounded-md transition-opacity", isAdStarted ? 'opacity-100' : 'opacity-0')}
          ></iframe>
          {!isAdStarted && (
            <div 
                className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer bg-black/50"
                onClick={handlePlay}
            >
                <PlayCircle className="h-20 w-20 text-white/80 hover:text-white transition-colors" />
                <p className="text-white font-semibold mt-2">Tap to Play</p>
            </div>
          )}
        </div>
        <AlertDialogFooter>
          <Button onClick={handleClaim} disabled={!canClaim || !isAdStarted} className="w-full">
            {isAdStarted ? (
              canClaim ? (
                  <><Coins className="mr-2 h-4 w-4" /> Claim 10 Coins</>
              ) : (
                  `Claim in ${countdown}s`
              )
            ) : (
                'Watch the video to claim'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
