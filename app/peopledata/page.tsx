"use client";
import { useState, useEffect } from "react";
import { firestore } from "../util/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { FaEdit } from "react-icons/fa";
export default function PeopleDataPage() {
  const [peopleData, setPeopleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const userType = JSON.parse(sessionStorage.getItem("user"))?.userType;
  ////
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, "people"),
      (querySnapshot) => {
        const updatedPeopleData = [];
        querySnapshot.forEach((doc) => {
          updatedPeopleData.push({ id: doc.id, ...doc.data() });
        });
        setPeopleData(updatedPeopleData);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);
  /////

  useEffect(() => {
    const fetchPeopleData = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "people"));
        const fetchedData = [];
        querySnapshot.forEach((doc) => {
          fetchedData.push({ id: doc.id, ...doc.data() });
        });
        setPeopleData(fetchedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching people data:", error);
        setLoading(false);
      }
    };
    fetchPeopleData();
  }, []);

  const handleEdit = (person) => {
    const updatedPeopleData = peopleData.map((p) => {
      if (p.id === person.id) {
        return { ...p, isEditing: true };
      } else {
        return p;
      }
    });
    setPeopleData(updatedPeopleData);
  };
  const handleSave = async (person) => {
    try {
      await updateDoc(doc(firestore, "people", person.id), {
        name: person.name,
        age: person.age,
        email: person.email,
      });
      const updatedPeopleData = peopleData.map((p) => {
        if (p.id === person.id) {
          return { ...p, isEditing: false };
        } else {
          return p;
        }
      });
      setPeopleData(updatedPeopleData);
    } catch (error) {
      console.error("Error updating person data:", error);
    }
  };
  const handleCancel = (person) => {
    const updatedPeopleData = peopleData.map((p) => {
      if (p.id === person.id) {
        return { ...p, isEditing: false };
      } else {
        return p;
      }
    });
    setPeopleData(updatedPeopleData);
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="">
      <h1 className="text-3xl font-semibold mb-8">People Data</h1>
      <ul className="space-y-4">
        {peopleData.map((person, index) => (
          <li
            key={index}
            className="border border-gray-300 p-4 rounded-md flex items-center justify-between"
          >
            {person.isEditing ? (
              <div className="flex justify-between w-full">
                <div>
                  <input
                    type="text"
                    value={person.name}
                    onChange={(e) => {
                      const updatedPeopleData = [...peopleData];
                      updatedPeopleData[index].name = e.target.value;
                      setPeopleData(updatedPeopleData);
                    }}
                  />
                  <input
                    type="number"
                    value={person.age}
                    onChange={(e) => {
                      const updatedPeopleData = [...peopleData];
                      updatedPeopleData[index].age = parseInt(e.target.value);
                      setPeopleData(updatedPeopleData);
                    }}
                  />
                  <input
                    type="email"
                    value={person.email}
                    onChange={(e) => {
                      const updatedPeopleData = [...peopleData];
                      updatedPeopleData[index].email = e.target.value;
                      setPeopleData(updatedPeopleData);
                    }}
                  />
                </div>
                <div className="flex flex-col ">
                  <button
                    className="p-3 bg-blue-500 text-white"
                    onClick={() => handleSave(person)}
                  >
                    Save
                  </button>
                  <button
                    className="p-3 bg-red-500 text-white"
                    onClick={() => handleCancel(person)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between w-full">
                <div>
                  <p>
                    <strong>Name:</strong> {person.name}
                  </p>
                  <p>
                    <strong>Age:</strong> {person.age}
                  </p>
                  <p>
                    <strong>Email:</strong> {person.email}
                  </p>
                </div>
                {userType === "Admin" && (
                  <button
                    className="p-3 bg-green-600 text-white"
                    onClick={() => handleEdit(person)}
                  >
                    <FaEdit />
                  </button>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
