import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { patientId, doctorId, dateTime } = req.body
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert({ patient_id: patientId, doctor_id: doctorId, date_time: dateTime })
        .single()

      if (error) throw error
      res.status(201).json(data)
    } catch (error) {
      console.error('Error creating appointment:', error)
      res.status(400).json({ error: 'Error creating appointment' })
    }
  } else if (req.method === 'GET') {
    const { userId } = req.query
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'Invalid userId' })
    }
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .or(`patient_id.eq.${userId},doctor_id.eq.${userId}`)

      if (error) throw error
      res.status(200).json(data)
    } catch (error) {
      console.error('Error fetching appointments:', error)
      res.status(500).json({ error: 'Error fetching appointments' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}