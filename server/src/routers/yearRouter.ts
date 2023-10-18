import express, { Request, Response } from 'express'
import { YearModel } from '../models/yearModel'
import fs from 'fs'
import formidable from 'formidable'
import { isAdmin, isAuth } from '../utils'
import expressAsyncHandler from 'express-async-handler'

export const yearRouter = express.Router()

yearRouter.post(
  '/new',
  isAuth,
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const newYear = new YearModel(req.body)
      await newYear.save()
      res.send('Année Créée')
    } catch (error) {
      res.status(400).json(error)
    }
  })
)

yearRouter.get(
  '/all',
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const years = await YearModel.find()
      res.send(years)
    } catch (error) {
      res.status(400).json(error)
    }
  })
)

yearRouter.get(
  '/:instructor/years',
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const getYearsByInstructor = await YearModel.find({
        instructor: req.params.instructor,
      })
        .populate('instructor', '_id name')
        .exec()
      const countYearsByInstructor = await YearModel.countDocuments()
      res.send({
        getYearsByInstructor,
        countYearsByInstructor,
      })
    } catch (error) {
      res.status(400).json(error)
    }
  })
)

yearRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const year = await YearModel.findById(req.params.id)
      if (year) {
        Object.assign(year, req.body)
        const yearUpdated = year.save()
        res.send({
          message: 'Année Modifiée',
          year: yearUpdated,
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

yearRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const year = await YearModel.findById(req.params.id)
      if (year) {
        await year.deleteOne()
        res.send({
          message: 'Année Supprimée',
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

yearRouter.get(
  '/:id',
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const year = await YearModel.findById(req.params.id)
      if (year) {
        res.send(year)
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
