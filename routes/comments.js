const express=require('express');
const router=express.Router({mergeParams: true});
const {validateComment,isLoggedIn,isCommentAuthor}=require('../middleware')
const catchAsync=require('../utils/catchAsync');
const ExpressError=require('../utils/ExpressError');
const Blog=require('../models/blog');
const Comment=require('../models/comment')

router.post('/',isLoggedIn,validateComment, catchAsync(async(req,res)=>{
    const blog=await Blog.findById(req.params.id);
    const comment=new Comment(req.body.comment);
    comment.author=req.user._id;
    blog.comments.push(comment);
    await comment.save();
    await blog.save();
    req.flash('success',' Posted a new comment!');
    res.redirect(`/blogs/${blog._id}`);
}))

router.delete('/:commentId',isLoggedIn,isCommentAuthor, catchAsync(async(req,res,next)=>{
    const{id,commentId}=req.params;
    await Blog.findByIdAndUpdate(id, {$pull:{comments:commentId}})
    await Comment.findByIdAndDelete(req.params.commentId);
    req.flash('success','Comment deleted');
    res.redirect(`/blogs/${id}`)
}))

module.exports=router;