const express=require('express');
const {getMassageShops, getMassageShop, createMassageShop, updateMassageShop, deleteMassageShop, getMassageCenters} = require('../controllers/massageShops');

//Include other resource routers
const bookingRouter=require('./bookings');

const router=express.Router();

const {protect, authorize} = require('../middleware/auth');

//Re-route into other resource routers
router.use('/:massageId/bookings/',bookingRouter);

router.route('/massageCenters').get(getMassageCenters);

router.route('/').get(getMassageShops).post(protect, authorize('admin'), createMassageShop);
router.route('/:id').get(getMassageShop).put(protect, authorize('admin'), updateMassageShop).delete(protect, authorize('admin'), deleteMassageShop);

module.exports=router;