import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { specialization } = req.query
    try {
      const doctors = await prisma.user.findMany({
        where: {
          role: 'doctor',
          specialization: specialization as string,
        },
        select: {
          id: true,
          name: true,
          email: true,
          specialization: true,
        },
      })
      res.status(200).json(doctors)
    } catch (error) {
      console.error('Error searching doctors:', error)
      res.status(500).json({ error: 'Error searching doctors' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}