import express from "express"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import mongoose from "mongoose"

import usersRoutes from "./services/users/index.js"
import { badRequestErrorHandler, notFoundErrorHandler, catchAllErrorHandler } from "./errorHandlers.js"

const server = express()

const port = process.env.PORT || 3008

// ****************** MIDDLEWARES ****************************

server.use(express.json())

// ****************** ROUTES *******************************

server.use("/users", usersRoutes)

// ****************** ERROR HANDLERS ***********************

server.use(badRequestErrorHandler)
server.use(notFoundErrorHandler)
server.use(catchAllErrorHandler)

console.table(listEndpoints(server))

mongoose
  .connect(process.env.MONGO_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(() =>
    server.listen(port, () => {
      console.log("Server running on port ", port)
    })
  )
  .catch(err => console.log(err))