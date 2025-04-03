import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import QuickActions from "@/components/ecommerce/QuickActions";

export const metadata: Metadata = {
  title:
    "Research Faculty Finder",
  description: "Research Faculty Finder",
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6">
        fac
        <EcommerceMetrics />

        {/* <MonthlySalesChart /> */}
      </div>

      <div className="col-span-12 xl:col-span-7">
        <RecentOrders />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div>


      <div className="col-span-12 xl:col-span-7">
        <StatisticsChart />

      </div>

      <div className="col-span-12 xl:col-span-5">
        <QuickActions />
      </div>

      

      
    </div>
  );
}
