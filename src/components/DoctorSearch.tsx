import React, { useState } from 'react';

interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
}

const DoctorSearch: React.FC = () => {
  const [specialization, setSpecialization] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const handleSearch = async () => {
    try {
      const response = await fetch(`/api/doctors/search?specialization=${specialization}`);
      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      }
    } catch (error) {
      console.error('Error searching doctors:', error);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-xl font-semibold mb-2">Find a Doctor</h3>
      <input
        type="text"
        placeholder="Specialization"
        value={specialization}
        onChange={(e) => setSpecialization(e.target.value)}
        className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
      />
      <button
        onClick={handleSearch}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Search
      </button>
      <ul className="mt-4">
        {doctors.map((doctor) => (
          <li key={doctor.id} className="mb-2">
            {doctor.name} - {doctor.specialization}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorSearch;