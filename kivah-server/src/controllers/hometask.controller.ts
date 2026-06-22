import { Request, Response } from 'express'
import prisma from '../lib/prisma'

export const getHomeTasks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const tasks = await prisma.homeTask.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })
    res.json({ tasks })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const createHomeTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const { title, dueDate } = req.body

    if (!title) {
      return res.status(400).json({ message: 'Title is required' })
    }

    const task = await prisma.homeTask.create({
      data: {
        title,
        dueDate: dueDate ? new Date(dueDate) : null,
        userId
      }
    })

    res.status(201).json({ task })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const toggleHomeTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const existing = await prisma.homeTask.findUnique({ where: { id: id as string } })

    if (!existing) {
      return res.status(404).json({ message: 'Task not found' })
    }

    const task = await prisma.homeTask.update({
      where: { id: id as string },
      data: { completed: !existing.completed }
    })

    res.json({ task })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const deleteHomeTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await prisma.homeTask.delete({ where: { id: id as string } })
    res.json({ message: 'Task deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}