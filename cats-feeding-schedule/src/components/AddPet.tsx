import React, { useState } from "react";
import { db } from "../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";

const AddPet: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<number | "">("");
  const [type, setType] = useState<string>("Cat");
  const [notes, setNotes] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !type) return alert("Please fill out all required fields!");

    try {
      await addDoc(collection(db, "pets"), { name, age, type, notes });
      alert("Pet added successfully!");
      setName("");
      setAge("");
      setType("Cat");
      setNotes("");
    } catch (error) {
      console.error("Error adding pet:", error);
      alert("Failed to add pet!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add a Pet</h2>
      <input
        type="text"
        placeholder="Pet's Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(Number(e.target.value))}
      />
      <select value={type} onChange={(e) => setType(e.target.value)} required>
        <option value="Cat">Cat</option>
        <option value="Dog">Dog</option>
        <option value="Bird">Bird</option>
        <option value="Other">Other</option>
      </select>
      <textarea
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <button type="submit">Add Pet</button>
    </form>
  );
};

export default AddPet;
