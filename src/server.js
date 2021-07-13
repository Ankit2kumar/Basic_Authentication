import express from 'express';
import mongoose from 'mongoose';
import listEndpoints from 'express-list-endpoints';
import blogsRouter from './services/blogPosts/index.js';

const server = express();
const port = process.env.PORT || 3001;

//**************** MIDDLEWARES******************

server.use(express.json());

//*********************** ROUTES *********************
server.use('/blogs', blogsRouter);
// *********************** ERROR HANDLERS *************************

console.table(listEndpoints(server));

mongoose.connect(process.env.MONGO_CONNECTION, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

mongoose.connection.on('Server Is Ready', () => {
	server.listen(port, () => {
		console.log('Server running on port ', port);
	});
});

mongoose.connection.on('error', (err) => {
	console.log('Mongo connection error ', err);
});
