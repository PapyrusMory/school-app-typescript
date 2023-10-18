import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { User } from './models/userModel'

export const generateToken = (user: User) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isEducator: user.isEducator,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  )
}

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers
  if (authorization) {
    const token = authorization.slice(7, authorization.length)
    const decode = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decode as {
      _id: string
      name: string
      email: string
      isAdmin: boolean
      isEducator: boolean
      token: string
    }
    next()
  } else {
    res.status(401).json({ message: 'No Token' })
  }
}

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user?.isAdmin) {
      next()
    } else {
      res.status(401).send({
        message: 'Invalid Admin Token',
      })
    }
  } catch (error) {
    res.status(500).send({
      message: 'Unexpected error',
    })
  }
}

export const isEducator = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user?.isEducator) {
      next()
    } else {
      res.status(401).send({
        message: 'Invalid Educator Token',
      })
    }
  } catch (error) {
    res.status(500).send({
      message: 'Unexpected error',
    })
  }
}
