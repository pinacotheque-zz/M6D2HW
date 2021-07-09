import mongoose from 'mongoose'

const { Schema, model } = mongoose

const blogSchema = new Schema(
  {
    name: {type: String,required: true},

    email: {type: String,required: true},

    avatar: {type: String,required: true},
  }

)

export default model ("Blog", blogSchema)