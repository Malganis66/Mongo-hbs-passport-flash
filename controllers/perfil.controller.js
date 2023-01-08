import formidable from 'formidable';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import Jimp from 'jimp';
import User from '../models/User.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const FormPerfil = async(req,res)=>{
    try {
        const user = await User.findById(req.user.id)
        return res.render('perfil', {user: req.user, image: user.image})
    } catch (error) {
        req.flash('messages', [{msg: 'Error reading the user'}]);
        return res.redirect('/perfil')
    }
}

export const ChangePerfilImg = async(req,res)=>{
    const form = new formidable.IncomingForm(options=> options.maxFileSize(10 * 1024 * 1024))

    form.parse(req, async(err, fields, files)=>{
        try {
            if(err) throw new Error('image upload has failed')
            const file = files.myFile;
            if(file.originalFilename === "") {
                throw new Error('Introduce an image please')
            }
            if(!(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')){
                throw new Error('Invalid mimetype has been introduced, choose a .png or .jpeg file')
            }
            if(file.size > 10*1024*1024) throw new Error('The image exceeds 10MB')
            const extension = file.mimetype.split('/')[1]
            const dirFile = path.join(__dirname, `../public/img/perfils/${req.user.id}.${extension}`)
            fs.renameSync(file.filepath, dirFile)

            const img = await Jimp.read(dirFile)
            img.resize(200, 200).quality(80).writeAsync(dirFile)

            const user = await User.findById(req.user.id)
            user.image = `${req.user.id}.${extension}`
            await user.save()
            req.flash('messages', [{msg: 'The image has been uploaded'}]);
        } catch (error) {
            console.log(error);
            req.flash('messages', [{msg: error.message}]);
        } finally {
            return res.redirect('/perfil')
        }
    })
}