"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "./util/firebase";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import PeoplePage from "./people/page";
import PageSwitcher from "./ui/PageSwitcher";
import PeopleDataPage from "./peopledata/page";

export default function Home() {
  const [user, loading, error] = useAuthState(auth);
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("");
  const router = useRouter();
  const userSession = sessionStorage.getItem("user");
  if (!user && !userSession) {
    router.push("/sign-in");
  }

  useEffect(() => {
    if (user) {
      const getUserData = async () => {
        try {
          const userDocRef = doc(firestore, "users", user.email);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUserName(userData.name);
            setUserType(userData.type || "Viewer");
          }
        } catch (error) {
          console.error("Error getting user data:", error);
        }
      };
      getUserData();
    }
  }, [user]);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        sessionStorage.removeItem("user");
        router.replace("/sign-in");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  if (loading) {
    return (
      <div className="flex bg-white bg-opacity-45 min-h-screen flex-col items-center justify-center p-24">
        Loading...
      </div>
    );
  }

  return (
    <main className="p-4">
      <p>Welcome, {userName || "User"}</p>
      <p>User Type: {userType}</p>
      <p>
        <PeopleDataPage />
      </p>
      <button
        className="mt-4 bg-red-500 text-white p-2 w-full rounded-lg"
        onClick={handleSignOut}
      >
        Log out
      </button>
    </main>
  );
}
