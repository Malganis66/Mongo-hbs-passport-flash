import {Schema, model} from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema({
    userName: {
        type: String,
        lowercase: true,
        required: true,
        unique: true
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        index: {unique: true}
    },
    password: {
        type: String,
        required: true
    },
    tokenConfirm: {
        type: String,
        default: null
    },
    accountConfirmed: {
        type: Boolean,
        default: false
    },
    image: {
        type: String,
        default: null
    }
})

UserSchema.pre('save', async function(next){
    const user = this;
    if(!user.isModified('password')) return next()

    try {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(user.password, salt)

        user.password = hash
        next()
    } catch (error) {
        console.log(error);
        throw new Error('error coding the password')
    }
})

UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
};

export default model('User',UserSchema)