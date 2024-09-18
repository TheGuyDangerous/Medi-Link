import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

interface User {
  id: string
  email: string
  role: string
}

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
      .select()
      .single()

    if (error) throw error

    if (!data) {
      throw new Error('No data returned from insert operation')
    }

    const user: User = {
      id: data.id,
      email: data.email,
      role: data.role
    }

    res.status(201).json({ message: 'User created successfully', user })
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error })
  }
}