import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { email, password, role } = req.body

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const { data, error } = await supabase
      .from('users')
      .insert({ email, password: hashedPassword, role })
      .single()

    if (error) throw error

    res.status(201).json({ message: 'User created successfully', user: { id: data.id, email: data.email, role: data.role } })
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error })
  }
}