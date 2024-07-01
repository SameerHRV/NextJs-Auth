"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const profilePage = () => {
  const router = useRouter();
  const [data, setData] = useState("nothing");

  const getUserDetails = async () => {
    const response = await axios.post("/api/users/me");
    console.log("response", response.data.data._id);
    setData(response.data._id);
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/users/logout");
      router.push("/login");
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <h1
        style={{
          padding: "10px",
          color: "black",
          backgroundColor: "orange",
        }}
      >
        profile page
      </h1>
      <h2>{data === "nothing" ? "Data Is Nothing" : <Link href={`/profile/${data}`}>{`${data}`}</Link>}</h2>
      <Button onClick={handleLogout}>
        <Link href="/login">Logout</Link>
      </Button>
      <Button onClick={getUserDetails} variant={"outline"} className="mt-4">
        User Details
      </Button>
    </div>
  );
};

export default profilePage;
