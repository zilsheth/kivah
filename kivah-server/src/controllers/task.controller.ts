import { Request, Response } from 'express'
import prisma from '../lib/prisma'

export const getTasks = async (req: Request, res: Response) => {
  try {
    const { hustleId } = req.params
    const userId = (req as any).userId

    const tasks = await prisma.task.findMany({
      where: { hustleId: hustleId as string, userId },
      orderBy: { createdAt: 'desc' }
    })

    res.json({ tasks })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const createTask = async (req: Request, res: Response) => {
  try {
    const { hustleId } = req.params
    const userId = (req as any).userId
    const { title, dueDate } = req.body

    if (!title) {
      return res.status(400).json({ message: 'Title is required' })
    }

    const task = await prisma.task.create({
      data: {
        title,
        dueDate: dueDate ? new Date(dueDate) : null,
        hustleId: hustleId as string,
        userId
      }
    })

    res.status(201).json({ task })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const toggleTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const existing = await prisma.task.findUnique({
      where: { id: id as string }
    })

    if (!existing) {
      return res.status(404).json({ message: 'Task not found' })
    }

    const task = await prisma.task.update({
      where: { id: id as string },
      data: { completed: !existing.completed }
    })

    res.json({ task })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await prisma.task.delete({ where: { id: id as string } })
    res.json({ message: 'Task deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}