export type Bilan = {
  _id: string
  title: string
  category: string
  amount: number
  notes: string
  incurred_on?: Date
  recorded_by?: string
}
