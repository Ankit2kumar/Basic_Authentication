import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema, model } = mongoose;

const BlogSchema = new Schema(
	{
		blogAuthor: { type: String, required: true },
		blogTitle: { type: String, required: true },
		authorEmail: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		role: { type: String, required: true, enum: ['Admin', 'User'] },
	},
	{
		timestamps: true,
	}
);

BlogSchema.pre('save', async (next) => {
	const newBlog = this;
	const plainPw = newBlog.password;

	if (newBlog.isModified('password')) {
		newBlog.password = await bcrypt.hash(plainPw, 10);
	}
	next();
});

BlogSchema.methods.toJSON = function () {
	const blog = this;
	const blogObject = blog.toObject();
	delete blogObject.password;
	delete blogObject.__v;
	return blogObject;
};

BlogSchema.statics.checkCredentials = async (email, plainPw) => {
	const blog = await this.findOne({ email });
	if (user) {
		const hashedPw = user.password;
		const isMatch = await bcrypt.compare(plainPw, hashedPw);
		if (isMatch) return blog;
		else return null;
	} else {
		return null;
	}
};

export default model('Blog', BlogSchema);
