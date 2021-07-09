import express from 'express'
import createError from 'http-errors'
import blogModel from './schema.js'

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
            next(createError(404, `Blog with id: ${blogId} not found!`))
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
            next(createError(404, `Blog with id: ${blogId} not found!`))
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
            next(createError(404, `Blog with id: ${blogId} not found!`))
        }
    } catch (error) {
        next(createError(500, "An error occurred while getting blog "))
    }
})


/******************  REVIEWS-COMMENTS ******************/

// GET ALL
blogsRouter.get("/:blogId/comments", async(req, res, next) => {
    try {
        const blog = await blogModel.findById(req.params.blogId)
        
        if (blog){
            res.send(blog.comments)
        } else {
            next(createError(404, `Blog with id: ${blogId} not found!`))
        }
    } catch (error) {
        next(createError(500, "An error occurred while getting blog "))
    }
})

// GET SINGLE
blogsRouter.get("/:blogId/comments/:commentId", async(req, res, next) => {
    try {
        const blog = await blogModel.findById(req.params.blogId, {
            comments: {
                $elemMatch: {_id: req.params.commentId}
            }
        })
        if (blog){
            if (blog.comments.length > 0) {
                res.send(blog.comments[0])
              } else {
                next(createError(404, "Comments not found!"))
              }
        } else {
            next(createError(404, `Blog with id: ${blogId} not found!`))
        }
    } catch (error) {
        next(createError(500, "An error occurred while getting blog "))
    }
})

// POST COMMENT
blogsRouter.post("/:blogId/comments", async(req, res, next) => {
    try {
        const blog = req.params.blogId
        const newComment = {
            ...req.body,
            timestamps: true
        }
        const comment = await blogModel.findByIdAndUpdate(
            req.params.blogId,
            { $push: { comments: newComment } }, // how you want to modify him/her (adding an element to the array)
            
            {// options
              new: true,
              runValidators: true,
            }
        )
        if (comment){
            res.send(comment)
        } else {
            next(createError(404, `Blog with id: ${blogId} not found!`))
        }
    } catch (error) {
        next(createError(500, "An error occurred while creating comment "))
    }
})


// UPDATE COMMENT
blogsRouter.put("/:blogId/comments/:commentId", async(req, res, next) => {
    try {
        const blog = await blogModel.findByIdAndUpdate(
            {
                _id: req.params.blogId,
                "comments._id": req.params.commentId
            },
            {
                $set: {
                    "comments.$": req.body 
                }
            },
            {
                new: true,
                runValidators: true,
              }
        )
        if (blog){
            res.send(blog)
          
        } else {
            next(createError(404, `Blog with id: ${blogId} not found!`))
        }
    } catch (error) {
        next(createError(500, "An error occurred while getting blog "))
    }
})

// DELETE COMMENT
blogsRouter.delete("/:blogId/comments/:commentId", async(req, res, next) => {
    try {
        const blog = await blogModel.findByIdAndUpdate(
            req.params.blogId,
            { $pull: 
                {comments: {_id: req.params.commentId} }
        },
        { new: true } // options
        )
        if (blog){
                res.send(blog)
        } else {
            next(createError(404, `Blog with id: ${blogId} not found!`))
        }
    } catch (error) {
        next(createError(500, "An error occurred while getting blog "))
    }
})
 

export default blogsRouter