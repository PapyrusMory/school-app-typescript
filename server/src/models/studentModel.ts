import { modelOptions, prop, getModelForClass, Ref } from '@typegoose/typegoose'
import { Classs } from './classModel'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Student {
  public _id?: string

  @prop({ required: true })
  public name!: string

  @prop()
  public birthDate?: string

  @prop()
  public birthPlace?: string

  @prop()
  public age?: string

  @prop()
  public sex?: string

  @prop()
  public city?: string

  @prop()
  public country?: string

  @prop()
  public tel?: string

  @prop()
  public nationality?: string

  @prop()
  public redoubl?: string

  @prop()
  public originEts?: string

  @prop()
  public previousClass?: string

  @prop()
  public nextClass?: string

  @prop()
  public dadName?: string

  @prop()
  public dadJob?: string

  @prop()
  public dadContact?: string

  @prop()
  public dadPlace?: string

  @prop()
  public momName?: string

  @prop()
  public momJob?: string

  @prop()
  public momContact?: string

  @prop()
  public momPlace?: string

  @prop()
  public aff?: boolean

  @prop({ required: true })
  public matricule!: string

  @prop()
  public mntAPayer?: number

  @prop()
  public remise?: number

  @prop()
  public inscription?: number

  @prop()
  public versement1?: number

  @prop()
  public versement2?: number

  @prop()
  public versement3?: number

  @prop()
  public versement4?: number

  @prop()
  public versement5?: number

  @prop()
  public versement6?: number

  @prop()
  public image?: string

  @prop({ default: Date.now })
  public incurred_on?: Date

  @prop({ ref: Classs })
  public classs?: Ref<Classs>
}

export const StudentModel = getModelForClass(Student)
