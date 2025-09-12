import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profile</h1>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="https://picsum.photos/seed/payal/100/100" alt="Payal" />
              <AvatarFallback>P</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">Payal</CardTitle>
              <CardDescription>Student ID: 12345</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p>This is a placeholder for the user profile page.</p>
        </CardContent>
      </Card>
    </div>
  );
}
