import { Request, Response } from 'express'
import prisma from '../lib/prisma'

export const getIncome = async (req: Request, res: Response) => {
  try {
    const { hustleId } = req.params
    const userId = (req as any).userId

    const incomes = await prisma.income.findMany({
      where: { hustleId: hustleId as string, userId },
      orderBy: { receivedAt: 'desc' }
    })

    // Calculate total
    const total = incomes.reduce((sum: any, i: { amount: any }) => sum + i.amount, 0)

    res.json({ incomes, total })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const createIncome = async (req: Request, res: Response) => {
  try {
    const { hustleId } = req.params
    const userId = (req as any).userId
    const { amount, source, description, paymentMethod, receivedAt } = req.body

    if (!amount || !source) {
      return res.status(400).json({ message: 'Amount and source are required' })
    }

    const income = await prisma.income.create({
      data: {
        amount: parseFloat(amount),
        source,
        description,
        paymentMethod,
        receivedAt: receivedAt ? new Date(receivedAt) : new Date(),
        hustleId: hustleId as string,
        userId
      }
    })

    res.status(201).json({ income })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const deleteIncome = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await prisma.income.delete({ where: { id: id as string } })
    res.json({ message: 'Income deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}