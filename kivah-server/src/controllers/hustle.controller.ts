import { Request, Response } from 'express'
import prisma from '../lib/prisma'

// ─── GET ALL HUSTLES ─────────────────────────────────────
export const getHustles = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId

    const hustles = await prisma.hustle.findMany({
  where: { userId },
  include: {
    _count: { select: { tasks: true } }
  },
  orderBy: { createdAt: 'desc' }
})

    res.json({ hustles })
  } catch (error) {
    console.error('GetHustles error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

// ─── CREATE HUSTLE ───────────────────────────────────────
export const createHustle = async (req: Request, res: Response) => {
    console.log('createHustle hit ✅', req.body)
  try {
    const userId = (req as any).userId
    const { title, type, monthlyGoal } = req.body

    if (!title || !type) {
      return res.status(400).json({ message: 'Title and type are required' })
    }

    const hustle = await prisma.hustle.create({
      data: {
        title,
        type,
        monthlyGoal: monthlyGoal ? parseFloat(monthlyGoal) : null,
        userId
      }
    })

    res.status(201).json({ hustle })
  } catch (error) {
    console.error('CreateHustle error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

// ─── UPDATE HUSTLE ───────────────────────────────────────
export const updateHustle = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const { id } = req.params
    const { title, type, monthlyGoal } = req.body

    // Make sure hustle belongs to this user
    const existing = await prisma.hustle.findFirst({
      where: { id: id as string, userId }
    })

    if (!existing) {
      return res.status(404).json({ message: 'Hustle not found' })
    }

    const hustle = await prisma.hustle.update({
      where: { id: id as string },
      data: { title, type, monthlyGoal }
    })

    res.json({ hustle })
  } catch (error) {
    console.error('UpdateHustle error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

// ─── DELETE HUSTLE ───────────────────────────────────────
export const deleteHustle = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const { id } = req.params

    const existing = await prisma.hustle.findFirst({
      where: { id: id as string, userId }
    })

    if (!existing) {
      return res.status(404).json({ message: 'Hustle not found' })
    }

    await prisma.hustle.delete({ where: { id: id as string } })

    res.json({ message: 'Hustle deleted' })
  } catch (error) {
    console.error('DeleteHustle error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}