const uploadImage = require("../helper/uploadImage");
const { IncomingForm } = require('formidable');
const Post = require('../models/Post');
const Tag = require('../models/Tag');


const getAllPosts = async (req, res) => {
    try {
        const { page = 1, limit = 10, keyword, sortOrder = 'desc', tag } = req.query;

        // Validation for additional parameters
        const allowedParams = ['page', 'limit', 'keyword', 'tag', 'sortOrder'];
        const queryKeys = Object.keys(req.query);
        const invalidParams = queryKeys.filter(key => !allowedParams.includes(key));

        if (invalidParams.length) {
            return res.status(400).json({ error: 'BAD_REQUEST: Invalid parameters provided.' });
        }

        // Building the query for filtering
        let query = {};
        if (keyword) {
            query = {
                $or: [
                    { title: { $regex: keyword, $options: 'i' } },
                    { description: { $regex: keyword, $options: 'i' } }
                ]
            };
        }

        if (tag) {
            query.tags = { $regex: new RegExp(`^${tag}$`, 'i') };
        }

        const sortOptions = { createdAt: sortOrder === 'asc' ? 1 : -1 }; // 1 for ascending, -1 for descending

        // Pagination
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
        };

        const posts = await Post.find(query)
            .sort(sortOptions)
            .skip((options.page - 1) * options.limit)
            .limit(options.limit)
            .exec();

        const totalPosts = await Post.countDocuments(query);

        res.status(200).json({
            totalPosts,
            totalPages: Math.ceil(totalPosts / options.limit),
            currentPage: options.page,
            posts,
        });

    } catch (error) {
        console.error('Error retrieving posts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const addPost = async (req, res) => {
    const form = new IncomingForm({
        keepExtensions: false,
        maxFileSize: 25000000,
    });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({ error: 'Error parsing form data' });
        }

        const description = fields?.description ? (fields.description[0]) : null;
        const title = fields?.title ? (fields.title[0]) : null;
        const tagIds = fields?.tags ? (Array.isArray(fields.tags) ? fields.tags : [fields.tags]) : [];

        // Validate the request body
        if (!title || !description) {
            return res.status(400).json({ error: 'Title and description are required.' });
        }

        let imageUrl = null;
        if (files.image) {
            const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
            const imageFilePath = imageFile ? imageFile.filepath : null; // Get the file path

            if (imageFilePath) {
                imageUrl = await uploadImage(imageFilePath);
            }
        }

        let tagNames = [];
        if (tagIds.length > 0) {
            const tagDocs = await Tag.find({ _id: { $in: tagIds } });
            tagNames = tagDocs.map(tag => tag.name); // Get the tag names
        }

        const newPost = new Post({
            title,
            description,
            image: imageUrl,
            tags: tagNames,
        });

        try {
            await newPost.save();
            res.status(201).json(newPost);
        } catch (error) {
            console.error('Error saving post:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
};

module.exports = { getAllPosts, addPost };
