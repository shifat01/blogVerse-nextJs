'use client'

import BlogList from "@/Components/BlogList";
import Footer from "@/Components/Footer";
import Header from "@/Components/Header"
import { ToastContainer } from "react-toastify";
import { useState } from "react";

export default function Home() {

  const [search, setSearch] = useState('');
  
  return (
    <>
      <ToastContainer theme="dark"/>
      <Header search={search} setSearch={setSearch} />
      <BlogList search={search} />
      <Footer/>
    </>
  );
}
