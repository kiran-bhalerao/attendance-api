import { Auth, Controller, Get } from '@tsxp/core'
import { Request, Response } from 'express'
import { Attendance } from 'src/models/attendance'

@Controller('attendance')
export class AttendanceController {
  @Get('/filter-data')
  @Auth()
  async getFilterData(_req: Request, res: Response) {
    const months = await Attendance.find().distinct('month')
    const years = await Attendance.find().distinct('year')

    res.send({ months, years })
  }

  @Get('/all')
  @Auth()
  async getAttendances(req: Request, res: Response) {
    const { employeeKeyword, month, year } = req.query

    const attendances = await Attendance.find({
      ...(employeeKeyword ? { employeeName: { $regex: employeeKeyword, $options: 'i' } } : {}),
      ...(month ? { month } : {}),
      ...(year ? { year } : {})
    })

    res.send({ data: attendances })
  }
}
