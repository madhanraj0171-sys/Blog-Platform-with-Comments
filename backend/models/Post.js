import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a blog title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a short description'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Please provide the blog content'],
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1000&q=80',
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: ['Technology', 'Programming', 'Education', 'Travel', 'Lifestyle', 'Other'],
      default: 'Other',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model('Post', postSchema);
export default Post;
