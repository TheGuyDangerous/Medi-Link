import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { patientId, doctorId, medication, dosage, instructions } = req.body
    try {
      const { data, error } = await supabase
        .from('prescriptions')
        .insert({ patient_id: patientId, doctor_id: doctorId, medication, dosage, instructions })
        .single()

      if (error) throw error
      res.status(201).json(data)
    } catch (error) {
      console.error('Error creating prescription:', error)
      res.status(400).json({ error: 'Error creating prescription' })
    }
  } else if (req.method === 'GET') {
    const { userId } = req.query
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'Invalid userId' })
    }
    try {
      const { data, error } = await supabase
        .from('prescriptions')
        .select('*')
        .or(`patient_id.eq.${userId},doctor_id.eq.${userId}`)

      if (error) throw error
      res.status(200).json(data)
    } catch (error) {
      console.error('Error fetching prescriptions:', error)
      res.status(500).json({ error: 'Error fetching prescriptions' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}