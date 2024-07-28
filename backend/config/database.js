import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const dbConnect = () => {
    mongoose.connect(process.env.MONGODB_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {console.log("MONGODB Connected successfully in database.js")})
    .catch((error) => {
        console.log("DB Connection failed in database.js, something went wrong");
        console.error(error);
        process.exit(1);
    });
}

export default dbConnect;