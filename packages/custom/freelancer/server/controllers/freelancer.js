/**
 * Created by akhil on 01-12-2015.
 */

'use strict';

var mongoose = require('mongoose'),
    FreelancerEmailsSchema = mongoose.model('freelancer_emails'),
    UserSchema = mongoose.model('User'),
    ProductSchema = mongoose.model('freelancer_products'),
    mean = require('meanio'),
    nodemailer = require('nodemailer'),
    templates = require('../template'),
    config = require('meanio').loadConfig(),
    _ = require('lodash');

exports.render = function(req, res) {
    res.render('index');
};

exports.getUserSentEmails = function(req,resMain){

    FreelancerEmailsSchema.find({user_id : req.user._id}, function(err,res){
        if(err){
            console.log(err);
            resMain.json({success: false});
        } else{
            resMain.json({success: true, emails : res});
        }
    }).sort({ created: -1 });
};

exports.createFreelancerProduct = function(req,resMain){
    req.body.user_id = req.user._id;
    req.body.username = req.user.name;

    var product_db = new ProductSchema(req.body);
    product_db.save(function(err,res) {
        if (err) {
            console.log(err);
            resMain.json({success: false});
        }
        else
        {
            resMain.json({success: true, product_object : res});
        }
    })
};

exports.createEmail = function(req,resMain){

    req.body.user_id = req.user._id;

    var freelancer_db = new FreelancerEmailsSchema(req.body);
    freelancer_db.save(function(err,res) {
        if (err) {
            console.log(err);
            resMain.json({success: false});
        }
        else
        {
            var mailOptions = {
                to: req.body.to_user,
                from: config.emailFrom
            };
            mailOptions = templates.notify_contrator(mailOptions,req.body);
            sendMail(mailOptions);
            resMain.json({success: true});
        }
    })
};


exports.getUserWorkerEmail = function(req,resMain){
    UserSchema.findOne({email : req.query.email}, function(err,res){
        if(err){
            console.log('err',err);
            resMain.json({success: false});
        } else{
            if(res != null){
                if((res.roles.indexOf('freelancer')!= -1) && (res.email != req.user.email)){
                    resMain.json({success: true, freelancer_object : res});
                }else{
                    resMain.json({success: false});
                }
            }else{
                resMain.json({success: false});
            }
        }
    })
};

exports.getSearchEmail =function(req,resMain){
    UserSchema.find({email : req.query.searchEmail_id.email}, function(err,res){

        if(err){
            console.log(err);
            resMain.json({success: false});
        } else{
            console.log(res);
            resMain.json({success: true});
        }
    })

};

function sendMail(mailOptions) {
    var transport = nodemailer.createTransport(config.mailer);
    transport.sendMail(mailOptions, function(error, success) {
        if (error) console.log(error);
        else console.log(success);
    });
}