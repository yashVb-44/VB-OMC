import { combineReducers } from 'redux'
import CategoryDataChange from './BackendReducers/CategoryReducer'
import BannerDataChange from './BackendReducers/BannerReducer'
import DataChange from './BackendReducers/DataReducer'
import { VariationSizeDataChange, VariationDataChange } from './BackendReducers/VariationReducer'
import ProductDataChange from './BackendReducers/ProductReducer'
import { UserDataChange, ShowUserCartData } from './FrontendReducers/UserReducers'
import CouponDataChange from './FrontendReducers/CopuponReducers'
import { OrderDataChange, OrderDataChangeTrackiD } from './FrontendReducers/OrderReducer'
import MemberShipDataChange from './BackendReducers/MemberShipReducer'
import ProductBannerDataChange from './BackendReducers/ProductBannerReducer'
import WarningLabelsDataChange from './BackendReducers/WarningLabelsReducer'
import SubCategoryDataChange from './BackendReducers/SubCategoryReducer'
import NewsDataChange from './BackendReducers/NewsReducer'
import ShippingChargeChange from './BackendReducers/ShippingChargeReducer'
import VideoDataChange from './BackendReducers/PostVideoReducer'
import NottiflyDataChange from './BackendReducers/NottiflyReducer'
import HomeFeatureDataChange from './BackendReducers/HomeFeaturesReducer'
import OffersDataChange from './BackendReducers/OffersReducer'
import ColorDataChange from './BackendReducers/ColorReducer'
import SizeDataChange from './BackendReducers/SizeReducer'
import RestaurantDataChange from './AdminReducers/RestaurantReducer'
import TourTypeDataChange from './FrontendReducers/TourTypeReducers'
import ZoneDataChange from './FrontendReducers/ZoneReducers'
import CityDataChange from './BackendReducers/CityReducer'
import { StateDataChange, StateCityDataChange } from './BackendReducers/StateReducer'
import MealDataChange from './BackendReducers/MealReducer'
import BlogsDataChange from './FrontendReducers/BlogReducers'
import { CustomizationDataChange, CustomizationSegmentDataChange } from './BackendReducers/CustomizationReducer'
import SubscriptionDataChange from './BackendReducers/SubscriptionReducer'
import { CountryDataChange, CountryStateDataChange } from './BackendReducers/CountryReducer'
import AreaDataChange from './BackendReducers/AreaReducer'
import MapPolyGoneDataChange from './BackendReducers/MapPolygoneReducer'
import ShowMapPolygoneZoneDataChange from './BackendReducers/ShowMapPolygoneZoneReducer'


const rootReducer = combineReducers({
    CategoryDataChange,
    SubCategoryDataChange,
    BannerDataChange,
    DataChange,
    ProductDataChange,
    VariationDataChange,
    VariationSizeDataChange,
    UserDataChange,
    ShowUserCartData,
    CouponDataChange,
    OrderDataChange,
    OrderDataChangeTrackiD,
    MemberShipDataChange,
    ProductBannerDataChange,
    WarningLabelsDataChange,
    NewsDataChange,
    ShippingChargeChange,
    VideoDataChange,
    NottiflyDataChange,
    HomeFeatureDataChange,
    OffersDataChange,
    ColorDataChange,
    SizeDataChange,
    RestaurantDataChange,
    TourTypeDataChange,
    ZoneDataChange,
    CountryDataChange,
    CountryStateDataChange,
    StateDataChange,
    StateCityDataChange,
    CityDataChange,
    AreaDataChange,
    MealDataChange,
    CustomizationDataChange,
    CustomizationSegmentDataChange,
    BlogsDataChange,
    SubscriptionDataChange,
    MapPolyGoneDataChange,
    ShowMapPolygoneZoneDataChange

})

export default rootReducer

