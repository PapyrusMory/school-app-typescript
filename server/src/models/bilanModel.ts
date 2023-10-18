import { modelOptions, prop, getModelForClass, Ref } from '@typegoose/typegoose'
import { User } from './userModel'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Bilan {
  public _id?: string

  @prop({ required: true })
  public title!: string

  @prop({ required: true })
  public category!: string

  @prop({ required: true })
  public amount!: number

  @prop()
  public notes!: string

  @prop({ default: Date.now })
  public incurred_on?: Date

  @prop({ ref: User })
  public recorded_by?: Ref<User>
}

export const BilanModel = getModelForClass(Bilan)
