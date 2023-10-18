import { modelOptions, prop, getModelForClass, Ref } from '@typegoose/typegoose'
import { User } from './userModel'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Year {
  public _id?: string

  @prop({ required: true })
  public name!: string

  @prop()
  public category?: string

  @prop()
  public description?: string

  @prop({ ref: User })
  public instructor?: Ref<User>
}

export const YearModel = getModelForClass(Year)
