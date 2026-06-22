import { Request, Response } from 'express'
import prisma from '../lib/prisma'

// ─── FAMILY MEMBERS ──────────────────────────────────────

export const getFamilyMembers = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const members = await prisma.familyMember.findMany({
      where: { userId },
      include: { _count: { select: { wellnessLogs: true, finances: true } } },
      orderBy: { createdAt: 'asc' }
    })
    res.json({ members })
  } catch (error) {
    console.error('GetFamilyMembers error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const createFamilyMember = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const { name, relationship, dateOfBirth, notes } = req.body

    if (!name || !relationship) {
      return res.status(400).json({ message: 'Name and relationship are required' })
    }

    const member = await prisma.familyMember.create({
      data: {
        name,
        relationship,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        notes,
        userId
      }
    })

    res.status(201).json({ member })
  } catch (error) {
    console.error('CreateFamilyMember error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const deleteFamilyMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await prisma.familyMember.delete({ where: { id: id as string } })
    res.json({ message: 'Member removed' })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

// ─── WELLNESS LOGS ───────────────────────────────────────

export const getWellnessLogs = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const { familyMemberId } = req.query

    const logs = await prisma.wellnessLog.findMany({
      where: {
        userId,
        ...(familyMemberId ? { familyMemberId: familyMemberId as string } : {})
      },
      orderBy: { date: 'desc' }
    })

    res.json({ logs })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const createWellnessLog = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const { familyMemberId, mood, note, date } = req.body

    if (!familyMemberId) {
      return res.status(400).json({ message: 'Family member is required' })
    }

    const log = await prisma.wellnessLog.create({
      data: {
        familyMemberId,
        mood,
        note,
        date: date ? new Date(date) : new Date(),
        userId
      }
    })

    res.status(201).json({ log })
  } catch (error) {
    console.error('CreateWellnessLog error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const deleteWellnessLog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await prisma.wellnessLog.delete({ where: { id: id as string } })
    res.json({ message: 'Log deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

// ─── FAMILY FINANCES ─────────────────────────────────────

export const getFinances = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId

    const finances = await prisma.familyFinance.findMany({
      where: { userId },
      include: { familyMember: { select: { name: true } } },
      orderBy: { date: 'desc' }
    })

    const totalIncome = finances
      .filter(f => f.type === 'income')
      .reduce((sum, f) => sum + f.amount, 0)
    const totalExpense = finances
      .filter(f => f.type === 'expense')
      .reduce((sum, f) => sum + f.amount, 0)

    res.json({ finances, totalIncome, totalExpense, balance: totalIncome - totalExpense })
  } catch (error) {
    console.error('GetFinances error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const createFinance = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const { type, amount, category, description, familyMemberId, date } = req.body

    if (!type || !amount) {
      return res.status(400).json({ message: 'Type and amount are required' })
    }

    const finance = await prisma.familyFinance.create({
      data: {
        type,
        amount: parseFloat(amount),
        category,
        description,
        familyMemberId: familyMemberId || null,
        date: date ? new Date(date) : new Date(),
        userId
      }
    })

    res.status(201).json({ finance })
  } catch (error) {
    console.error('CreateFinance error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const deleteFinance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await prisma.familyFinance.delete({ where: { id: id as string } })
    res.json({ message: 'Finance entry deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

// ─── FAMILY PLANS ────────────────────────────────────────

export const getFamilyPlans = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const plans = await prisma.familyPlan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })
    res.json({ plans })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const createFamilyPlan = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const { title, dueDate } = req.body

    if (!title) {
      return res.status(400).json({ message: 'Title is required' })
    }

    const plan = await prisma.familyPlan.create({
      data: {
        title,
        dueDate: dueDate ? new Date(dueDate) : null,
        userId
      }
    })

    res.status(201).json({ plan })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const togglePlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const existing = await prisma.familyPlan.findUnique({ where: { id: id as string } })

    if (!existing) {
      return res.status(404).json({ message: 'Plan not found' })
    }

    const plan = await prisma.familyPlan.update({
      where: { id: id as string },
      data: { completed: !existing.completed }
    })

    res.json({ plan })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const deletePlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await prisma.familyPlan.delete({ where: { id: id as string } })
    res.json({ message: 'Plan deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}