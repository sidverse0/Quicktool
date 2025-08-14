import MainLayout from "@/components/layout/main-layout";
import PageHeader from "@/components/layout/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Image, LifeBuoy, User as UserIcon } from "lucide-react";

const stats = [
  {
    icon: <Image className="h-6 w-6 text-primary" />,
    label: "Photos Edited",
    value: "42",
  },
  {
    icon: <QrCode className="h-6 w-6 text-primary" />,
    label: "QRs Generated",
    value: "15",
  },
];

export default function ProfilePage() {
  return (
    <MainLayout>
      <PageHeader title="Profile" />
      <div className="p-4 md:p-6 space-y-6">
        <Card>
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4 border-4 border-primary/20">
              <AvatarImage src="https://placehold.co/100x100.png" alt="User" data-ai-hint="profile picture" />
              <AvatarFallback>
                <UserIcon className="h-10 w-10 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold font-headline">Demo User</h2>
            <p className="text-muted-foreground">user@example.com</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="p-4 bg-secondary rounded-lg flex flex-col items-center text-center"
                >
                  {stat.icon}
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
           <CardHeader>
            <CardTitle>Support</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
                <LifeBuoy className="mr-2 h-4 w-4"/>
                Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
