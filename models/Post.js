const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,

    },
    description: {
        type: String,
        required: true,

    },
    image: {
        type: String,
        required: true,
    },
    tags: [
        {
            type: String

        }
    ]

}, {
    timestamps: true
});



const Post = mongoose.model('Post', postSchema);

module.exports = Post;
