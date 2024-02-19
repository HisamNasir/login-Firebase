"use client";
import { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, firestore } from "../util/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAuth, getIdTokenResult } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      const res = await signInWithEmailAndPassword(email, password);
      console.log({ res });

      const userDocRef = doc(firestore, "users", email);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const userType = userData?.type || "Viewer";
        console.log("User type:", userType);
        sessionStorage.setItem("user", JSON.stringify({ email, userType }));
      } else {
        console.error("User document not found in Firestore");
      }

      setEmail("");
      setPassword("");
      router.push("/");
    } catch (e) {
      console.error(e);
      setError("Wrong email or password");
    }
  };

  return (
    <div className="">
      <div className="bg-gray-800 p-5 md:p-10 rounded-lg shadow-xl w-96">
        <h1 className="text-white text-2xl mb-4">Sign In</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <Link className="w-full text-white" href={"/sign-up"}>
          {" "}
          Create Account
        </Link>
        <button
          onClick={handleSignIn}
          className="w-full p-3 mt-4 bg-indigo-600 rounded text-white hover:bg-indigo-500"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default SignIn;
