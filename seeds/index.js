const mongoose=require('mongoose');
const {places, descriptors}=require('./seedHelpers')
const Blog=require('../models/blog');

mongoose.connect('mongodb://127.0.0.1:27017/payParity',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db =mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once("open", ()=>{
    console.log("Database Connected")
});

const sample=array=>array[Math.floor(Math.random()*array.length)];

const seedDB = async()=>{
    await Blog.deleteMany({});
   for(let i=0; i< 50; i++){
    const blog=new Blog({
        author: "64f1b3d7afee1abaa9fe1c4b",
        title: `${sample(descriptors)} ${sample(places)}`,
        image: 'https://source.unsplash.com/collection/483251',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur nihil neque laboriosam, sit laborum dolorem, accusantium veniam rerum odio ipsa, esse magnam sunt doloribus dignissimos vel delectus laudantium similique aut!',
    })
    await blog.save();
   }
}
seedDB().then(()=>{
    mongoose.connection.close();
})