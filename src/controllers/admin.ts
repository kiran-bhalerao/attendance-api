import { Controller, Middlewares, Post } from '@tsxp/core'
import dayjs from 'dayjs'
import { Request, Response } from 'express'
import fs from 'fs'
import multer from 'multer'
import xlsx from 'node-xlsx'
import { durations, inTime1, inTime2, inTime3, nullTime, outTime1, outTime2, outTime3 } from 'src/constants'
import { AdminOnly } from 'src/helpers/auth'
import { random } from 'src/helpers/functions/random'
import { Attendance } from 'src/models/attendance'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './_uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + '-' + Date.now() + '.xlsx')
  }
})

const upload = multer({
  storage: storage
})

@Controller('admin')
export class AdminController {
  @Post('/upload')
  @Middlewares(upload.single('excel-file'))
  @AdminOnly({ error: 'This is admin only route' })
  async uploadExcel(req: Request, res: Response) {
    const workSheetsFromFile = xlsx.parse(req.file?.path)
    const rows = workSheetsFromFile[0].data as any[]
    const data = rows.slice(2)

    const _month = rows[0].filter(Boolean)[2]
    const days: any[] = rows[1].slice(4)

    const _fromDate = days[0] + ' ' + _month.replace('-', ' ')
    const month = dayjs(_fromDate).format('MMMM')
    const year = dayjs(_fromDate).format('YYYY')

    const att = data.map((row) => {
      const employeeName = row[1]
      const department = row[2]
      const shift = row[3]
      let totalPresentDays = 0
      let totalAbsentDays = 0

      const statuses = row.slice(4)

      const attendance = days.map((day, i) => {
        const date = dayjs(day + ' ' + _month.replace('-', ' ')).format('YYYY-MM-DD')
        const status = statuses[i]

        let inTime = null
        let outTime = null
        let duration = null

        if (status === 'A') {
          inTime = nullTime
          outTime = nullTime
          duration = nullTime
          totalAbsentDays = totalAbsentDays + 1
        } else {
          if (shift === 1) {
            inTime = random(inTime1)
            outTime = random(outTime1)
          } else if (shift === 2) {
            inTime = random(inTime2)
            outTime = random(outTime2)
          } else {
            inTime = random(inTime3)
            outTime = random(outTime3)
          }

          duration = random(durations)
          totalPresentDays = totalPresentDays + 1
        }

        return {
          date,
          status,
          inTime,
          outTime,
          duration
        }
      })

      return {
        month,
        year,
        employeeName,
        department,
        shift,
        totalPresentDays,
        totalAbsentDays,
        attendance
      }
    })

    // delete input file
    const filePath = req.file?.path
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath)
      } catch (err) {
        console.error(err)
      }
    }

    await Attendance.insertMany(att)

    return res.send({ message: 'File uploaded successfully' })
  }
}
