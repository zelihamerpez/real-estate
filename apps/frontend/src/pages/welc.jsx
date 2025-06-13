import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../firebase"; // adjust the path if needed
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Welcome() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        // Redirect to home page if NOT logged in
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
      router.push("/"); // redirect to home after logout
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
      <button onClick={handleLogout} style={{ marginTop: "20px", padding: "10px 20px" }}>
        Logout
      </button>
    </div>
  );
}
