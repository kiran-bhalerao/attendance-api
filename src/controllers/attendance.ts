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
    const departments = await Attendance.find().distinct('department')

    res.send({ months, years, departments })
  }

  @Get('/all')
  @Auth()
  async getAttendances(req: Request, res: Response) {
    const { employeeKeyword, month, year, department } = req.query

    const attendances = await Attendance.find({
      ...(employeeKeyword ? { employeeName: { $regex: employeeKeyword, $options: 'i' } } : {}),
      ...(month ? { month } : {}),
      ...(year ? { year } : {}),
      ...(department ? { department } : {})
    }).limit(5600)

    res.send({ data: attendances })
  }
}
