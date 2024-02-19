"use client";
import { useState } from "react";
import { auth, firestore } from "../util/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

export default function PeoplePage() {
  const [user, loading, error] = useAuthState(auth);
  const [people, setPeople] = useState([
    { name: "John", age: 30, email: "john@example.com" },
    { name: "Jane", age: 25, email: "jane@example.com" },
    { name: "Alice", age: 35, email: "alice@example.com" },
    { name: "Bob", age: 28, email: "bob@example.com" },
  ]);
  const router = useRouter();

  const handleSaveToFirestore = async () => {
    if (!user) {
      router.replace("/sign-in");
      return;
    }

    try {
      const peopleCollectionRef = collection(firestore, "people");
      for (const person of people) {
        await addDoc(peopleCollectionRef, person);
      }
      console.log("People data saved to Firestore");
    } catch (error) {
      console.error("Error saving people data to Firestore:", error);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <ul className="space-y-4">
        {people.map((person, index) => (
          <li key={index} className="border border-gray-300 p-4 rounded-md">
            <p>
              <strong>Name:</strong> {person.name}
            </p>
            <p>
              <strong>Age:</strong> {person.age}
            </p>
            <p>
              <strong>Email:</strong> {person.email}
            </p>
          </li>
        ))}
      </ul>
      <button
        onClick={handleSaveToFirestore}
        className="mt-8 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        Save to Firestore
      </button>
    </div>
  );
}
