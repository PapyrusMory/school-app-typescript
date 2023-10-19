import express, { Request, Response } from 'express'
import { BilanModel } from '../models/bilanModel'
import { isAdmin, isAuth } from '../utils'
import expressAsyncHandler from 'express-async-handler'

export const bilanRouter = express.Router()

bilanRouter.post(
  '/new',
  //isAuth,
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const newClass = new BilanModel(req.body)
      await newClass.save()
      res.send('Bilan Créé')
    } catch (error) {
      res.status(400).json(error)
    }
  })
)

bilanRouter.get(
  '/all',
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const classes = await BilanModel.find()
      res.send(classes)
    } catch (error) {
      res.status(400).json(error)
    }
  })
)

bilanRouter.get(
  '/:user/bilans',
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const getBilanByUser = await BilanModel.find({
        recorded_by: req.params.recorded_by,
      })
        .populate('year', '_id name')
        .exec()
      const countBilanByUser = await BilanModel.countDocuments()
      res.send({
        getBilanByUser,
        countBilanByUser,
      })
    } catch (error) {
      res.status(400).json(error)
    }
  })
)

bilanRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const bilan = await BilanModel.findById(req.params.id)
      if (bilan) {
        Object.assign(bilan, req.body)
        const bilanUpdated = bilan.save()
        res.send({
          message: 'Bilan Modifié',
          bilan: bilanUpdated,
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

bilanRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const bilan = await BilanModel.findById(req.params.id)
      if (bilan) {
        await bilan.deleteOne()
        res.send({
          message: 'Bilan Supprimé',
        })
      } else {
        res.status(404).send({
          message: 'Bilan Introuvable',
        })
      }
    } catch (error) {
      res.status(400).json(error)
    }
  })
)

bilanRouter.get(
  '/:id',
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const bilan = await BilanModel.findById(req.params.id)
      if (bilan) {
        res.send(bilan)
      } else {
        res.status(404).send({
          message: 'Bilan Introuvable',
        })
      }
    } catch (error) {
      res.status(400).json(error)
    }
  })
)

bilanRouter.get(
  '/listByUser',
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      let firstDay = req.query.firstDay
      let lastDay = req.query.lastDay

      const listByUser = await BilanModel.find({
        $and: [{ incurred_on: { $gte: firstDay, $lte: lastDay } }],
      }).sort('incurred_on')
      res.json(listByUser)
    } catch (error) {
      res.status(400).json(error)
    }
  })
)

bilanRouter.get(
  '/current-month-preview',
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
    try {
      let currentPreview = await BilanModel.aggregate([
        {
          $facet: {
            month: [
              {
                $match: {
                  incurred_on: { $gte: firstDay, $lt: lastDay },
                  //recorded_by: mongoose.Types.ObjectId(req.auth._id),
                },
              },
              {
                $group: {
                  _id: 'currentMonth',
                  totalSpent: { $sum: '$amount' },
                },
              },
            ],
            today: [
              {
                $match: {
                  incurred_on: { $gte: today, $lt: tomorrow },
                  //recorded_by: mongoose.Types.ObjectId(req.auth._id),
                },
              },
              { $group: { _id: 'today', totalSpent: { $sum: '$amount' } } },
            ],
            yesterday: [
              {
                $match: {
                  incurred_on: { $gte: yesterday, $lt: today },
                  //recorded_by: mongoose.Types.ObjectId(req.auth._id),
                },
              },
              { $group: { _id: 'yesterday', totalSpent: { $sum: '$amount' } } },
            ],
          },
        },
      ])
      let bilanPreview = {
        month: currentPreview[0].month[0],
        today: currentPreview[0].today[0],
        yesterday: currentPreview[0].yesterday[0],
      }
      res.json(bilanPreview)
    } catch (error) {
      res.status(400).json(error)
    }
  })
)

bilanRouter.get(
  '/bilan-category',
  expressAsyncHandler(async (req: Request, res: Response) => {
    const date = new Date(),
      y = date.getFullYear(),
      m = date.getMonth()
    const firstDay = new Date(y, m, 1)
    const lastDay = new Date(y, m + 1, 0)

    try {
      let categoryMonthlyAvg = await BilanModel.aggregate([
        {
          $facet: {
            average: [
              /*{ $match: { recorded_by: mongoose.Types.ObjectId(req.auth._id) } },*/
              {
                $group: {
                  _id: {
                    category: '$category',
                    month: { $month: '$incurred_on' },
                  },
                  totalSpent: { $sum: '$amount' },
                },
              },
              {
                $group: {
                  _id: '$_id.category',
                  avgSpent: { $avg: '$totalSpent' },
                },
              },
              {
                $project: {
                  _id: '$_id',
                  value: { average: '$avgSpent' },
                },
              },
            ],
            total: [
              {
                $match: {
                  incurred_on: { $gte: firstDay, $lte: lastDay },
                  //recorded_by: mongoose.Types.ObjectId(req.auth._id),
                },
              },
              { $group: { _id: '$category', totalSpent: { $sum: '$amount' } } },
              {
                $project: {
                  _id: '$_id',
                  value: { total: '$totalSpent' },
                },
              },
            ],
          },
        },
        {
          $project: {
            overview: { $setUnion: ['$average', '$total'] },
          },
        },
        { $unwind: '$overview' },
        { $replaceRoot: { newRoot: '$overview' } },
        { $group: { _id: '$_id', mergedValues: { $mergeObjects: '$value' } } },
      ]).exec()
      res.json(categoryMonthlyAvg)
    } catch (error) {
      res.status(400).json(error)
    }
  })
)

bilanRouter.get(
  '/average-categories',
  expressAsyncHandler(async (req: Request, res: Response) => {
    const firstDay = new Date()
    const lastDay = new Date()
    try {
      let categoryMonthlyAvg = await BilanModel.aggregate([
        {
          $match: {
            incurred_on: { $gte: firstDay, $lte: lastDay },
            //recorded_by: mongoose.Types.ObjectId(req.auth._id),
          },
        },
        {
          $group: {
            _id: { category: '$category' },
            totalSpent: { $sum: '$amount' },
          },
        },
        { $group: { _id: '$_id.category', avgSpent: { $avg: '$totalSpent' } } },
        { $project: { x: '$_id', y: '$avgSpent' } },
      ]).exec()
      res.json({ monthAVG: categoryMonthlyAvg })
    } catch (error) {
      res.status(400).json(error)
    }
  })
)

bilanRouter.get(
  '/yearly-bilan',
  expressAsyncHandler(async (req: Request, res: Response) => {
    const y = 2023
    const firstDay = new Date(y, 0, 1)
    const lastDay = new Date(y, 12, 0)
    try {
      let totalMonthly = await BilanModel.aggregate([
        {
          $match: {
            incurred_on: { $gte: firstDay, $lt: lastDay },
            //recorded_by: mongoose.Types.ObjectId(req.auth._id),
          },
        },
        {
          $group: {
            _id: { $month: '$incurred_on' },
            totalSpent: { $sum: '$amount' },
          },
        },
        { $project: { x: '$_id', y: '$totalSpent' } },
      ]).exec()
      res.json({ monthTot: totalMonthly })
    } catch (error) {
      res.status(400).json(error)
    }
  })
)

bilanRouter.get(
  '/plot-bilans',
  expressAsyncHandler(async (req: Request, res: Response) => {
    const date = new Date(),
      y = date.getFullYear(),
      m = date.getMonth()
    const firstDay = new Date(y, m, 1)
    const lastDay = new Date(y, m + 1, 0)
    try {
      let totalMonthly = await BilanModel.aggregate([
        {
          $match: {
            incurred_on: { $gte: firstDay, $lt: lastDay },
            //recorded_by: mongoose.Types.ObjectId(req.auth._id),
          },
        },
        { $project: { x: { $dayOfMonth: '$incurred_on' }, y: '$amount' } },
      ]).exec()
      res.json(totalMonthly)
    } catch (error) {
      res.status(400).json(error)
    }
  })
)
