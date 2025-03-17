import React, { useState, useEffect } from "react";
import "@/common/styles/App.css";
import ApplicantFilter from "./ApplicantFilter";

export default function JobApplicants() {
  const [allApplicants, setAllApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    // Retrieve user info from sessionStorage
    const storedUser = sessionStorage.getItem("sso-login");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const recruiterId = user ? user.recruiter_id : null;

    async function fetchApplicants() {
      if (!recruiterId) {
        setError("Recruiter not logged in.");
        setLoading(false);
        return;
      }
      try {
        // Send recruiter_id in the request body to filter applicants
        const response = await fetch("http://localhost:5000/job-applicants", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recruiter_id: recruiterId }),
        });
        if (!response.ok) {
          throw new Error("Error fetching applicants");
        }
        const data = await response.json();
        setAllApplicants(data);
        setFilteredApplicants(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchApplicants();
  }, []);

  // Client-side filtering based on email, talent_id, and job_id
  const handleFilter = ({ email, talent_id, job_id, job_title }) => {
    setCurrentPage(1); // Reset to first page on filter change
    let filtered = allApplicants;

    if (email) {
      filtered = filtered.filter(
        (applicant) =>
          applicant.email &&
          applicant.email.toLowerCase().includes(email.toLowerCase())
      );
    }

    if (talent_id) {
      filtered = filtered.filter((applicant) =>
        String(applicant.talent_id).includes(talent_id)
      );
    }

    if (job_id) {
      filtered = filtered.filter((applicant) =>
        String(applicant.job_id).includes(job_id)
      );
    }

    if (job_title) {
      filtered = filtered.filter(
        (applicant) =>
          applicant.job_title &&
          applicant.job_title.toLowerCase().includes(job_title.toLowerCase())
      );
    }

    setFilteredApplicants(filtered);
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentApplicants = filteredApplicants.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredApplicants.length / itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="job-posts-container">
      <h2>Job Applicants</h2>
      <ApplicantFilter onFilter={handleFilter} />

      <table className="results-table">
        <thead>
          <tr>
            <th>Application ID</th>
            <th>Talent ID</th>
            <th>User ID</th>
            <th>Email</th>
            <th>Job ID</th>
            <th>Job Title</th>
            <th>Recruiter ID</th>
            <th>Status</th>
            <th>Application Date</th>
          </tr>
        </thead>
        <tbody>
          {currentApplicants.map((applicant) => (
            <tr key={applicant.application_id}>
              <td>{applicant.application_id}</td>
              <td>{applicant.talent_id}</td>
              <td>{applicant.user_id}</td>
              <td>{applicant.email}</td>
              <td>{applicant.job_id}</td>
              <td>{applicant.job_title}</td>
              <td>{applicant.recruiter_id}</td>
              <td>{applicant.application_status || "Pending"}</td>
              <td>{new Date(applicant.application_date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span style={{ margin: "0 10px" }}>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}
