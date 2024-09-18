import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, relation, userId } = req.body
    try {
      const familyMember = await prisma.familyMember.create({
        data: { name, relation, userId }
      })
      res.status(201).json(familyMember)
    } catch (error) {
      console.error('Error creating family member:', error)
      res.status(400).json({ error: 'Error creating family member' })
    }
  } else if (req.method === 'GET') {
    const { userId } = req.query
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'Invalid userId' })
    }
    try {
      const familyMembers = await prisma.familyMember.findMany({
        where: { userId }
      })
      res.status(200).json(familyMembers)
    } catch (error) {
      console.error('Error fetching family members:', error)
      res.status(500).json({ error: 'Error fetching family members' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}