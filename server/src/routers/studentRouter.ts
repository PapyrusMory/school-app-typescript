import express, { Request, Response } from 'express'
import { StudentModel } from '../models/studentModel'
import { isAdmin, isAuth } from '../utils'
import expressAsyncHandler from 'express-async-handler'

export const studentRouter = express.Router()

studentRouter.post(
  '/new',
  isAuth,
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const newStudent = new StudentModel(req.body)
      await newStudent.save()
      res.send('Élève ajouté')
    } catch (error) {
      res.status(400).json(error)
    }
  })
)

studentRouter.get(
  '/all',
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const students = await StudentModel.find()
      res.send(students)
    } catch (error) {
      res.status(400).json(error)
    }
  })
)

studentRouter.get(
  '/:classs/students',
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const getStudentsByClass = await StudentModel.find({
        classs: req.params.classs,
      })
        .populate('classs', '_id name description')
        .exec()
      const countStudentsByClass = await StudentModel.countDocuments()
      res.send({
        getStudentsByClass,
        countStudentsByClass,
      })
    } catch (error) {
      res.status(400).json(error)
    }
  })
)

studentRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const student = await StudentModel.findById(req.params.id)
      if (student) {
        Object.assign(student, req.body)
        const studentUpdated = student.save()
        res.send({
          message: 'Élève Modifié',
          student: studentUpdated,
        })
      } else {
        res.status(404).send({
          message: 'Élève Introuvable',
        })
      }
    } catch (error) {
      res.status(400).json(error)
    }
  })
)

studentRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const student = await StudentModel.findById(req.params.id)
      if (student) {
        await student.deleteOne()
        res.send({
          message: 'Élève Supprimée',
        })
      } else {
        res.status(404).send({
          message: 'Élève Introuvable',
        })
      }
    } catch (error) {
      res.status(400).json(error)
    }
  })
)

studentRouter.get(
  '/:id',
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const student = await StudentModel.findById(req.params.id)
      if (student) {
        res.send(student)
      } else {
        res.status(404).send({
          message: 'Élève Introuvable',
        })
      }
    } catch (error) {
      res.status(400).json(error)
    }
  })
)

studentRouter.get(
  '/summary',
  expressAsyncHandler(async (req: Request, res: Response) => {
    const date = new Date(),
      y = date.getFullYear(),
      m = date.getMonth()
    const firstDay = new Date(y, m, 1)
    const lastDay = new Date(y, m + 1, 0)

    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)

    const tomorrow = new Date()
    tomorrow.setUTCHours(0, 0, 0, 0)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const yesterday = new Date()
    yesterday.setUTCHours(0, 0, 0, 0)
    yesterday.setDate(yesterday.getDate() - 1)
    const currentMonthPreview = await StudentModel.aggregate([
      {
        $facet: {
          month: [
            {
              $match: {
                incurred_on: { $gte: firstDay, $lt: lastDay },
              },
            },
            {
              $group: {
                _id: 'currentMonth',
                totalAmount: { $sum: '$mntAPayer' },
              },
            },
          ],
          today: [
            {
              $match: {
                incurred_on: { $gte: today, $lt: tomorrow },
              },
            },
            { $group: { _id: 'today', totalAmount: { $sum: '$mntAPayer' } } },
          ],
          yesterday: [
            {
              $match: {
                incurred_on: {
                  $gte: yesterday,
                  $lt: today,
                },
              },
            },
            {
              $group: { _id: 'yesterday', totalAmount: { $sum: '$mntAPayer' } },
            },
          ],
        },
      },
    ])

    res.send({
      currentMonthPreview,
    })
  })
)
