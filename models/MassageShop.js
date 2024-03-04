const mongoose = require('mongoose');

const MassageShopSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true,'Please add a name'],
        unique: true,
        trim: true,
        maxlength:[50,'Name can not be more than 50 characters']
    },
    address: {
        type: String,
        require: [true,'Please add an address']
    },
    
    tel: {
        type: String,
    },
    open_close_time: {
        type: String,
        require: [true,'Please add an open-close time']
    }
},  {
    toJSON: {virtuals:true},
    toObject:{virtuals:true}
});

//Reverse populate with virtuals
MassageShopSchema.virtual('bookings',{
    ref: 'Booking',
    localField: '_id',
    foreignField:'massageShop',
    justOne:false
});

//Cascade delete bookings when a massageShop is deleted
MassageShopSchema.pre('deleteOne',{ document: true, query: false}, async function(next){
    console.log(`Bookings being removed from massageShop ${this._id}`);
    await this.model('Booking').deleteMany({massageShop: this._id});
    next();
});

module.exports=mongoose.model('MassageShop',MassageShopSchema);