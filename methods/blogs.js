import chalk from "chalk";
import { Blog } from "../db/models/schema.js";
import imgurDelete from "../service/imgurDelete.js";
import imgurUpload from "../service/imgurUpload.js";

const blogPostDB = async (file, highlights, postStory) => {
    const image = await imgurUpload(file);
    const newBlog = new Blog({
        _id: `DMCD_blog_${image.id}`,
        image: image,
        highlights: highlights,
        postStory: postStory
    })
    console.log();
    await newBlog.save()
    console.log(chalk.blue("Blog Posted"));
}

const blogFetchLatestDB = async () => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 }).limit(5);
        return blogs
    }
    catch (error) {
        throw error
    }
}

const blogFetchAllDB = async (offset) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 }).skip(offset).limit(5);
        const totalBlogsCount = await Blog.countDocuments().exec();
        return { blogs, totalBlogsCount };
    } catch (error) {
        throw error;
    }
};

const getBlog = async (postID) => {
    try {
        const blog = await Blog.findOne({ _id: postID })
        return blog
    } catch (error) {
        throw error
    }
}

const deleteBlog = async (postID) => {
    try {
        const blog = await getBlog(postID)
        await imgurDelete(blog.image.deletehash)
        await Blog.deleteOne({ _id: postID })
    } catch (error) {
        throw error
    }
}

export { blogPostDB, blogFetchAllDB,blogFetchLatestDB, getBlog, deleteBlog }

