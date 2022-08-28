import Head from "next/head";
import React from "react";
import { Navbar } from "../Navbar";

interface LayoutProps {
  heading: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, heading }) => {
  return (
    <>
      <Head>
        <title>{`${heading} - Cookknow `} </title>
      </Head>
      <Navbar />
      <div className="mt-60 mb-80">{children}</div>
    </>
  );
};
