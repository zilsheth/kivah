import { Request, Response } from 'express'
import prisma from '../lib/prisma'

// ─── WORK WINS ───────────────────────────────────────────

export const getWorkWins = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const wins = await prisma.workWin.findMany({
      where: { userId },
      orderBy: { date: 'desc' }
    })
    res.json({ wins })
  } catch (error) {
    console.error('GetWorkWins error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const createWorkWin = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const { title, description, metric, date } = req.body

    if (!title) {
      return res.status(400).json({ message: 'Title is required' })
    }

    const win = await prisma.workWin.create({
      data: {
        title,
        description,
        metric,
        date: date ? new Date(date) : new Date(),
        userId
      }
    })

    res.status(201).json({ win })
  } catch (error) {
    console.error('CreateWorkWin error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const deleteWorkWin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await prisma.workWin.delete({ where: { id: id as string } })
    res.json({ message: 'Win deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

// ─── SKILLS ──────────────────────────────────────────────

export const getSkills = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const skills = await prisma.skill.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })
    res.json({ skills })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const createSkill = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const { name, category, status, notes } = req.body

    if (!name) {
      return res.status(400).json({ message: 'Skill name is required' })
    }

    const skill = await prisma.skill.create({
      data: { name, category, status: status || 'learning', notes, userId }
    })

    res.status(201).json({ skill })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const updateSkill = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { status, notes } = req.body

    const skill = await prisma.skill.update({
      where: { id: id as string },
      data: { status, notes }
    })

    res.json({ skill })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const deleteSkill = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await prisma.skill.delete({ where: { id: id as string } })
    res.json({ message: 'Skill deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

// ─── JOB APPLICATIONS ────────────────────────────────────

export const getApplications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const applications = await prisma.jobApplication.findMany({
      where: { userId },
      orderBy: { appliedDate: 'desc' }
    })
    res.json({ applications })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const createApplication = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const { company, role, status, appliedDate, followUpDate, resumeVersion, notes, jobUrl } = req.body

    if (!company || !role) {
      return res.status(400).json({ message: 'Company and role are required' })
    }

    const application = await prisma.jobApplication.create({
      data: {
        company,
        role,
        status: status || 'applied',
        appliedDate: appliedDate ? new Date(appliedDate) : new Date(),
        followUpDate: followUpDate ? new Date(followUpDate) : null,
        resumeVersion,
        notes,
        jobUrl,
        userId
      }
    })

    res.status(201).json({ application })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const updateApplication = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { status, notes, followUpDate } = req.body

    const application = await prisma.jobApplication.update({
      where: { id: id as string },
      data: {
        status,
        notes,
        followUpDate: followUpDate ? new Date(followUpDate) : undefined
      }
    })

    res.json({ application })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const deleteApplication = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await prisma.jobApplication.delete({ where: { id: id as string } })
    res.json({ message: 'Application deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

// ─── PREP ITEMS ──────────────────────────────────────────

export const getPrepItems = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const items = await prisma.prepItem.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })
    res.json({ items })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const createPrepItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const { type, title, status, notes } = req.body

    if (!type || !title) {
      return res.status(400).json({ message: 'Type and title are required' })
    }

    const item = await prisma.prepItem.create({
      data: { type, title, status: status || 'struggling', notes, userId }
    })

    res.status(201).json({ item })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const updatePrepItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { status, notes } = req.body

    const item = await prisma.prepItem.update({
      where: { id: id as string },
      data: { status, notes }
    })

    res.json({ item })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const deletePrepItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await prisma.prepItem.delete({ where: { id: id as string } })
    res.json({ message: 'Item deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}