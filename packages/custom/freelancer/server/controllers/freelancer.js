/**
 * Created by akhil on 01-12-2015.
 */

'use strict';

var mongoose = require('mongoose'),
    FreelancerEmailsSchema = mongoose.model('freelancer_emails'),
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
    });
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
function sendMail(mailOptions) {
    var transport = nodemailer.createTransport(config.mailer);
    transport.sendMail(mailOptions, function(error, success) {
        if (error) console.log(error);
        else console.log(success);
    });
}