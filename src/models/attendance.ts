import { Document, model, Model, Schema } from 'mongoose'

interface AttendanceAttrs {
  month: string
  year: number
  employeeName: string
  department: string
  shift: 1 | 2 | 3
  totalPresentDays: number
  totalAbsentDays: number
  attendance: {
    status: string
    date: Date
    inTime: string
    outTime: string
    duration: string
  }[]
}

export interface AttendanceDoc extends Document, AttendanceAttrs {}

const AttendanceSchema = new Schema(
  {
    month: String,
    year: Number,
    employeeName: String,
    department: String,
    shift: {
      type: Number,
      enum: [1, 2, 3]
    },
    totalPresentDays: Number,
    totalAbsentDays: Number,
    attendance: [
      {
        status: {
          type: String,
          enum: ['P', 'A']
        },
        date: Date,
        inTime: String,
        outTime: String,
        duration: String
      }
    ]
  },
  {
    timestamps: true,
    toJSON: {
      transform(_, doc) {
        doc.id = doc._id
        delete doc._id
        delete doc.__v
      }
    }
  }
)

AttendanceSchema.index({ month: 1, year: 1, employeeName: 1, department: 1, shift: 1 }, { unique: true })
export const Attendance = model<AttendanceDoc, Model<AttendanceDoc>>('Attendance', AttendanceSchema)
