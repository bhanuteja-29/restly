import { User } from "../models/user_model.js";

export const renderSignUp = (req,res)=>{
    res.render('../views/users/signup.ejs');
};

export const signUp = async(req,res)=>{
    try {
        let {username,email,password} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        req.login((registeredUser),(err)=>{
            if(err) {
                return next(err);
            }
            req.flash('success','User Registered Successfully.');
            res.redirect('/listings');
        })
    }catch(err) {
        req.flash('error',err.message);
        res.redirect('/signup');
    }
}

export const renderLogin = (req,res)=>{
    res.render('../views/users/login.ejs');
}

export const login = async(req,res)=>{
    req.flash('success','Welcome back to Restly');
    let redirectUrl = res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);
}

export const logout = (req,res,next)=>{
    req.logOut((err)=>{
        if(err) {
            next(err);
        }else {
            req.flash('success','You logged out successfully.');
            res.redirect('/listings');
        }
    })
}