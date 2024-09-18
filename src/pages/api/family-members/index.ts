import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { method } = req

	switch (method) {
		case 'GET':
			try {
				const { userId } = req.query
				const { data, error } = await supabase
					.from('family_members')
					.select('*')
					.eq('user_id', userId)

				if (error) throw error

				res.status(200).json(data)
			} catch (error) {
				console.error('Error fetching family members:', error);
				res.status(400).json({ error: 'Error fetching family members' });
			}
			break

		case 'POST':
			try {
				const { userId, name, relationship } = req.body
				const { data, error } = await supabase
					.from('family_members')
					.insert({ user_id: userId, name, relationship })
					.select()
					.single()

				if (error) throw error

				res.status(201).json(data)
			} catch (error) {
				console.error('Error creating family member:', error);
				res.status(400).json({ error: 'Error creating family member' })
			}
			break

		default:
			res.setHeader('Allow', ['GET', 'POST'])
			res.status(405).end(`Method ${method} Not Allowed`)
	}
}