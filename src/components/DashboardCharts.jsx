// src/components/DashboardCharts.jsx
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FlexBox } from "@/common/components/flexbox";
import { PageLayout } from "@/common/components/layouts";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AIbaseUrl = `${import.meta.env.VITE_SCOUTJAR_AI_BASE_URL}`;

export default function DashboardCharts() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${AIbaseUrl}/dashboard`)
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error("Error fetching dashboard data:", err));
  }, []);

  if (!data) {
    return (
      <PageLayout title="Dashboard">
        <FlexBox className="p-4">Loading dashboard...</FlexBox>
      </PageLayout>
    );
  }

  const jobs = data.jobs_table || [];
  const apps = data.apps_table || [];

  const jobsByRecruiter = jobs.reduce((acc, job) => {
    acc[job.recruiter_id] = (acc[job.recruiter_id] || 0) + 1;
    return acc;
  }, {});

  const jobsChart = {
    labels: Object.keys(jobsByRecruiter),
    datasets: [
      {
        label: "Jobs Posted",
        data: Object.values(jobsByRecruiter),
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  };

  const appsChart = {
    labels: apps.map((a) => a.job_title),
    datasets: [
      {
        label: "Applicants",
        data: apps.map((a) => a.applicant_count),
        backgroundColor: "rgba(153,102,255,0.6)",
      },
    ],
  };

  return (
    <PageLayout title="Dashboard">
      <FlexBox className="flex-col gap-6 p-4 w-full">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-2">Jobs Posted by Recruiter</h2>
          <Bar data={jobsChart} />
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-2">Applicants per Job</h2>
          <Bar data={appsChart} />
        </div>
      </FlexBox>
    </PageLayout>
  );
}
