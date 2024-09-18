import React, { useEffect, useState } from 'react';

interface Appointment {
  id: string;
  dateTime: string;
  doctorId: string;
  patientId: string;
  status: string;
}

interface AppointmentRemindersProps {
  appointments: Appointment[];
}

const AppointmentReminders: React.FC<AppointmentRemindersProps> = ({ appointments }) => {
  const [reminders, setReminders] = useState<Appointment[]>([]);

  useEffect(() => {
    const upcomingAppointments = appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.dateTime);
      const now = new Date();
      const timeDiff = appointmentDate.getTime() - now.getTime();
      const daysDiff = timeDiff / (1000 * 3600 * 24);
      return daysDiff <= 3 && daysDiff > 0;
    });
    setReminders(upcomingAppointments);
  }, [appointments]);

  return (
    <div className="mt-4">
      <h3 className="text-xl font-semibold mb-2">Upcoming Appointment Reminders</h3>
      {reminders.length > 0 ? (
        <ul>
          {reminders.map((reminder) => (
            <li key={reminder.id} className="mb-2">
              Appointment on {new Date(reminder.dateTime).toLocaleString()}
            </li>
          ))}
        </ul>
      ) : (
        <p>No upcoming appointments in the next 3 days.</p>
      )}
    </div>
  );
};

export default AppointmentReminders;