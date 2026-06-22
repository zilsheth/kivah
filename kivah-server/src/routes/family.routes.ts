import { Router } from 'express'
import {
  getFamilyMembers, createFamilyMember, deleteFamilyMember,
  getWellnessLogs, createWellnessLog, deleteWellnessLog,
  getFinances, createFinance, deleteFinance,
  getFamilyPlans, createFamilyPlan, togglePlan, deletePlan
} from '../controllers/family.controller'
import { protect } from '../middleware/auth.middleware'

const router = Router()
router.use(protect)

router.get('/members', getFamilyMembers)
router.post('/members', createFamilyMember)
router.delete('/members/:id', deleteFamilyMember)

router.get('/wellness', getWellnessLogs)
router.post('/wellness', createWellnessLog)
router.delete('/wellness/:id', deleteWellnessLog)

router.get('/finances', getFinances)
router.post('/finances', createFinance)
router.delete('/finances/:id', deleteFinance)

router.get('/plans', getFamilyPlans)
router.post('/plans', createFamilyPlan)
router.patch('/plans/:id/toggle', togglePlan)
router.delete('/plans/:id', deletePlan)

export default router