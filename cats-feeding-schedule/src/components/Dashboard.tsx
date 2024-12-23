import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

interface Pet {
  id: string;
  name: string;
  type: string;
  age: number;
  notes: string;
}

const Dashboard: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [mealtimes, setMealtimes] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const petsData = await getDocs(collection(db, "pets"));
      const mealtimesData = await getDocs(collection(db, "mealtimes"));

      setPets(petsData.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Pet[]);
      setMealtimes(mealtimesData.docs.map((doc) => doc.data().time));
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Feeding Dashboard</h2>
      <table>
        <thead>
          <tr>
            <th>Pet</th>
            <th>Type</th>
            {mealtimes.map((time, index) => (
              <th key={index}>{time}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pets.map((pet) => (
            <tr key={pet.id}>
              <td>{pet.name}</td>
              <td>{pet.type}</td>
              {mealtimes.map((time, index) => (
                <td key={index}>
                  <input type="checkbox" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
