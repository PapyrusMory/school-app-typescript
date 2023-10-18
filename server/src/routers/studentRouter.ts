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
