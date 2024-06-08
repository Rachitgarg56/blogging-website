const express = require('express');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');
const { default: mongoose } = require('mongoose');

const authMiddleware = require('./middlewares/auth');

const app = express();

app.use(express.json());

mongoose.connect('mongodb://0.0.0.0:27017/blogApp')
.then(() => console.log('DB connected successfully')) 
.catch(err => console.log(err))

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/posts', authMiddleware, postRoutes);

app.listen(8080, () => {
    console.log('Server is up and running on PORT 8080');
})