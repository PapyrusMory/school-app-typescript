export type UserInfo = {
  _id: string
  name: string
  email: string
  token: string
  isAdmin: boolean
  isEducator: boolean
}

export type User = {
  _id: string
  name: string
  email: string
  isAdmin: boolean
  isEducator: boolean
  password: string
}
