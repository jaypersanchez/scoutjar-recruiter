import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale
} from "chart.js";

ChartJS.register(BarElement, ArcElement, CategoryScale, LinearScale);

export default function DashboardAnalytics() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/dashboard`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setJobs(data.jobs_table || []);
        setApplications(data.apps_table || []);
      } catch (err) {
        console.error("❌ Failed to fetch dashboard data:", err);
      }
    };

    loadDashboardData();
  }, []);

  const jobsByLocation = () => {
    const grouped = jobs.reduce((acc, job) => {
      acc[job.location] = (acc[job.location] || 0) + 1;
      return acc;
    }, {});
    return {
      labels: Object.keys(grouped),
      datasets: [
        {
          label: "Jobs Posted",
          data: Object.values(grouped),
          backgroundColor: "rgba(75,192,192,0.6)"
        }
      ]
    };
  };

  const applicantsPerJob = () => {
    return {
      labels: applications.map((a) => a.job_title),
      datasets: [
        {
          label: "Applications",
          data: applications.map((a) => a.applicant_count),
          backgroundColor: "rgba(255,99,132,0.6)"
        }
      ]
    };
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "16px",
        width: "100%"
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "16px",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          backgroundColor: "#f9fafb"
        }}
      >
        <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "12px" }}>
          Jobs by Location
        </h2>
        <Bar data={jobsByLocation()} />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "16px",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          backgroundColor: "#f9fafb"
        }}
      >
        <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "12px" }}>
          Applicants per Job
        </h2>
        <Pie data={applicantsPerJob()} />
      </div>
    </div>
  );
}
