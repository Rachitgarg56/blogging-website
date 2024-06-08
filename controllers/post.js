
const listPosts = async (req,res) => {
    
    res.json({
        msg: 'Retrieve posts api',
    })
}

const createPost = async (req,res) => {
    res.json({
        msg: 'Dummy create post api',
    })
}

const postController = {
    listPosts,
    createPost,
}

module.exports = postController;
