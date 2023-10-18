declare namespace Express {
  export interface Request {
    user: {
      _id: string
      name: string
      email: string
      isAdmin: boolean
      isEducator: boolean
      token: string
    }
  }
}
