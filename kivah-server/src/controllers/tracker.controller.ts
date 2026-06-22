import { Request, Response } from 'express'
import prisma from '../lib/prisma'

// ─── TRACKER FIELDS ──────────────────────────────────────

export const getTrackerFields = async (req: Request, res: Response) => {
  try {
    const { hustleId } = req.params
    const fields = await prisma.trackerField.findMany({
      where: { hustleId: hustleId as string },
      orderBy: { order: 'asc' }
    })
    res.json({ fields })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const createTrackerField = async (req: Request, res: Response) => {
  try {
    const { hustleId } = req.params
    const { name, fieldType, options } = req.body

    if (!name || !fieldType) {
      return res.status(400).json({ message: 'Name and field type are required' })
    }

    // Get current max order
    const lastField = await prisma.trackerField.findFirst({
      where: { hustleId: hustleId as string },
      orderBy: { order: 'desc' }
    })

    const field = await prisma.trackerField.create({
      data: {
        name,
        fieldType,
        options: options || null,
        order: lastField ? lastField.order + 1 : 0,
        hustleId: hustleId as string
      }
    })

    res.status(201).json({ field })
  } catch (error) {
    console.error('createTrackerField error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const deleteTrackerField = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await prisma.trackerField.delete({ where: { id: id as string } })
    res.json({ message: 'Field deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

// ─── TRACKER ENTRIES ─────────────────────────────────────

export const getTrackerEntries = async (req: Request, res: Response) => {
  try {
    const { hustleId } = req.params
    const entries = await prisma.trackerEntry.findMany({
      where: { hustleId: hustleId as string },
      orderBy: { createdAt: 'desc' }
    })
    res.json({ entries })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const createTrackerEntry = async (req: Request, res: Response) => {
  try {
    const { hustleId } = req.params
    const { data, trackerFieldId } = req.body

    const entry = await prisma.trackerEntry.create({
      data: {
        data,
        hustleId: hustleId as string,
        trackerFieldId: trackerFieldId as string
      }
    })

    res.status(201).json({ entry })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const updateTrackerEntry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { data } = req.body

    const entry = await prisma.trackerEntry.update({
      where: { id: id as string },
      data: { data }
    })

    res.json({ entry })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const deleteTrackerEntry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await prisma.trackerEntry.delete({ where: { id: id as string } })
    res.json({ message: 'Entry deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}