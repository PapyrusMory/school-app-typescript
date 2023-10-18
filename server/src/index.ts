import dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import path from 'path'
import { userRouter } from './routers/userRouter'
import { yearRouter } from './routers/yearRouter'
import { classRouter } from './routers/classRouter'
import { studentRouter } from './routers/studentRouter'

dotenv.config()

mongoose.set('strictQuery', true)

const MONGODB_URI = process.env.MONGODB_URI

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to mongodb')
  })
  .catch(() => {
    console.log('error mongodb')
  })

const app = express()

app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:5173'],
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/users', userRouter)
app.use('/api/years', yearRouter)
app.use('/api/classes', classRouter)
app.use('/api/students', studentRouter)

app.use(express.static(path.join(__dirname, '../../client/dist')))
app.get('*', (req: Request, res: Response) =>
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'))
)

const PORT: number = parseInt((process.env.PORT || '5000') as string, 10)

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`)
})
