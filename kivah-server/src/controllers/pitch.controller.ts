import { Request, Response } from 'express'
import prisma from '../lib/prisma'

// ─── GET PITCHES FOR A HUSTLE ────────────────────────────
export const getPitches = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const { hustleId } = req.params

    const pitches = await prisma.pitch.findMany({
      where: { hustleId: hustleId as string, userId },
      orderBy: { createdAt: 'desc' }
    })

    res.json({ pitches })
  } catch (error) {
    console.error('GetPitches error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

// ─── CREATE PITCH ────────────────────────────────────────
export const createPitch = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const { hustleId } = req.params
    const { brandName, status, rate, deliverable, notes } = req.body

    if (!brandName) {
      return res.status(400).json({ message: 'Brand name is required' })
    }

    const pitch = await prisma.pitch.create({
      data: {
        brandName,
        status: status || 'draft',
        rate: rate ? parseFloat(rate) : null,
        deliverable,
        notes,
        hustleId: hustleId as string,
        userId
      }
    })

    res.status(201).json({ pitch })
  } catch (error) {
    console.error('CreatePitch error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

// ─── UPDATE PITCH STATUS ─────────────────────────────────
export const updatePitch = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const { id } = req.params
    const { brandName, status, rate, deliverable, notes } = req.body

    const existing = await prisma.pitch.findFirst({
      where: { id: id as string, userId }
    })

    if (!existing) {
      return res.status(404).json({ message: 'Pitch not found' })
    }

    const pitch = await prisma.pitch.update({
      where: { id: id as string },
      data: { brandName, status, rate, deliverable, notes }
    })

    res.json({ pitch })
  } catch (error) {
    console.error('UpdatePitch error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

// ─── DELETE PITCH ────────────────────────────────────────
export const deletePitch = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const { id } = req.params

    const existing = await prisma.pitch.findFirst({
      where: { id: id as string, userId }
    })

    if (!existing) {
      return res.status(404).json({ message: 'Pitch not found' })
    }

    await prisma.pitch.delete({ where: { id: id as string } })

    res.json({ message: 'Pitch deleted' })
  } catch (error) {
    console.error('DeletePitch error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}