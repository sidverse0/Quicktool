import BottomNav from "@/components/layout/bottom-nav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full bg-background">
      <main className="flex-1 flex flex-col min-h-0 pb-16">{children}</main>
      <BottomNav />
    </div>
  );
}
