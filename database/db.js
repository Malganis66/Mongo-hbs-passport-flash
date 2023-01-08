import mongoose from "mongoose";
mongoose.set('strictQuery', false)
import 'dotenv/config'
const mongo = mongoose;


const clientDB = mongo
     .connect(process.env.uri)
     .then((m)=>{
        console.log('works db');
        return m.connection.getClient()
     })
    .catch((error) => console.log('error db'));


export default clientDB