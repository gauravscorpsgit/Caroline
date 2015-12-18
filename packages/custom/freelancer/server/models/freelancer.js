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

var FreelancerEmailsSchema = new Schema({
    user_id:{
        type: Number,
        required: true
    },
    recipient_id :{
        type: Number,
        required: true,
        default: 1
    },
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
    },created: {
        type: Date,
        default: Date.now
    },
    requirement:{
        type: String,
        required: true
    }
});

FreelancerEmailsSchema.plugin(autoIncrement.plugin, 'freelancer_emails');
mongoose.model('freelancer_emails', FreelancerEmailsSchema);
