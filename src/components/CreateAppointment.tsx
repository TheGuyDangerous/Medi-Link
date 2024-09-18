import React, { useState } from 'react';

interface CreateAppointmentProps {
  userId: string;
  userRole: string;
}

const CreateAppointment: React.FC<CreateAppointmentProps> = ({ userId, userRole }) => {
  const [doctorId, setDoctorId] = useState('');
  const [patientId, setPatientId] = useState('');
  const [dateTime, setDateTime] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const appointmentData = {
      doctorId: userRole === 'doctor' ? userId : doctorId,
      patientId: userRole === 'patient' ? userId : patientId,
      dateTime: new Date(dateTime).toISOString(),
    };

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData),
      });

      if (response.ok) {
        alert('Appointment created successfully');
        // Reset form or update UI as needed
      } else {
        alert('Failed to create appointment');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('An error occurred while creating the appointment');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <h3 className="text-xl font-semibold mb-2">Create Appointment</h3>
      {userRole !== 'doctor' && (
        <input
          type="text"
          placeholder="Doctor ID"
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        />
      )}
      {userRole !== 'patient' && (
        <input
          type="text"
          placeholder="Patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        />
      )}
      <div className="mb-3">
        <label htmlFor="appointmentDateTime" className="block text-sm font-medium text-gray-700 mb-1">
          Appointment Date and Time
        </label>
        <input
          id="appointmentDateTime"
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Create Appointment
      </button>
    </form>
  );
};

export default CreateAppointment;