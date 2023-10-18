import { modelOptions, prop, getModelForClass, Ref } from '@typegoose/typegoose'
import { Year } from './yearModel'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Classs {
  public _id?: string

  @prop({ required: true })
  public name!: string

  @prop()
  public description?: string

  @prop({ ref: Year })
  public year?: Ref<Year>
}

export const ClasssModel = getModelForClass(Classs)
