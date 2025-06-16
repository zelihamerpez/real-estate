import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import MapComponent from "../components/mapComponent"; 
import "mapbox-gl/dist/mapbox-gl.css"; 
import React from 'react';
import ShipwreckSearch from "@/components/shipwreckSearch";

export default function Welcome() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const fetchShipwrecks = async () => {

    const lat = 9.3547792; // or dynamically from state
    const lon = -79.9081268; // or dynamically from state
    const n = 5; // number of results
    
    const response = await fetch(`/api/shipwrecks/nearest?lat=${lat}&lon=${lon}&n=${n}`);
    const data = await response.json();
    
    console.log(data);  // check the response
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.replace("/");
      } else {
        setUser(currentUser);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Failed to logout. Try again.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>🎉 WOW you logged in XD 🎉</h1>
      <p>Welcome, {user.email}</p>
      <button
        onClick={handleLogout}
        style={{ marginTop: "20px", padding: "10px 20px" }}
      >
        Logout
      </button>

    <MapComponent />

    <ShipwreckSearch />


    </div>
  );

  
}
