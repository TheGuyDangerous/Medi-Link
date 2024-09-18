import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userId, fileName, fileUrl } = req.body
    try {
      const { data, error } = await supabase
        .from('medical_records')
        .insert({ user_id: userId, file_name: fileName, file_url: fileUrl })
        .single()

      if (error) throw error
      res.status(201).json(data)
    } catch (error) {
      console.error('Error creating medical record:', error)
      res.status(400).json({ error: 'Error creating medical record' })
    }
  } else if (req.method === 'GET') {
    const { userId } = req.query
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'Invalid userId' })
    }
    try {
      const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .eq('user_id', userId)

      if (error) throw error
      res.status(200).json(data)
    } catch (error) {
      console.error('Error fetching medical records:', error)
      res.status(500).json({ error: 'Error fetching medical records' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}