const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path')
require('dotenv').config();


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

const axios = require('axios');

// const admin = require('firebase-admin');

// const serviceAccount = require('./notties-pantry-firebase-adminsdk-hhlur-eb8957b269.json');

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });


const app = express();
app.use(cors());
app.use(express.json());
express.urlencoded({ extended: true })
app.use(bodyParser.json())
// app.use(express.static('static'))

mongoose
    .connect(process.env.DATABASE_URL, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB: ', error);
    });



// const port = process.env.PORT;
const port = process.env.PORT;
const ipAddress = process.env.IP_ADDRESS;

app.use("/imageUploads", express.static("imageUploads"));
// app.use("/videoUploads", express.static("videoUploads"));

app.use("/uploads", express.static("uploads"));

app.use("/admin", AdminRoute)
app.use("/auth", AuthRoute)

app.use("/user", UserRoute)
app.use("/user/address", AddressRoute)
app.use("/wallet", WalletRoute)
app.use("/restaurant", RestaurantRoute)
app.use('/subAdmin', SubAdminRoute)

app.use("/warningLabels", WarningLabelRoute)
app.use("/tourType", TourTypeRoute)
app.use("/category", CategoryRoute)
app.use("/banner", BannerRoute)
app.use("/subscription", SubscriptionRoute)
app.use("/subscriptionHistory", SubscriptionHistoryRoute)
app.use("/zone", ZoneRoute)
app.use("/country", CountryRoute)
app.use("/state", StateRoute)
app.use("/city", CityRoute)
app.use("/area", AreaRoute)
app.use("/meal", MealRoute)
app.use("/order", OrderRoute)
app.use("/meal/customization", CustomizationRoute)
app.use("/blogs", BlogsRoute)
app.use("/mapZone", MapZoneRoute)
app.use("/mapZone/polygone", MapPolygoneRoute)
app.use("/mapPolygon", CheckMapPolygoneRoute)


app.listen(port, () => {
    console.log(`Server listening on ${ipAddress}:${port}`);
});


