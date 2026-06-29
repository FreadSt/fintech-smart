import { DashboardNavClient } from "./DashboardNavClient";
import { MonoStatus } from "./mono/MonoStatus";

export function DashboardNav() {
  return <DashboardNavClient monoStatus={<MonoStatus />} />;
}
