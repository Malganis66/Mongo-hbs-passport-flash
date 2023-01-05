import mongoose from "mongoose";
mongoose.set('strictQuery', false)
const mongo = mongoose;

try {
    await mongo.connect(process.env.uri)
    console.log('works db');
} catch (error) {
    console.log('error db');
}