import Url from '../models/Url.js';

export const readUrls = async (req,res)=>{
    try {
        const urls = await Url.find({user: req.user.id}).lean()
        res.render('home',{urls})
    } catch (error) {
        req.flash('messages', [{msg: error.message}]);
        return res.redirect('/')
    }
}

export const addUrl = async (req,res)=>{
    const {origin} = req.body
    try {
        const url = new Url({origin, user: req.user.id});
        await url.save()

        req.flash('messages', [{msg: 'URL saved'}])
        res.redirect('/')
    } catch (error) {
        req.flash('messages', [{msg: error.message}]);
        return res.redirect('/')
    }
}

export const eliminateUrl = async (req,res)=>{
    const {id} = req.params
    try {
        // await Url.findByIdAndDelete(id)
        const url = await Url.findById(id)
        if(!url.user.equals(req.user.id)){
            throw new Error('This isnt your url')
        }

        await url.remove()
        req.flash('messages', [{msg: 'URL removed'}])
        res.redirect('/')
    } catch (error) {
        req.flash('messages', [{msg: error.message}]);
        return res.redirect('/')
    }
}

export const editUrlForm = async(req,res)=>{
    const {id} = req.params
    try {
        const url = await Url.findById(id).lean();
        if(!url.user.equals(req.user.id)){
            throw new Error('This isnt your url')
        }
        res.render('home',{url})
    } catch (error) {
        req.flash('messages', [{msg: error.message}]);
        return res.redirect('/')
    }
}

export const editUrl = async(req,res)=>{
    const {id} = req.params
    const {origin} = req.body
    try {
        const url = await Url.findById(id);
        if(!url.user.equals(req.user.id)){
            throw new Error('This isnt your url')
        }
        await url.updateOne({origin})
        req.flash('messages', [{msg: 'URL edited'}])
        // await Url.findByIdAndUpdate(id, {origin})
        res.redirect('/')
    } catch (error) {
        req.flash('messages', [{msg: error.message}]);
        return res.redirect('/')
    }
}

export const redirection = async (req,res)=>{
    const {shortURL} = req.params
    try {
        const url = await Url.findOne({shortURL})
        res.redirect(url.origin)
    } catch (error) {
        req.flash('messages', [{msg: 'Not valid URL'}]);
        return res.redirect('/auth/login')
    }
}

  
