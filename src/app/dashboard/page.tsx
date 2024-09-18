'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '@/lib/firebase';
import { supabase } from '@/lib/supabase';
import CreateAppointment from '@/components/CreateAppointment';
import CreatePrescription from '@/components/CreatePrescription';
import FamilyMemberManagement from '@/components/FamilyMemberManagement';
import DoctorSearch from '@/components/DoctorSearch';
import AppointmentReminders from '@/components/AppointmentReminders';
import MedicalRecordsManagement from '@/components/MedicalRecordsManagement';

interface Appointment {
  id: string;
  dateTime: string;
  doctorId: string;
  patientId: string;
  status: string;
}

interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  instructions: string;
  date: string;
}

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
        })
        fetchUserData(currentUser.uid)
      } else {
        router.push('/login')
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchUserData = async (userId: string) => {
    setLoading(true)
    setError(null)
    try {
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*')
        .or(`patient_id.eq.${userId},doctor_id.eq.${userId}`)

      if (appointmentsError) throw appointmentsError
      setAppointments(appointmentsData)

      const { data: prescriptionsData, error: prescriptionsError } = await supabase
        .from('prescriptions')
        .select('*')
        .or(`patient_id.eq.${userId},doctor_id.eq.${userId}`)

      if (prescriptionsError) throw prescriptionsError
      setPrescriptions(prescriptionsData)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      setError(`Failed to fetch user data: ${errorMessage}`)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!user) {
    return <div>No user found. Please log in.</div>
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-3xl font-bold mb-8">Welcome to your Dashboard</h1>
      <p>You are logged in as: {user.email}</p>
      <p>Your role is: {user.displayName}</p>
      
      {user.displayName === 'patient' && (
        <div>
          <h2 className="text-2xl font-bold mt-4">Patient Dashboard</h2>
          <h3 className="text-xl font-semibold mt-2">Your Appointments</h3>
          {appointments.map(appointment => (
            <div key={appointment.id} className="border p-2 my-2">
              <p>Date: {new Date(appointment.dateTime).toLocaleString()}</p>
              <p>Doctor ID: {appointment.doctorId}</p>
              <p>Status: {appointment.status}</p>
            </div>
          ))}
          <h3 className="text-xl font-semibold mt-2">Your Prescriptions</h3>
          {prescriptions.map(prescription => (
            <div key={prescription.id} className="border p-2 my-2">
              <p>Medication: {prescription.medication}</p>
              <p>Dosage: {prescription.dosage}</p>
              <p>Instructions: {prescription.instructions}</p>
              <p>Date: {new Date(prescription.date).toLocaleDateString()}</p>
            </div>
          ))}
          <CreateAppointment userId={user.uid} userRole="patient" />
          <FamilyMemberManagement userId={user.uid} />
          <DoctorSearch />
          <AppointmentReminders appointments={appointments} />
          <MedicalRecordsManagement userId={user.uid} />
        </div>
      )}
      
      {user.displayName === 'medical_staff' && (
        <div>
          <h2 className="text-2xl font-bold mt-4">Medical Staff Dashboard</h2>
          <CreateAppointment userId={user.uid} userRole="medical_staff" />
        </div>
      )}
      
      {user.displayName === 'doctor' && (
        <div>
          <h2 className="text-2xl font-bold mt-4">Doctor Dashboard</h2>
          <h3 className="text-xl font-semibold mt-2">Upcoming Appointments</h3>
          {appointments.map(appointment => (
            <div key={appointment.id} className="border p-2 my-2">
              <p>Date: {new Date(appointment.dateTime).toLocaleString()}</p>
              <p>Patient ID: {appointment.patientId}</p>
              <p>Status: {appointment.status}</p>
            </div>
          ))}
          <CreateAppointment userId={user.uid} userRole="doctor" />
          <CreatePrescription doctorId={user.uid} />
          <AppointmentReminders appointments={appointments} />
        </div>
      )}
    </div>
  )
}