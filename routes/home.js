import {Router} from 'express';
import { addUrl, editUrl, editUrlForm, eliminateUrl, readUrls, redirection } from '../controllers/home.controller.js';
import { ChangePerfilImg, FormPerfil } from '../controllers/perfil.controller.js';
import { authenticateUser } from '../middlewares/authenticUser.js';
import { ValidUrl } from '../middlewares/ValidUrl.js';
const router = Router()

router.get('/',authenticateUser,readUrls)
router.post('/',authenticateUser, ValidUrl, addUrl)
router.get('/eliminate/:id',authenticateUser,eliminateUrl)
router.get('/edit/:id',authenticateUser,editUrlForm)
router.post('/edit/:id',authenticateUser,ValidUrl,editUrl)

router.get('/perfil',authenticateUser,FormPerfil)
router.post('/perfil',authenticateUser,ChangePerfilImg)

router.get('/:shortURL',redirection)

export default router;
