import express from 'express'
import createError from 'http-errors'
import q2m from "query-to-mongo" 
import authorsModel from './schema.js'

const authorsRouter = express.Router()

// GET ALL
authorsRouter.get("/", async (req, res,next ) => {
    try {
        const authors = await authorsModel.find()
        res.send(authors)
    } catch (error) {
        next(createError(500, "Error occured getting authors"))
    }
})

// GET SINGLE
authorsRouter.get("/:authorId", async (req, res,next ) => {
    try {
        const authorId = req.params.authorId
        const author = await authorsModel.findById(authorId)
        if (author){
            res.send(author)
        } else{
            next(createError(404, `Author with id: ${authorId} not found!`))
        }
    } catch (error) {
        next(createError(500, "Error in getting authors"))
    }
})

// POST
authorsRouter.post("/", async (req, res,next ) => {
    try {
        const newAuthor = new authorsModel(req.body)
        const { _id } = await newAuthor.save()
        res.status(201).send({_id})
    } catch (error) {
        if (error.name === "ValidationError") {
            next(createError(400, error))
        } else{
            next(createError(500, "An error occurred while creating new author"))
        }
    }
})

// UPDATE AUTHOR
authorsRouter.put("/:authorId", async (req, res,next ) => {
    try {
        const authorId = req.params.authorId
        const updatedAuthor = await authorsModel.findByIdAndUpdate(authorId, req.body, {
            new: true,
            runValidators: true,
        })
        if (updatedAuthor){
            res.send(updatedAuthor)
        } else{
            next(createError(404, `Author with id: ${authorId} not found!`))
        }
    } catch (error) {
        next(createError(500, "Error occured updating the author!"))
    }
})

// DELETE AUTHOR
authorsRouter.delete("/:authorId", async (req, res,next ) => {
    try {
        const authorId = req.params.authorId
        const deletedAuthor = await authorsModel.findByIdAndDelete(authorId)
        if (deletedAuthor){
            res.send(deletedAuthor)
        } else{
            next(createError(404, `Author with id: ${authorId} not found!`))
        }
    } catch (error) {
        next(createError(500, "Error occured deleting the author!"))
    }
})


