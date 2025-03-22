import React, { useEffect, useState } from "react";
import { auth } from "firebase";

const Dashboard = () => {
  const [message, setMessage] = useState("");
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const response = await fetch(`${API_URL}/protected`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchProtectedData();
  }, []);

  return <h2>{message}</h2>;
};

export default Dashboard;
