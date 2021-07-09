import express from "express"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import mongoose from "mongoose"

import blogsRouter from "./services/blogs/index.js"
import { badRequestErrorHandler, notFoundErrorHandler, catchAllErrorHandler } from "./errorHandlers.js"

const server = express()

const { PORT, MONGO_CONNECTION_STRING } = process.env;


// ****************** MIDDLEWARES ****************************

server.use(express.json())

// ****************** ROUTES *******************************

server.use("/blogs", blogsRouter),

// ****************** ERROR HANDLERS ***********************

server.use(badRequestErrorHandler)
server.use(notFoundErrorHandler)
server.use(catchAllErrorHandler)

console.table(listEndpoints(server))

server.listen(PORT, async () => {
    try {
      await mongoose.connect(MONGO_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log(`Server is running on ${PORT}  and connected to db`);
    } catch (error) {
      console.log("Db connection is failed ", error);
    }
  });
  server.on("error", (error) =>
  console.log(`Server is not running due to : ${error}`)
);