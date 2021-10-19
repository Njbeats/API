const mongoose = require ('mongoose');

const packageSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    title: { type: String, trim: true, required: true, unique: true, index: true },

    details: {
        wired_desktop_mics_min: { type: Number, trim: true, required: true, minlength: 1, min:0, },
        wired_desktop_mics_max: { type: Number, trim: true, required: true, minlength: 1, min:0, },
        cordless_mics: { type: Number, required: true, minlength: 1, min:0, },
        speakers_min:{ type: Number, trim: true, required: true, minlength: 1, min: 0, },
        speakers_max: { type: Number,  min:0, required: true, minlength: 1 },
    },

    price:{
        amount: { type: Number, trim: true, required: [true, 'Price is Required'], },
        currency: { type: String, default: 'ZMW', enum: ['ZMW'] },        
    },
    description: { type: String, required: true, },
    equipment: [{ type: mongoose.Schema.ObjectId, ref: 'Equipment' }],    

}, 
  { timestamps: true });

module.exports = mongoose.model('package', packageSchema);
