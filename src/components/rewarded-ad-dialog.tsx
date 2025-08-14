
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
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(COUNTDOWN_SECONDS);
      setCanClaim(false);
      return;
    }

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
  }, [isOpen]);

  const handleClaim = () => {
    onReward();
    onOpenChange(false);
    setShowSuccess(true);
  };
  
  const videoSrc = `https://www.youtube.com/embed/${VIDEO_ID}?controls=0&loop=1&playlist=${VIDEO_ID}&autoplay=1&mute=0`;

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
          </div>
          <AlertDialogFooter>
            <Button onClick={handleClaim} disabled={!canClaim} className="w-full">
              {canClaim ? (
                  <><Coins className="mr-2 h-4 w-4" /> Claim 10 Coins</>
              ) : (
                  `Claim in ${countdown}s`
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
