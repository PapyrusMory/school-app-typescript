import express, { Request, Response } from 'express'
import expressAsyncHandler from 'express-async-handler'
import { UserModel } from '../models/userModel'
import { isAuth, generateToken, isAdmin } from '../utils'
import bcrypt from 'bcryptjs'

export const userRouter = express.Router()

userRouter.post(
  '/new',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const newUser = new UserModel({
        ...req.body,
        password: bcrypt.hashSync(req.body.password),
      })

      const user = await newUser.save()
      res.send({
        _id: user._id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        isEducator: user.isEducator,
        token: generateToken(user),
      })
    } catch (error) {
      res.status(400).json(error)
    }
  })
)

userRouter.post(
  '/login',
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const user = await UserModel.findOne({
        name: req.body.name,
      })
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          res.send({
            _id: user._id,
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin,
            isEducator: user.isEducator,
            token: generateToken(user),
          })
          return
        }
      } else {
        res.status(400).json({ message: 'Login failed', user: user })
      }
    } catch (error) {
      res.status(400).json(error)
    }
  })
)

userRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const user = await UserModel.findById(req.params.id)
      if (user) {
        Object.assign(user, req.body)
        const updatedUser = await user.save()
        res.send({ message: 'User Updated', user: updatedUser })
      } else {
        res.status(404).send({ message: 'User Not Found' })
      }
    } catch (error) {
      res.status(400).json(error)
    }
  })
)

userRouter.get(
  '/all',
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const users = await UserModel.find()
      const countUsers = await UserModel.countDocuments()
      res.send({
        users,
        countUsers,
      })
    } catch (error) {
      res.status(400).json(error)
    }
  })
)

userRouter.get(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const user = await UserModel.findById(req.params.id)
      if (user) {
        res.send(user)
      } else {
        res.status(404).send({ message: 'User Not Found' })
      }
    } catch (error) {
      res.status(400).json(error)
    }
  })
)

userRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findById(req.params.id)
    if (user) {
      if (user.email === 'admin@example.com') {
        res.status(400).send({ message: 'Can Not Delete Admin User' })
        return
      }
      const deleteUser = await user.deleteOne()
      res.send({ message: 'User Deleted', user: deleteUser })
    } else {
      res.status(404).send({ message: 'User Not Found' })
    }
  })
)
