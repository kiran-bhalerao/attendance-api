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
    const { employeeKeyword, month, year, department, page } = req.query
    const _page = Math.max(0, Number(page))
    const pageLimit = 100

    const lengthAtt = await Attendance.find({
      ...(employeeKeyword ? { employeeName: { $regex: employeeKeyword, $options: 'i' } } : {}),
      ...(month ? { month } : {}),
      ...(year ? { year } : {}),
      ...(department ? { department } : {})
    }).countDocuments()

    const attendances = await Attendance.find({
      ...(employeeKeyword ? { employeeName: { $regex: employeeKeyword, $options: 'i' } } : {}),
      ...(month ? { month } : {}),
      ...(year ? { year } : {}),
      ...(department ? { department } : {})
    })
    .limit(pageLimit)
    .skip(pageLimit*_page)


    res.send({ data: attendances, count: lengthAtt })
  }


  @Get('/per-view')
  // @Auth()
  async getAttendancesView(req: Request, res: Response) {
    const { month, year, department } = req.query

    try {

      const attendances = await Attendance.find({
        ...(month ? { month } : {}),
      ...(year ? { year } : {}),
      ...(department ? { department } : {})
    })
    res.send({ data: attendances })
  } catch(err:any) {
    console.log(err)
    res.send({ error:err?.message })

      }
  }

  @Get('/per-delete')
  // @Auth()
  async getAttendancesDel(req: Request, res: Response) {
    const { month, year, department } = req.query

    try {

      const attendances = await Attendance.deleteMany({
        ...(month ? { month } : {}),
      ...(year ? { year } : {}),
      ...(department ? { department } : {})
    })
    res.send({ data: attendances })
  } catch(err:any) {
    console.log(err)
    res.send({ error:err?.message })

      }
  }
}
