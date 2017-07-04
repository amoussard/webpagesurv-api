var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    url: { type: String, required: true },
    cron: { type: String, required: true },
    text: { type: String, required: true },
    changed: { type: Boolean, required: true }
});

module.exports = mongoose.model('Watch', schema);