import express from 'express'
import createError from 'http-errors'
import blogModel from 'schema.js'

const blogsRouter = express.Router()


// GET ALL
blogsRouter.get("/", async(req, res, next) => {
    try {
        const blogs = await blogModel.find()
        res.send(blogs)
    } catch (error) {
        next(createError(500, "An error occurred while getting blog list "))
    }
})

// GET SINGLE
blogsRouter.get("/:blogId", async(req, res, next) => {
    try {
        const blogId = req.params.blogId
        const blog = await blogModel.findById(blogId)
        if (blog){
            res.send(blog)
        } else {
            next(createError(404, `User with _id ${blogId} not found!`))
        }
    } catch (error) {
        next(createError(500, "An error occurred while getting blog "))
    }
})

// POST
blogsRouter.post("/", async(req, res, next) => {
    try {
        const newBlog = new blogModel(req.body)
        const { _id } = await newBlog.save()

        res.status(201).send({_id})
    } catch (error) {
        if(error.name === "ValidationError"){
            next(createError(400, "An error occured"))
        } else {
            console.log(error)
            next(createError(500, "An error occured while creating blog"))
        }
    }
})

// DELETE 
blogsRouter.delete("/:blogId", async(req, res, next) => {
    try {
        const blogId = req.params.blogId
        const deletedBlog = await blogModel.findByIdAndDelete(blogId)
        
        if (deletedBlog){
            res.status(204).send()
        } else {
            next(createError(404, `User with _id ${blogId} not found!`))
        }
    } catch (error) {
        next(createError(500, "An error occurred while getting blog "))
    }
})

// UPDATE 
blogsRouter.put("/:blogId", async(req, res, next) => {
    try {
        const blogId = req.params.blogId
        const updatedBlog = await blogModel.findByIdAndUpdate(blogId, req.body, {
            new: true,
            runValidators: true,
        })
        
        if (updatedBlog){
            res.send(updatedBlog)
        } else {
            next(createError(404, `User with _id ${blogId} not found!`))
        }
    } catch (error) {
        next(createError(500, "An error occurred while getting blog "))
    }
})



export default blogsRouter