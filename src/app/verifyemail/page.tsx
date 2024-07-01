"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const verifyemail = () => {
  const [token, setToken] = useState("");
  const [verifyed, setVerifed] = useState(false);
  const [error, setError] = useState(false);

  const handleVerify = async () => {
    try {
      await axios.post("/api/users/verify", {
        token: token,
      });
      setVerifed(true);
    } catch (error: any) {
      setError(true);
      toast.error(error.response.data.message);
      console.log(error.response.data);
    }
  };

  if (error) {
    return (
      <div>
        <h1>Something went worng while to verify your email</h1>
      </div>
    );
  }

  useEffect(() => {
    const urlTokeb = window.location.search.split("=")[1];
    setToken(urlTokeb || "");
  }, []);

  useEffect(() => {
    if (token.length > 0) {
      handleVerify();
    }
  }, [token]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: "black",
        color: "white",
      }}
    >
      <h1
        style={{
          fontSize: "50px",
          textAlign: "center",
        }}
      >
        Hello world
      </h1>
      <h2
        style={{
          padding: "10px",
          color: "black",
          backgroundColor: "orange",
        }}
      >
        {token ? `Your token is ${token}` : "No token"}
      </h2>
      {verifyed && (
        <div>
          <h1>Your email is verified</h1>
          <Button className="mt-4">
            <Link href={"/login"}>Go to login</Link>
          </Button>
        </div>
      )}
      {error && (
        <div>
          <h1>Error while to verify your email</h1>
        </div>
      )}
    </div>
  );
};

export default verifyemail;
