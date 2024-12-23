import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

const Mealtimes: React.FC = () => {
  const [mealtime, setMealtime] = useState<string>("");
  const [mealtimes, setMealtimes] = useState<string[]>([]);

  useEffect(() => {
    const fetchMealtimes = async () => {
      const data = await getDocs(collection(db, "mealtimes"));
      setMealtimes(data.docs.map((doc) => doc.data().time));
    };
    fetchMealtimes();
  }, []);

  const addMealtime = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealtime) return;

    try {
      await addDoc(collection(db, "mealtimes"), { time: mealtime });
      setMealtime("");
      alert("Mealtime added!");
    } catch (error) {
      console.error("Error adding mealtime:", error);
    }
  };

  return (
    <div>
      <h2>Set Mealtimes</h2>
      <form onSubmit={addMealtime}>
        <input
          type="time"
          value={mealtime}
          onChange={(e) => setMealtime(e.target.value)}
          required
        />
        <button type="submit">Add Mealtime</button>
      </form>
      <h3>Current Mealtimes</h3>
      <ul>
        {mealtimes.map((time, index) => (
          <li key={index}>{time}</li>
        ))}
      </ul>
    </div>
  );
};

export default Mealtimes;
