import Post from "../models/Post.mjs";
import { validatePost } from "../validations/post.validator.mjs"

export const create = async (req, res) => {
    const { error } = validatePost(req.body)
    if (error) return res.status(422).json({
        message: "Validation error",
        errors: error.details.map(err => err.message)
    })

    let postData = req.body;

    const post = await Post.create({ ...postData, userId: req.user._id });
    res.status(201).json({
        "message": "Post created successfully!",
        "data": post
    });

}