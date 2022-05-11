import { Controller, Middlewares, Post } from '@tsxp/core'
import { Request, Response } from 'express'
import fs from 'fs'
import multer from 'multer'
import xlsx from 'node-xlsx'
import {
  durations,
  emptyRow,
  inTime1,
  inTime2,
  inTime3,
  nullTime,
  outTime1,
  outTime2,
  outTime3,
  overviewRow,
  staticRows
} from 'src/constants'
import { AdminOnly } from 'src/helpers/auth'
import { random } from 'src/helpers/functions/random'

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
export class Admin {
  @Post('/upload')
  @Middlewares(upload.single('excel-file'))
  @AdminOnly({ error: 'This is admin only route' })
  async uploadExcel(req: Request, res: Response) {
    const workSheetsFromFile = xlsx.parse(req.file?.path)
    const rows = workSheetsFromFile[1].data as any[]
    const data = rows.slice(2)

    const d = data
      .map((row) => {
        const srNo = row[0]
        const empName = row[1]
        const shift = row[2]
        const totalPresent = row[row.length - 1]

        const statuses = row.slice(3, -1)
        const totalAbsent = statuses.length - totalPresent

        const overviewData: any[] = [...overviewRow]

        overviewData[2] = empName
        overviewData[16] = totalPresent
        overviewData[17] = totalAbsent
        overviewData[23] = shift
        overviewData[32] = srNo

        const sheetData: any[] = []

        for (const status of statuses) {
          sheetData[0] = [...(sheetData[0] || ['Status']), status]

          if (status === 'A') {
            sheetData[1] = [...(sheetData[1] || ['InTime']), nullTime]
            sheetData[2] = [...(sheetData[2] || ['OutTime']), nullTime]
            sheetData[3] = [...(sheetData[3] || ['Duration']), nullTime]
          } else {
            if (shift === 1) {
              sheetData[1] = [...(sheetData[1] || ['InTime']), random(inTime1)]
              sheetData[2] = [...(sheetData[2] || ['OutTime']), random(outTime1)]
            } else if (shift === 2) {
              sheetData[1] = [...(sheetData[1] || ['InTime']), random(inTime2)]
              sheetData[2] = [...(sheetData[2] || ['OutTime']), random(outTime2)]
            } else {
              sheetData[1] = [...(sheetData[1] || ['InTime']), random(inTime3)]
              sheetData[2] = [...(sheetData[2] || ['OutTime']), random(outTime3)]
            }

            sheetData[3] = [...(sheetData[3] || ['Duration']), random(durations)]
          }

          sheetData[4] = [...(sheetData[4] || ['Late By']), nullTime]
          sheetData[5] = [...(sheetData[5] || ['Early By']), nullTime]
          sheetData[6] = [...(sheetData[6] || ['OT']), nullTime]
          sheetData[7] = [...(sheetData[7] || ['Shift']), shift]
        }

        return [overviewData, emptyRow, emptyRow, ...sheetData, emptyRow]
      })
      .flat()

    const rawSheet = [...staticRows, ...d]

    const buffer = xlsx.build([{ name: 'output', data: rawSheet, options: {} }])

    const fileName = './_downloads/Output -' + Date.now() + '.xlsx'

    fs.writeFile(fileName, buffer, (err) => {
      if (err) console.log(err)
    })

    // TODO:
    // send this output file to client and delete it
    // delete input file as well

    return res.send({ message: 'File Generated successfully' })
  }
}
