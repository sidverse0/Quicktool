
"use client";

import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Gem, Lock } from "lucide-react";

interface UsageLimitDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UsageLimitDialog({ isOpen, onOpenChange }: UsageLimitDialogProps) {
  const router = useRouter();
  if (!isOpen) return null;

  const handleGoToProfile = () => {
      router.push("/profile");
      onOpenChange(false);
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader className="flex flex-col items-center text-center">
            <Lock className="h-16 w-16 text-destructive mb-4" />
            <AlertDialogTitle className="text-2xl">Usage Limit Reached</AlertDialogTitle>
            <AlertDialogDescription className="text-base text-muted-foreground">
                You've used up your 10 free uses for this tool. Please unlock premium for unlimited access.
            </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center flex-col sm:flex-row gap-2">
          <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleGoToProfile} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
            <Gem className="mr-2 h-4 w-4" /> Go to Profile
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
