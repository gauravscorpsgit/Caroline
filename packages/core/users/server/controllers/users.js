'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Freelancer_landing = mongoose.model('freelancer_landing'),
    async = require('async'),
    config = require('meanio').loadConfig(),
    crypto = require('crypto'),
    nodemailer = require('nodemailer'),
    templates = require('../template'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'); //https://npmjs.org/package/node-jsonwebtoken



/**
 * Send reset password email
 */
function sendMail(mailOptions) {
    var transport = nodemailer.createTransport(config.mailer);
    transport.sendMail(mailOptions, function(err, response) {
        if (err) return err;
        return response;
    });
}



module.exports = function(MeanUser) {
    return {
        /**
         * Auth callback
         */
        authCallback: function(req, res) {
            var payload = req.user;
            var escaped = JSON.stringify(payload);
            escaped = encodeURI(escaped);
            // We are sending the payload inside the token
            var token = jwt.sign(escaped, config.secret, { expiresInMinutes: 60*5 });
            res.cookie('token', token);
            var destination = config.strategies.landingPage;
            if(!req.cookies.redirect)
                res.cookie('redirect', destination);
            res.redirect(destination);
        },

        /**
         * Show login form
         */
        signin: function(req, res) {
            if (req.isAuthenticated()) {
                return res.redirect('/');
            }
            res.redirect('/login');
        },

        /**
         * Logout
         */
        signout: function(req, res) {

            MeanUser.events.publish({
                action: 'logged_out',
                user: {
                    name: req.user.name
                }
            });

            req.logout();
            res.redirect('/');
        },

        /**
         * Session
         */
        session: function(req, res) {
            res.redirect('/');
        },

        /**
         * Create user
         */
        create: function(req, res, next) {
            var user = new User(req.body);

            user.provider = 'local';

            // because we set our user.provider to local our models/user.js validation will always be true
            req.assert('name', 'You must enter a name').notEmpty();
            req.assert('email', 'You must enter a valid email address').isEmail();
            req.assert('password', 'Password must be between 8-20 characters long').len(8, 20);
            req.assert('username', 'Username cannot be more than 20 characters').len(1, 20);
            req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

            var errors = req.validationErrors();
            if (errors) {
                return res.status(400).send(errors);
            }

            // Hard coded for now. Will address this with the user permissions system in v0.3.5
            user.roles = ['authenticated',req.body.userType];
            user.save(function(err, resSave) {
                if (err) {
                    switch (err.code) {
                        case 11000:
                        case 11001:
                            res.status(400).json([{
                                msg: 'Username already taken',
                                param: 'username'
                            }]);
                            break;
                        default:
                            var modelErrors = [];

                            if (err.errors) {

                                for (var x in err.errors) {
                                    modelErrors.push({
                                        param: x,
                                        msg: err.errors[x].message,
                                        value: err.errors[x].value
                                    });
                                }

                                res.status(400).json(modelErrors);
                            }
                    }
                    return res.status(400);
                }

                var payload = user;
                payload.redirect = req.body.redirect;
                var escaped = JSON.stringify(payload);
                escaped = encodeURI(escaped);
                req.logIn(user, function(err) {
                    if (err) { return next(err); }

                    MeanUser.events.publish({
                        action: 'created',
                        user: {
                            name: req.user.name,
                            username: user.username,
                            email: user.email
                        }
                    });
                    if(resSave){
                        if(req.body.userType == 'freelancer'){
                            var landing_schema = {
                                user_id : resSave._id,
                                user_intro: {
                                    profile_image:'freelancer/assets/freelancer/img/user.png',
                                    Hi_message:'Hi, I am Stanley!',
                                    Hi_description:'Hello everybody. I am Stanley, a free handsome bootstrap theme coded by BlackTie.co. A really simple theme for those wanting to showcase their work with a cute & clean style.'
                                },
                                user_positives : {
                                    one:'Good Learner',
                                    two:'Highly Motivated',
                                    three:'Curious to learn new technologies',
                                    four :'Enjoys challenges'
                                },
                                user_thinking : 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.',
                                user_skills : [
                                    {name : 'Wordpress', percentage : 50},
                                    {name : 'Photoshop', percentage : 50},
                                    {name : 'HTML + CSS', percentage : 50},
                                ],
                                portfolio : [],
                                footer : {
                                    header : 'About Stanley',
                                    description :'Hey I am stanley and learn more about me by working with me.'
                                },
                                products:[],
                                coworkers:[]
                            };
                            console.log(landing_schema);
                            var freelancer_landing = new Freelancer_landing(landing_schema);
                            freelancer_landing.save();
                        }
                    }
                    // We are sending the payload inside the token
                    var token = jwt.sign(escaped, config.secret, { expiresInMinutes: 60*5 });
                    res.json({
                        token: token,
                        redirect: config.strategies.landingPage
                    });
                });
                res.status(200);
            });
        },
        /**
         * Send User
         */
        me: function(req, res) {
            if (!req.user || !req.user.hasOwnProperty('_id')) return res.send(null);

            User.findOne({
                _id: req.user._id
            }).exec(function(err, user) {

                if (err || !user) return res.send(null);


                var dbUser = user.toJSON();
                var id = req.user._id;

                delete dbUser._id;
                delete req.user._id;

                var eq = _.isEqual(dbUser, req.user);
                if (eq) {
                    req.user._id = id;
                    return res.json(req.user);
                }

                var payload = user;
                var escaped = JSON.stringify(payload);
                escaped = encodeURI(escaped);
                var token = jwt.sign(escaped, config.secret, { expiresInMinutes: 60*5 });
                res.json({ token: token });

            });
        },

        /**
         * Find user by id
         */
        user: function(req, res, next, id) {
            User.findOne({
                _id: id
            }).exec(function(err, user) {
                if (err) return next(err);
                if (!user) return next(new Error('Failed to load User ' + id));
                req.profile = user;
                next();
            });
        },

        /**
         * Resets the password
         */

        resetpassword: function(req, res, next) {
            User.findOne({
                resetPasswordToken: req.params.token,
                resetPasswordExpires: {
                    $gt: Date.now()
                }
            }, function(err, user) {
                if (err) {
                    return res.status(400).json({
                        msg: err
                    });
                }
                if (!user) {
                    return res.status(400).json({
                        msg: 'Token invalid or expired'
                    });
                }
                req.assert('password', 'Password must be between 8-20 characters long').len(8, 20);
                req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
                var errors = req.validationErrors();
                if (errors) {
                    return res.status(400).send(errors);
                }
                user.password = req.body.password;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;
                user.save(function(err) {

                    MeanUser.events.publish({
                        action: 'reset_password',
                        user: {
                            name: user.name
                        }
                    });

                    req.logIn(user, function(err) {
                        if (err) return next(err);
                        return res.send({
                            user: user
                        });
                    });
                });
            });
        },
        updateLanding : function(req,resMain){
            var freelancer_landing = new Freelancer_landing(req.body);
            Freelancer_landing.findOneAndUpdate({user_id : req.user._id},freelancer_landing,function(err,res){
                if(err){
                    console.log(err);
                    resMain.json({success : false});
                }else{
                    resMain.json({success : true});
                }
            });
        },
        getFreelancerLanding : function (req,resMain) {
            Freelancer_landing.find({user_id : req.user._id}, function(err,res){

                if(err){
                    console.log(err);
                    resMain.json({success: false});
                } else{
                    resMain.json({success: true, freelancer_object : res});
                }

            });
        },
        getFreelancerStorefront : function (req,resMain) {
            Freelancer_landing.find({user_id : req.query.freelancerId}, function(err,res){
                if(err){
                    console.log(err);
                    resMain.json({success: false});
                } else{
                    resMain.json({success: true, freelancer_object : res});
                }
            });
        },

        /**
         * Callback for forgot password link
         */
        forgotpassword: function(req, res, next) {
            async.waterfall([

                    function(done) {
                        crypto.randomBytes(20, function(err, buf) {
                            var token = buf.toString('hex');
                            done(err, token);
                        });
                    },
                    function(token, done) {
                        User.findOne({
                            $or: [{
                                email: req.body.text
                            }, {
                                username: req.body.text
                            }]
                        }, function(err, user) {
                            if (err || !user) return done(true);
                            done(err, user, token);
                        });
                    },
                    function(user, token, done) {
                        user.resetPasswordToken = token;
                        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
                        user.save(function(err) {
                            done(err, token, user);
                        });
                    },
                    function(token, user, done) {
                        var mailOptions = {
                            to: user.email,
                            from: config.emailFrom
                        };
                        mailOptions = templates.forgot_password_email(user, req, token, mailOptions);
                        sendMail(mailOptions);
                        done(null, user);
                    }
                ],
                function(err, user) {

                    var response = {
                        message: 'Mail successfully sent',
                        status: 'success'
                    };
                    if (err) {
                        response.message = 'User does not exist';
                        response.status = 'danger';

                    }
                    MeanUser.events.publish({
                        action: 'forgot_password',
                        user: {
                            name: req.body.text
                        }
                    });
                    res.json(response);
                });
        }
    };
}

