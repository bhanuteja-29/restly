import express from 'express';
import { wrapAsync } from '../utils/wrapasync.js';
import passport from 'passport';
import { saveRedirectURL } from '../middleware.js';
import { login, logout, renderLogin, renderSignUp, signUp } from '../controller/user.js';
export const router = express.Router();

router
    .route('/signup')
    .get(renderSignUp)
    .post(wrapAsync(signUp))

router
    .route('/login')
    .get(renderLogin)
    .post(saveRedirectURL,passport.authenticate('local',{failureRedirect:'/login',failureFlash:true}),wrapAsync(login))

router.get('/logout',logout);


