import mongoose, { Schema } from "mongoose";

const PostSchema = new Schema({
    title: String,
    body: String,
    tags: [String],
    publishedDate: {
        type: Date,
        dafault: Date.now,
    },
    user: {
        _id: mongoose.Types.ObjectId,
        username: String,
    },
});

const Post = mongoose.model('Post', PostSchema);
export default Post;