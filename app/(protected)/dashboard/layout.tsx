import { BarLoader } from "./_components/bar-loader";
import { Suspense } from "react";
import DashboardPage from "./page";

export default function DashboardLayout() {
  return (
    <div className="px-5">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="gradient-title text-6xl font-bold tracking-tight">
          Dashboard
        </h1>
      </div>
      <Suspense fallback={<BarLoader />}>
        <DashboardPage />
      </Suspense>
    </div>
  );
}
