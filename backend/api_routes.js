
const express = require('express');
const router = express.Router();

// ****************************
const AdminRoute = require('./Routes/Admin/admin_route')
const AuthRoute = require('./Routes/Admin/auth_route')
const UserRoute = require('./Routes/FrontendSide/User/users_route')
const AddressRoute = require('./Routes/FrontendSide/User/address_route')
const WalletRoute = require('./Routes/FrontendSide/Wallet/wallet_route')
const SubAdminRoute = require('./Routes/Admin/subAdmin_route')
const RestaurantRoute = require('./Routes/BackendSide/Restaurant/restaurant_route')
const MealRoute = require('./Routes/BackendSide/Meal/meal_route')
const CustomizationRoute = require('./Routes/BackendSide/Meal/customization_route')

const TourTypeRoute = require('./Routes/FrontendSide/TourTypes/tour_types_route')
const ZoneRoute = require('./Routes/FrontendSide/Zones/zones_route')
const OrderRoute = require('./Routes/FrontendSide/Order/order_route')
const CategoryRoute = require('./Routes/BackendSide/Category/category_route')
const BannerRoute = require('./Routes/BackendSide/Banner/banner_route')
const SubscriptionRoute = require('./Routes/BackendSide/Subscription/subscription_route')
const SubscriptionHistoryRoute = require('./Routes/BackendSide/Subscription/subscription_history_route')
const WarningLabelRoute = require('./Routes/BackendSide/Warning-Label/warning_label')
const CountryRoute = require('./Routes/BackendSide/Country/country_route')
const StateRoute = require('./Routes/BackendSide/State/state_route')
const CityRoute = require('./Routes/BackendSide/City/city_route')
const AreaRoute = require('./Routes/BackendSide/Area/area_route')
const BlogsRoute = require('./Routes/FrontendSide/Blog/blog_route')
const MapZoneRoute = require('./Routes/Map/map_zone_route')
const MapPolygoneRoute = require('./Routes/Map/map_polygone_zone')
const CheckMapPolygoneRoute = require('./Routes/Map/check_map_polygone_zone')


router.use("/uploads", express.static("uploads"));

router.use("/admin", AdminRoute)
router.use("/auth", AuthRoute)

router.use("/user", UserRoute)
router.use("/user/address", AddressRoute)
router.use("/wallet", WalletRoute)
router.use("/restaurant", RestaurantRoute)
router.use('/subAdmin', SubAdminRoute)

router.use("/warningLabels", WarningLabelRoute)
router.use("/tourType", TourTypeRoute)
router.use("/category", CategoryRoute)
router.use("/banner", BannerRoute)
router.use("/subscription", SubscriptionRoute)
router.use("/subscriptionHistory", SubscriptionHistoryRoute)
router.use("/zone", ZoneRoute)
router.use("/country", CountryRoute)
router.use("/state", StateRoute)
router.use("/city", CityRoute)
router.use("/area", AreaRoute)
router.use("/meal", MealRoute)
router.use("/order", OrderRoute)
router.use("/meal/customization", CustomizationRoute)
router.use("/blogs", BlogsRoute)
router.use("/mapZone", MapZoneRoute)
router.use("/mapZone/polygone", MapPolygoneRoute)
router.use("/mapPolygon", CheckMapPolygoneRoute)

module.exports = router;