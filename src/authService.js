import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./Firebase";

// 🚀 Login Function
export const logIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("🔥 Login Error:", error.message);
    throw error;
  }
};

// 🚀 Signup Function with MongoDB Integration
export const signUp = async (email, password, name, role) => {
  try {
    // 1️⃣ Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const uid = user.uid;

    console.log("✅ Firebase User Created:", uid);

    // 2️⃣ Send User Data to MongoDB
    const response = await fetch(`http://localhost:3001/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid, name, password,email, role }),
    });

    if (!response.ok) throw new Error("Failed to register user in MongoDB");

    console.log("✅ User Registered in MongoDB");

    return user; // Return Firebase user object
  } catch (error) {
    console.error("🔥 Signup Error:", error.message);
    throw error;
  }
};
