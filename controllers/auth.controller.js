import { nanoid } from "nanoid";
import { validationResult } from "express-validator";
import nodemailer from 'nodemailer';
import 'dotenv/config'
import User from "../models/User.js";

export const RegisterControllerForm = (req, res) => {
  res.render("register");
};

export const RegisterControllerUser = async (req, res) => {

  const errors = validationResult(req);
  if(!errors.isEmpty()){
    req.flash('messages', errors.array())
    return res.redirect('/auth/register')
  }

  const { userName, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) throw new Error("That user exists");
    if (await User.findOne({userName})) throw new Error('That username is not available')

    user = new User({ userName, email, password, tokenConfirm: nanoid() });
    await user.save();

    const transport = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.userEmail,
        pass: process.env.passEmail
      }
    });
    await transport.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      to: user.email, // list of receivers
      subject: "Verify your email please", // Subject line
      html: `<a href="${process.env.foldPath || 'http://localhost:3000'}/auth/confirm/${user.tokenConfirm}">Click here to verify</a>`, // html body
    })

    req.flash('messages', [{msg: 'Account created!, please confirm your account'}])
    res.redirect('/auth/login')
  } catch (error) {
    req.flash('messages', [{msg: error.message}]);
    return res.redirect('/auth/register')
  }
};

export const accountConfirmed = async (req, res) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({ tokenConfirm: token });
    if (!user) throw new Error("this user doesnt exist");
    user.accountConfirmed = true;
    user.tokenConfirm = null;
    await user.save();

    req.flash('messages', [{msg: 'Account confirmed, you can Log in'}])
    res.redirect("/auth/login");
  } catch (error) {
    req.flash('messages', [{msg: error.message}]);
    return res.redirect('/auth/login')
  }
};

export const LoginControllerForm = (req, res) => {
  res.render("login");
};

export const LoginControllerUser = async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    req.flash('messages', errors.array());
    return res.redirect('/auth/login')
  }

  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if(!user) throw new Error('This user doesnt exist')
    if(!user.accountConfirmed) throw new Error('verify account please')

    if(!await user.comparePassword(password))throw new Error('Please verify your email or password')

    req.login(user, function(err){
      if(err) throw new Error('Error creating session')
      return  res.redirect('/')
    })
  } catch (error) {
    req.flash('messages', [{msg: error.message}])
    return res.redirect('/auth/login')
  }
};

export const CloseSession = (req,res,next)=>{
  req.logout(function(err) {
    if (err) { return next(err); }
    return res.redirect('/auth/login')
  });
}
