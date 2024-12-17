import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {jwtDecode} from "jwt-decode";
import { fetchMyCompany } from "@/services/CompanyService";
import styles from "../../styles/MyCompany.module.css";
import Header from "@/components/Header";

interface DecodedToken {
  role: string;
  userId: number;
}

interface Company {
  id: number;
  naam: string;
  locatie: string;
  validationInfo: string;
}

const MyCompany = () => {
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false); // Add this flag

  useEffect(() => {
    setIsClient(true); // Ensures rendering happens only after hydration
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const fetchUserCompany = async () => {
      const token = sessionStorage.getItem("token");

      if (!token) {
        setError("You are not logged in. Redirecting...");
        setTimeout(() => router.push("/login"), 3000);
        return;
      }

      try {
        const decoded: DecodedToken = jwtDecode(token);

        if (decoded.role !== "Company") {
          setError("You do not have access to this page. Redirecting...");
          setTimeout(() => router.push("/"), 3000);
          return;
        }

        const companyData = await fetchMyCompany(); // Fetch the user's company
        setCompany(companyData);
      } catch (err) {
        setError("An error occurred while fetching your company.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserCompany();
  }, [isClient, router]);

  if (!isClient) {
    // Avoid rendering mismatched content on the server
    return null;
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (

    
    <div className={styles.myCompanyPage}>
      {company ? (
        <>
        <Header />
          <h1 className={styles.myCompanyTitle}>My Company</h1>
          <div className={styles.myCompanyCard}>
            <p className={styles.myCompanyCardTitle}>Name:</p>
            <p className={styles.myCompanyCardText}>{company.naam}</p>

            <p className={styles.myCompanyCardTitle}>Location:</p>
            <p className={styles.myCompanyCardText}>{company.locatie}</p>

            <p className={styles.myCompanyCardTitle}>Contact Info:</p>
            <p className={styles.myCompanyCardText}>{company.validationInfo}</p>
          </div>
        </>
      ) : (
        <p>No company data available.</p>
      )}
    </div>
  );
};

export default MyCompany;
