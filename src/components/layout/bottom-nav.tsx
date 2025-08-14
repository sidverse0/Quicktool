"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Image, QrCode, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/photo", label: "Photo", icon: Image },
  { href: "/qr", label: "QR", icon: QrCode },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/profile", label: "Profile", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-t">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
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
                "flex flex-col items-center justify-center text-muted-foreground hover:text-primary transition-colors w-16",
                isActive && "text-primary"
              )}
            >
              <item.icon className="h-6 w-6" />
              <span
                className={cn(
                  "text-xs font-medium transition-all duration-200",
                  isActive ? "opacity-100" : "opacity-0"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
