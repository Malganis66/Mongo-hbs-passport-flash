import {Schema,model} from 'mongoose';
import { nanoid } from 'nanoid';

const UrlSchema = new Schema({
    origin: {
        type: String,
        unique: true,
        required: true
    },
    shortURL: {
        type: String,
        unique: true,
        required: true,
        default: nanoid(6)
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
    
})

const Url = model('Url',UrlSchema)

export default Url