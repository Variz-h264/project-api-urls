const { Schema, model } = require('mongoose')

const shorturlSchema = new Schema({
    o_url: { type: String, required: true },
    s_url: { type: String, required: true, unique: true, min: 8},
    c_url: { type: String },
    ip: { type: String, min: 18 },
    usetime: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: null }
});

const shorturl = model('short_urls', shorturlSchema);

module.exports = shorturl