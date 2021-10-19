const mongoose = require ('mongoose');

const equipmentSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,  // The Equipmet Title
    equipment_id: Number, // Custom Id type,weight,unque identifier
    type: String,   // The Equipment Type
    set: String,  
    vendor: String, // The name of the Equipement Vendor
    equipment_weight: String, // The weight of the Equipment
    tag: String, // A Tag associated with the equipment
    booking_status: String, // Is equipment booked
    reservation_status:  String, // Does Equipment have reservations
    image: {
        src: String,
        alt: String,
    },
    status: String, 
    condition: String,   // Needs repair/maintenance/Good/Check
    sku: String,
    barcode: String,


}, {timestamps: true});
module.exports = mongoose.model('Equipment', equipmentSchema);
