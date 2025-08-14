
"use client"

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

const presetColors = [
  "#FF4136", // Red
  "#0074D9", // Blue
  "#2ECC40", // Green
  "#FFDC00", // Yellow
  "#B10DC9", // Purple
  "#FF851B", // Orange
  "#39CCCC", // Teal
  "#F012BE", // Pink
  "#7FDBFF", // Sky Blue
  "#3D9970", // Olive
  "#01FF70", // Lime
  "#85144b", // Maroon
  "#AAAAAA", // Gray
  "#DDDDDD", // Light Gray
  "#000000", // Black
  "#FFFFFF", // White
];


interface ColorPickerDialogProps {
  children: React.ReactNode;
  value: string;
  onChange: (color: string) => void;
}

export function ColorPickerDialog({ children, value, onChange }: ColorPickerDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(value);

  const handleSetColor = () => {
    onChange(selectedColor);
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
            {children}
        </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Select a Color</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="grid grid-cols-5 gap-4 py-4">
          {presetColors.map((color) => (
            <button
              key={color}
              className={cn(
                "w-10 h-10 rounded-full border-2 transition-transform transform hover:scale-110",
                selectedColor.toLowerCase() === color.toLowerCase()
                  ? "border-primary ring-2 ring-primary"
                  : "border-muted-foreground/50"
              )}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
            />
          ))}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={handleSetColor}>Set</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
