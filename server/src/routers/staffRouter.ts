import express, { Request, Response } from 'express'
import { StaffModel } from '../models/staffModel'
import { isAdmin, isAuth } from '../utils'
import expressAsyncHandler from 'express-async-handler'

export const staffRouter = express.Router()

staffRouter.post(
  '/new',
  isAuth,
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const newstaff = new StaffModel(req.body)
      await newstaff.save()
      res.send('Employé Ajouté')
    } catch (error) {
      res.status(400).json(error)
    }
  })
)

staffRouter.get(
  '/all',
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const staffs = await StaffModel.find()
      res.send(staffs)
    } catch (error) {
      res.status(400).json(error)
    }
  })
)

staffRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const staff = await StaffModel.findById(req.params.id)
      if (staff) {
        Object.assign(staff, req.body)
        const staffUpdated = staff.save()
        res.send({
          message: 'Employé Modifiée',
          staff: staffUpdated,
        })
      } else {
        res.status(404).send({
          message: 'Employé Introuvable',
        })
      }
    } catch (error) {
      res.status(400).json(error)
    }
  })
)

staffRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const staff = await StaffModel.findById(req.params.id)
      if (staff) {
        await staff.deleteOne()
        res.send({
          message: 'Employé Supprimé',
        })
      } else {
        res.status(404).send({
          message: 'Année Introuvable',
        })
      }
    } catch (error) {
      res.status(400).json(error)
    }
  })
)

staffRouter.get(
  '/:id',
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const staff = await StaffModel.findById(req.params.id)
      if (staff) {
        res.send(staff)
      } else {
        res.status(404).send({
          message: 'Employé Introuvable',
        })
      }
    } catch (error) {
      res.status(400).json(error)
    }
  })
)
