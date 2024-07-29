import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import dbConnect from './config/database.js';
import userRouter from './routes/user.route.js';
import folderRouter from './routes/folder.route.js';
import fileRouter from './routes/file.route.js';
import cloudinaryConnect from './config/cloudinary.js';

const app = express();
dotenv.config();
const port = process.env.PORT || 3000;

dbConnect();
cloudinaryConnect();

app.use(cors({
  origin: JSON.parse(process.env.CLIENT_URL),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}))

app.use(express.json())
// app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use(
  fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/",
  })
)


app.get('/', (_, res) => {
  res.send('Hello World!')
})

app.get('/health-check', (_, res) => {
  return res.status(200).json({
    message: "Server is running ❤️"
  })
})

app.use("/api/v1/users", userRouter);
app.use("/api/v1/folders", folderRouter);
app.use("/api/v1/files", fileRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})