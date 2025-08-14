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
import { SuccessDialog } from "./success-dialog";

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
  const [timerStarted, setTimerStarted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(COUNTDOWN_SECONDS);
      setCanClaim(false);
      setTimerStarted(false);
      return;
    }

    if (!timerStarted) return;

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
  }, [isOpen, timerStarted]);

  const handleClaim = () => {
    onReward();
    onOpenChange(false);
    setShowSuccess(true);
  };
  
  const handlePlay = () => {
      if(!timerStarted) {
          setTimerStarted(true);
      }
  }

  const videoSrc = `https://www.youtube.com/embed/${VIDEO_ID}?controls=0&loop=1&playlist=${VIDEO_ID}&autoplay=1`;

  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
        <AlertDialogContent className="max-w-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">Watch & Earn</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="aspect-video relative w-full bg-black rounded-md overflow-hidden">
            <iframe
              src={videoSrc}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
            {!timerStarted && (
                 <div 
                    className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/50"
                    onClick={handlePlay}
                >
                    <PlayCircle className="h-16 w-16 text-white/70" />
                </div>
            )}
          </div>
          <AlertDialogFooter>
            <Button onClick={handleClaim} disabled={!canClaim} className="w-full">
              {canClaim ? (
                  <><Coins className="mr-2 h-4 w-4" /> Claim 10 Coins</>
              ) : timerStarted ? (
                  `Claim in ${countdown}s`
              ) : (
                "Watch video to claim"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
       <SuccessDialog
            isOpen={showSuccess}
            onClose={() => setShowSuccess(false)}
            title="Reward Claimed!"
            description="You've earned 10 coins."
        />
    </>
  );
}