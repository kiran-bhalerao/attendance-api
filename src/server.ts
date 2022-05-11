import 'dotenv/config'
import { listen } from 'src/app'
import { connectToDB } from 'src/config/database'

async function main() {
  /** Connect to the DB */
  await connectToDB()

  /** Start Listening */
  await listen()
}

main()
