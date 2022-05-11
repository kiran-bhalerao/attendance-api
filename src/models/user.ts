import { Document, Model, model, Schema } from 'mongoose'
import { hashPassword } from 'src/helpers/password'
import { USER } from 'src/types/user'

export interface UserDoc extends Document, USER {}

interface UserModel extends Model<UserDoc> {
  build: (attrs: USER) => UserDoc
}

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: false
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    userType: {
      type: String,
      enum: ['ADMIN', 'USER']
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform(_, doc) {
        doc.id = doc._id
        delete doc._id
        delete doc.password
        delete doc.__v
      }
    }
  }
)

UserSchema.pre('save', function (done) {
  if (this.isModified('password')) {
    // hash the password
    const hashed = hashPassword(this.get('password'))
    this.set('password', hashed)
  }
  done()
})

UserSchema.statics.build = (attrs: USER) => new User(attrs)

export const User = model<UserDoc, UserModel>('User', UserSchema)
