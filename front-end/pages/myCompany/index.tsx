import React from "react";
import Head from "next/head";
import Header from "@/components/Header";

const MyCompanyPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>My Company - ProjectShowcase</title>
        <meta name="description" content="View details about my company" />
      </Head>

      <Header />
    </>
  );
};

export default MyCompanyPage;
