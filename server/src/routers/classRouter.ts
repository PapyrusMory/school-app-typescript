import express, { Request, Response } from 'express'
import { ClasssModel } from '../models/classModel'
import { isAdmin, isAuth } from '../utils'
import expressAsyncHandler from 'express-async-handler'

export const classRouter = express.Router()

classRouter.post(
  '/new',
  isAuth,
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const newClass = new ClasssModel(req.body)
      await newClass.save()
      res.send('Classe Créée')
    } catch (error) {
      res.status(400).json(error)
    }
  })
)

classRouter.get(
  '/all',
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const classes = await ClasssModel.find()
      res.send(classes)
    } catch (error) {
      res.status(400).json(error)
    }
  })
)

classRouter.get(
  '/:year/classes',
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const getClassesByYear = await ClasssModel.find({
        year: req.params.year,
      })
        .populate('year', '_id name description category')
        .exec()
      const countClassesByYear = await ClasssModel.countDocuments()
      res.send({
        getClassesByYear,
        countClassesByYear,
      })
    } catch (error) {
      res.status(400).json(error)
    }
  })
)

classRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const classs = await ClasssModel.findById(req.params.id)
      if (classs) {
        Object.assign(classs, req.body)
        const classsUpdated = classs.save()
        res.send({
          message: 'Classe Modifiée',
          classs: classsUpdated,
        })
      } else {
        res.status(404).send({
          message: 'Classe Introuvable',
        })
      }
    } catch (error) {
      res.status(400).json(error)
    }
  })
)

classRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const classs = await ClasssModel.findById(req.params.id)
      if (classs) {
        await classs.deleteOne()
        res.send({
          message: 'Classe Supprimée',
        })
      } else {
        res.status(404).send({
          message: 'Classe Introuvable',
        })
      }
    } catch (error) {
      res.status(400).json(error)
    }
  })
)

classRouter.get(
  '/:id',
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const classs = await ClasssModel.findById(req.params.id)
      if (classs) {
        res.send(classs)
      } else {
        res.status(404).send({
          message: 'Classe Introuvable',
        })
      }
    } catch (error) {
      res.status(400).json(error)
    }
  })
)
