import { useEffect, useState } from "react";
import Instructor from "./Component/Instructor";
import Question from "./Component/Question";

const Mainpage = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      window.location.href = "/"; // Redirect if no user found
    } else {
      fetchUserRole(user.uid); // Fetch role from MongoDB
    }
  }, []);

  const fetchUserRole = async (uid) => {
    try {
      const response = await fetch(`http://localhost:3001/api/user/${uid}`);
      const data = await response.json();

      if (data.role) {
        setRole(data.role);
      } else {
        setRole("Unauthorized");
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
      setRole("Unauthorized");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear user data
    window.location.href = "/"; // Redirect to login
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{padding:'10px'}}>
      
      <button onClick={handleLogout}>Logout</button>
      {role === "Student" ? (
        <h1><Question /></h1>
      ) : role === "Instructor" ? (
        <h1><Instructor /></h1>
      ) : (
        <h1>Unauthorized Access</h1>
      )}
    </div>
  );
};

export default Mainpage;
