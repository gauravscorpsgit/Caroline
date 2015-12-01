/**
 * Created by akhil on 01-12-2015.
 */

'use strict';


var mongoose = require('mongoose'),
    FreelancerSchema = mongoose.model('freelancer'),
    mean = require('meanio'),
    config = require('meanio').loadConfig(),
    _ = require('lodash');

exports.render = function(req, res) {
    res.render('index');
};

exports.createEmail = function(req,resMain){
    var freelancer_db = new FreelancerSchema(req.body);
    freelancer_db.save(function(err,res) {
        if (err) {
            console.log(err);
            resMain.json({success: false});
        }
        else
        {
            resMain.json({success: true});
        }
    })

};
