import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Staff {
  public _id?: string

  @prop({ required: true })
  public name!: string

  @prop()
  public birthPlace?: string

  @prop()
  public age?: string

  @prop()
  public sex?: string

  @prop()
  public job?: string

  @prop()
  public matrimonial?: string

  @prop()
  public tel?: string

  @prop()
  public childrenNber?: string

  @prop()
  public begin?: string

  @prop()
  public dadName?: string

  @prop()
  public momName?: string

  @prop()
  public urgence?: string

  @prop()
  public urgenceTel?: string

  @prop()
  public image?: string

  @prop({ default: Date.now })
  public incurred_on?: Date
}

export const StaffModel = getModelForClass(Staff)
