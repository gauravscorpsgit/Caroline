/**
 * Created by Gaurav on 12/4/2015.
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
var FreelancerLandingSchema = new Schema({
    user_id:{
        type: Number,
        required: true
    },
    user_intro:{
        type: Object,
        required: false
    },
    user_positives:{
        type: Object,
        required: false
    },
    user_thinking :{
        type: String,
        required: false
    },
    user_skills :{
        type: Object,
        required: false
    },
    portfolio :{
        type: Object,
        required: false
    },
    created: {
        type: Date,
        default: Date.now
    }
});

FreelancerLandingSchema.plugin(autoIncrement.plugin, 'freelancer_landing');
mongoose.model('freelancer_landing', FreelancerLandingSchema);