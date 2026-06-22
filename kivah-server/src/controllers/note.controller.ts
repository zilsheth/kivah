import { Request, Response } from 'express'
import prisma from '../lib/prisma'

export const getNote = async (req: Request, res: Response) => {
  try {
    const { hustleId } = req.params

    const note = await prisma.note.findUnique({
      where: { hustleId: hustleId as string }
    })

    res.json({ note })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const upsertNote = async (req: Request, res: Response) => {
  try {
    const { hustleId } = req.params
    const { content } = req.body

    // upsert = update if exists, create if not
    const note = await prisma.note.upsert({
      where: { hustleId: hustleId as string },
      update: { content },
      create: { content, hustleId: hustleId as string }
    })

    res.json({ note })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}