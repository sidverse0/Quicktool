
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Image as ImageIcon, QrCode, User, PenSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/use-language";

const navItems = [
  { href: "/", labelKey: "home", icon: Home, color: "text-primary", borderColor: "border-primary" },
  { href: "/photo", labelKey: "photo", icon: ImageIcon, color: "text-rose-500", borderColor: "border-rose-500" },
  { href: "/qr", labelKey: "qr", icon: QrCode, color: "text-indigo-500", borderColor: "border-indigo-500" },
  { href: "/text", labelKey: "text", icon: PenSquare, color: "text-teal-500", borderColor: "border-teal-500" },
  { href: "/profile", labelKey: "profile", icon: User, color: "text-amber-500", borderColor: "border-amber-500" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-t">
      <div className="flex justify-around items-stretch h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === item.href
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center text-muted-foreground hover:text-primary transition-colors w-1/5 pt-1 group"
              )}
            >
              <div
                className={cn(
                  "p-2 rounded-full transition-all border-2",
                  isActive
                    ? `bg-primary/10 ${item.borderColor}`
                    : "border-transparent text-muted-foreground group-hover:text-primary",
                  isActive && item.color
                )}
              >
                <item.icon className="h-6 w-6" />
              </div>
              <span
                className={cn(
                  "text-xs font-medium transition-colors",
                  isActive ? item.color : "text-muted-foreground"
                )}
              >
                {t(`nav.${item.labelKey}`)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
