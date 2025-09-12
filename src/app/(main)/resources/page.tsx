import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { resources } from "@/lib/data";

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Resource Booking</h1>
        <p className="text-muted-foreground">Book study rooms, labs, and more.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resources.map(resource => (
          <Card key={resource.id}>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>{resource.name}</CardTitle>
                <CardDescription>{resource.location}</CardDescription>
              </div>
               <Badge variant={resource.available ? "default" : "destructive"} className={resource.available ? "bg-emerald-600" : ""}>
                {resource.available ? "Free" : "Busy"}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-muted-foreground">
                <resource.icon className="h-4 w-4" />
                <span>{resource.name.split(' ')[0]}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button disabled={!resource.available} className="w-full">
                Book Slot
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
