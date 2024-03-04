const Booking = require('../models/Booking');
const MassageShop = require('../models/MassageShop');

//@desc     Get all bookings
//@route    GET /api/v1/bookings
//@access   Public
exports.getBookings=async (req,res,next)=>{
    let query;
    //General users can see only their bookings!
    if(req.user.role !== 'admin'){
        query=Booking.find({user:req.user.id}).populate({
            path: 'massageShop',
            select: 'name province tel'
        });
    }else { //If you are an admin, you can see all booking!

        if(req.params.massageId){

            console.log(req.params.massageId);

            query = Booking.find({ massageShop:req.params.massageId}).populate({
                path: 'massageShop',
                select: 'name province tel'
            });
        }else 
            
        query = Booking.find().populate({
            path: 'massageShop',
            select: 'name province tel'
        });

    }
    try {
        const bookings= await query;

        res.status(200).json({
            success:true,
            count:bookings.length,
            data: bookings
        });
    } catch(err){
        console.log(err.stack);
        return res.status(500).json({
            success:false,
            message:"Cannot find Booking"
        });
    }
};

//@desc     Get single booking
//@route    GET /api/v1/bookings/:id
//@access   Public
exports.getBooking=async (req,res,next)=>{
    try {
        const booking=await Booking.findById(req.params.id).populate({
            path:'massageShop',
            select:'name description tel'
        });

        if(!booking){
            return res.status(404).json({success:false,message:`No booking with the id of ${req.params.id}`});
        }

        res.status(200).json({
            success:true,
            data: booking
        });
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({success:false,message:"Cannot find Booking"});
    }
};

//@desc     Add booking
//@route    POST /api/v1/bookings/:massageId/booking
//@access   Private
exports.addBooking=async (req,res,next)=>{
    try{

        req.body.massageShop=req.params.massageId;

        const massageShop= await MassageShop.findById(req.params.massageId);

        if(!massageShop){
            return res.status(404).json({success:false,message:`No massageShop with id of ${req.params.massageId}`});
        }

        //add user Id to req.body
        req.body.user=req.user.id;

        //Check for existed booking
        const existedBooking=await Booking.find({user:req.user.id});

        //If the user is not an admin, they can only create 3 bookings
        if(existedBooking.length >= 3 && req.user.role !== 'admin'){
            return res.status(400).json({success:false,message:`The user with ID ${req.user.id} has already made 3 booking`});
        }

        const booking = await Booking.create(req.body);

        res.status(200).json({success:true,data: booking});
    } catch (err){
        console.log(err.stack);

        return res.status(500).json({success:false,message:"Cannot Create Booking"});
    }
};

//@desc     Update booking
//@route    PUT /api/v1/bookings/:id
//@access   Private
exports.updateBooking=async (req,res,next)=>{
    try{
        let booking= await Booking.findById(req.params.id);

        if(!booking){
            return res.status(404).json({success:false, message:`No booking with the id of ${req.params.id}`});
        }

        //Make sure user is the booking owner
        if(booking.user.toString()!==req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({success:false,message:`User ${req.user.id} is not authorized to update this booking`});
        }

        booking=await Booking.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });

        res.status(200).json({
            success:true,
            data: booking
        });
    } catch(err){
        console.log(err.stack);
        
        return res.status(500).json({success:false,message:'Cannot update Booking'});
    }
};

//@desc     Delete booking
//@route    DELETE /api/v1/booking/:id
//@access   Private
exports.deleteBooking=async (req,res,next)=>{
    try{
        const booking=await Booking.findById(req.params.id);

        if(!booking){
            return res.status(404).json({success:false,message:`No booking with the id of ${req.params.id}`});
        }
        //Make sure user is the booking owner
        if(booking.user.toString()!==req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({success:false,message:`User ${req.user.id} is not authorized to delete this booking`});
        }

        await Booking.deleteOne();

        res.status(200).json({
            success:true,
            data: {}
        });

    }catch(err){
        console.log(err.stack);
        return rs.status(500).json({success:false,message:"Cannot delete Booking"});
    }
};