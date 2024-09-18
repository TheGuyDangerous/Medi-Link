import React, { useState } from 'react';

interface CreatePrescriptionProps {
  doctorId: string;
}

const CreatePrescription: React.FC<CreatePrescriptionProps> = ({ doctorId }) => {
  const [patientId, setPatientId] = useState('');
  const [medication, setMedication] = useState('');
  const [dosage, setDosage] = useState('');
  const [instructions, setInstructions] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const prescriptionData = {
      doctorId,
      patientId,
      medication,
      dosage,
      instructions,
    };

    try {
      const response = await fetch('/api/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prescriptionData),
      });

      if (response.ok) {
        alert('Prescription created successfully');
        // Reset form or update UI as needed
      } else {
        alert('Failed to create prescription');
      }
    } catch (error) {
      console.error('Error creating prescription:', error);
      alert('An error occurred while creating the prescription');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <h3 className="text-xl font-semibold mb-2">Create Prescription</h3>
      <input
        type="text"
        placeholder="Patient ID"
        value={patientId}
        onChange={(e) => setPatientId(e.target.value)}
        className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
      />
      <input
        type="text"
        placeholder="Medication"
        value={medication}
        onChange={(e) => setMedication(e.target.value)}
        className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
      />
      <input
        type="text"
        placeholder="Dosage"
        value={dosage}
        onChange={(e) => setDosage(e.target.value)}
        className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
      />
      <textarea
        placeholder="Instructions"
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
      />
      <button
        type="submit"
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Create Prescription
      </button>
    </form>
  );
};

export default CreatePrescription;