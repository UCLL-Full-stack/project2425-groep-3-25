
import React from "react";
import Head from "next/head";
import Header from "@/components/Header";


const EmployeesPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Employees - ProjectShowcase</title>
        <meta name="description" content="List of employees" />
      </Head>

        <Header />
    </>
  );
};

export default EmployeesPage;
