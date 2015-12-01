/**
 * Created by akhil on 01-12-2015.
 */
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    autoIncrement = require('mongoose-auto-increment'),
    config = require('meanio').loadConfig(),
    Schema = mongoose.Schema;


var connection = mongoose.createConnection(config.db);

autoIncrement.initialize(connection);

var FreelancerSchema = new Schema({
    to_user:{
        type: Object,
        required: true
    },
    subject:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    }

});

FreelancerSchema.plugin(autoIncrement.plugin, 'freelancer');
mongoose.model('freelancer', FreelancerSchema);
