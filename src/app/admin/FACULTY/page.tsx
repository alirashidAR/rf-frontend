import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import QuickActions from "@/components/ecommerce/QuickActions";

export const metadata: Metadata = {
  title: "Research Faculty Finder",
  description: "Research Faculty Finder",
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      {/* Full-width metrics */}
      <div className="col-span-1 xl:col-span-12">
        <EcommerceMetrics />
      </div>

      {/* Left column */}
      <div className="col-span-1 xl:col-span-7 flex flex-col gap-6">
        <RecentOrders />
        {/* <StatisticsChart /> */}
        <QuickActions />
      </div>

      {/* Right column */}
      <div className="col-span-1 xl:col-span-5 flex flex-col gap-6">
        <DemographicCard />
        {/* <QuickActions /> */}
      </div>
    </div>
  );
}
