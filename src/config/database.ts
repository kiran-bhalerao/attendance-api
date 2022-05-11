import mongoose from 'mongoose'

export async function connectToDB() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined.')
  }

  await mongoose.connect(process.env.MONGO_URI)

  console.log('\n✔️✔️  DB')
  console.log(`✔️✔️  ${process.env.NODE_ENV![0].toUpperCase()}${process.env.NODE_ENV!.slice(1)}`)
}
