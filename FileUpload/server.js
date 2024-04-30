import express from 'express';
import mongoose from 'mongoose';
import path from 'path'
import multer  from 'multer';
import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: 'dhiae3kcg', 
  api_key: '355963177232298', 
  api_secret: 'BQD7p0ZC38a5kHyp3_Zliba68ds' 
});


const app = express();

    mongoose.connect("mongodb://localhost:27017/fileupload").then((data)=>{
    console.log(`mongoDB connected ${data.connection.port}`)
}).catch((err)=>{
    console.log(err)
})

    // multer section
    const storage = multer.diskStorage({
    // This is for save in the project files images if you need to store in cloudnary or any other server then comment no 16
    //destination: './public/uploads',
    
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  })
  
  const upload = multer({ storage: storage })

 const fileSchema = new mongoose.Schema({
    filename:String,
    public_id:String,
    imgUrl:String
 });
 const File  = mongoose.model("Cloudinary",fileSchema)


app.get('/', (req,res)=>{
    res.render("index.ejs", {url:null})
})

app.post('/upload', upload.single("file"), async (req, res) => {
    console.log("This is my file", req.file)
    const file = req.file.path;

    const cloudinaryResponse = await cloudinary.uploader.upload(file, {
        folder: "NodeJs_Express_API_Series",
      });

    const savetodb = await File.create({
        filename:file.originalname,
        public_id:cloudinaryResponse.public_id,
        imgUrl:cloudinaryResponse.secure_url,
    })
    console.log("Cloudinary Response", cloudinaryResponse.savetodb)
    res.render("index.ejs", {url:cloudinaryResponse.secure_url})  
    
  })

app.listen(2600, ()=> console.log("Server is listen on poty 2600"));

