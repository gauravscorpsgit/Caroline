/**
 * Created by akhil on 01-12-2015.
 */

'use strict';

var mongoose = require('mongoose'),
    FreelancerEmailsSchema = mongoose.model('freelancer_emails'),
    UserSchema = mongoose.model('User'),
    ProductSchema = mongoose.model('freelancer_products'),
    Freelancer_DetailsSchema = mongoose.model('freelancer_landing'),
    OrderSchema = mongoose.model('freelancer_order'),
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
            resMain.json({success: true});
            var mailOptions = {
                to: req.body.to_user,
                from: config.emailFrom
            };
            mailOptions = templates.notify_contrator(mailOptions,req.body);
            sendMail(mailOptions);
        }
    })
};


exports.getUserWorkerEmail = function(req,resMain){
    UserSchema.findOne({email : req.query.email}, function(err,res){
        if(err){
            console.log('err',err);
            resMain.json({success: false});
        } else{
            console.log(res);
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


exports.getFreelancerEmail =function(req,resMain){
    UserSchema.find({roles : 'freelancer'}, function(err,res){
        if(err){
            console.log(err);
            resMain.json({success: false});
        } else{
            resMain.json({success: true, freelancer_object :res});
        }
    })
};

exports.putWorker = function(req, resMain){
    Freelancer_DetailsSchema.findOneAndUpdate(
        {$and :[{user_id: req.user._id},{coworkers:{$nin:[req.body.freelancer_id]}}]},
        {$push: {coworkers: req.body.freelancer_id}},
        {safe: true},function(err, res) {
            if(err){
                console.log(err);
                resMain.json({success: false});
            }
            else{
                console.log(res);
                if(res != null){

                    var mailOptions = {
                        to: req.body.freelancer_email,
                        from: config.emailFrom
                    };
                    mailOptions = templates.co_worker_Mail(mailOptions,req.body);
                    sendMail(mailOptions);

                    resMain.json({success: true, status : 0});
                }else{
                    resMain.json({success: true, status : 1});
                }
            }
        });
};

exports.getSearchEmail =function(req,resMain){
    UserSchema.find({roles : 'contractor'}, function(err,res){
        if(err){
            console.log(err);
            resMain.json({success: false});
        } else{
            resMain.json({success: true, contrator_list :res});
        }
    })

};

exports.createOrder = function(req,resMain){

    if(req.user != undefined){
        if(req.user.roles.indexOf('freelancer') != -1){
            req.body.freelancer_id = req.user._id;
            req.body.customer_id = req.user._id;
        }else{
            req.body.customer_id = req.user._id;
        }
    }


    var order_db = new OrderSchema(req.body);
    order_db.save(function(err,res) {
        if (err) {
            console.log(err);
            resMain.json({success: false});
        }
        else
        {
            resMain.json({success: true, order_object : res});
        }
    })
};

exports.updateOrderId = function(req,resMain) {
    console.log(req.body.order_id);
    OrderSchema.findOneAndUpdate({_id: req.body.order_id}, {paymentStatus: req.body.state}, function(err,res){
        if (err) {
            console.log(err);
            resMain.json({success: false});
        }
        else
        {
            console.log(res);
            if(req.body.state == 'Success'){
                UserSchema.findById(res.freelancer_id, function(err,user){
                    if(err){
                        console.log(err);
                    }else{
                        var mailOptions = {
                            to: req.user.email,
                            bcc: user.email,
                            from: config.emailFrom
                        };
                        mailOptions = templates.co_worker_Mail(mailOptions,req.body);
                        sendMail(mailOptions);
                    }
                });
            }
            else{
                var mailOptions = {
                    to: req.user.email,
                    from: config.emailFrom
                };
                mailOptions = templates.paypalFail_Mail(mailOptions,req.body);
                sendMail(mailOptions);
            }
            resMain.json({success: true, order_object : res});
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