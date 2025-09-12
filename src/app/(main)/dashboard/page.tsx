import { Greeting } from "@/components/dashboard/greeting";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { SnapshotCards } from "@/components/dashboard/snapshot-cards";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <Greeting />
      <QuickActions />
      <SnapshotCards />
    </div>
  );
}
