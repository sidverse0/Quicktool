
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
import { Coins } from "lucide-react";

interface RewardedAdDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onReward: () => void;
}

const VIDEO_ID = "ebV9x7xktLg";
const COUNTDOWN_SECONDS = 22;

export function RewardedAdDialog({ isOpen, onOpenChange, onReward }: RewardedAdDialogProps) {
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [canClaim, setCanClaim] = useState(false);
  const { toast } = useToast();

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
    toast({
        title: "Reward Claimed!",
        description: "You've earned 25 coins.",
    })
    onOpenChange(false);
  };

  const videoSrc = `https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&controls=0&mute=1&loop=1&playlist=${VIDEO_ID}`;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">Watch & Earn</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="aspect-w-9 aspect-h-16 relative">
          <iframe
            src={videoSrc}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full rounded-md"
          ></iframe>
        </div>
        <AlertDialogFooter>
          <Button onClick={handleClaim} disabled={!canClaim} className="w-full">
            {canClaim ? (
                <><Coins className="mr-2 h-4 w-4" /> Claim 25 Coins</>
            ) : (
                `Claim in ${countdown}s`
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
