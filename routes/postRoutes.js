const express = require('express');
const { getAllPosts, addPost } = require('../controllers/postController');

const router = express.Router();



/**
 * @swagger
 * /api/post/posts:
 *   get:
 *     tags:
 *       - Post Routes 
 *     summary: Retrieve all posts
 *     description: Get a list of all posts with optional filtering, pagination, and sorting.
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number for pagination (default is 1).
 *         required: false
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         description: Number of posts per page (default is 10).
 *         required: false
 *         schema:
 *           type: integer
 *       - name: keyword
 *         in: query
 *         description: Keyword to search in post titles and descriptions.
 *         required: false
 *         schema:
 *           type: string
 *       - name: sortOrder
 *         in: query
 *         description: Order to sort the posts (asc or desc, default is desc).
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *       - name: tag
 *         in: query
 *         description: Filter posts by specific tag.
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of posts with pagination information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPosts:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 posts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       image:
 *                         type: string
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *       400:
 *         description: Bad request due to invalid parameters.
 *       500:
 *         description: Internal server error.
 */
router.route('/posts').get(getAllPosts);

/**
 * @swagger
 * /api/post/addPost:
 *   post:
 *     tags:
 *       - Post Routes 
 *     summary: Add a new post
 *     description: Create a new post with title, description, image, and tags.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: 
 *                     - 670689e422bb299405079640
 *                     - 670694d3449cc584e8104c03
 *     responses:
 *       201:
 *         description: Post created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 image:
 *                   type: string
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Bad request due to missing title or description.
 *       500:
 *         description: Internal server error.
 */
router.route('/addPost').post(addPost);

module.exports = router;
