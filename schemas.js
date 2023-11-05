const Joi=require('joi');

module.exports.blogSchema=Joi.object({
    blog: Joi.object({
        title: Joi.string().required(),
        image: Joi.string(),
        description: Joi.string().required(),
    }).required()
});

module.exports.commentSchema=Joi.object({
    comment: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})
