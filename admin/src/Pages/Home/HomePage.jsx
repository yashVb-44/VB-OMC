import React, { useEffect, useState } from 'react'
import Header from '../../Components/HeaderComp/Header'
import LeftSide from '../../Components/SideBarComp/LeftSide'
import RightSide from '../../Components/SideBarComp/RightSide'
import AddCategory from '../InnerPages/BackEndSide/Category/AddCategory'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import ShowCategory from '../InnerPages/BackEndSide/Category/ShowCategory'
import EditCategory from '../InnerPages/BackEndSide/Category/EditCategory'
import AddBanner from '../InnerPages/BackEndSide/Banner/AddBanner'
import ShowBanner from '../InnerPages/BackEndSide/Banner/ShowBanner'
import EditBanner from '../InnerPages/BackEndSide/Banner/EditBanner'
import AddProduct from '../InnerPages/BackEndSide/Product/AddProduct'
import AddData from '../InnerPages/BackEndSide/Data/AddData'
import ShowData from '../InnerPages/BackEndSide/Data/ShowData'
import EditData from '../InnerPages/BackEndSide/Data/EditData'
import ShowProduct from '../InnerPages/BackEndSide/Product/ShowProduct'
import ShowVariation from '../InnerPages/BackEndSide/Variation/ShowVariation'
import ShowVariationSize from '../InnerPages/BackEndSide/Variation/ShowVariationSize'
import ShowUser from '../InnerPages/FrontEndSide/User/ShowUser'
import AddChargesSettings from '../SettingsPages/ChargesSettings/AddChargesSettings'
import EditProduct from '../InnerPages/BackEndSide/Product/EditProduct'
import ShowOrder from '../InnerPages/FrontEndSide/Order/ShowOrder'
import MemberShipSettings from '../SettingsPages/ChargesSettings/MemberShipSettings'
import EditUser from '../InnerPages/FrontEndSide/User/EditUser'
import GeneralSettingsMain from '../SettingsPages/GeneralSettings/GeneralSettingsMain'
import GeneralSettings from '../SettingsPages/GeneralSettings/GeneralSettings'
import PageSettings from '../SettingsPages/PagesSettings/PageSettings'
import ShowCoupon from '../InnerPages/FrontEndSide/Coupon/ShowCoupon'
import AddCoupon from '../InnerPages/FrontEndSide/Coupon/AddCoupon'
import EditCoupon from '../InnerPages/FrontEndSide/Coupon/EditCoupon'
import EditOrder from '../InnerPages/FrontEndSide/Order/EditOrder'
import ShowMemberShip from '../InnerPages/FrontEndSide/MemberShip/ShowMemberShip'
import ShowUserAllMemberShip from '../InnerPages/FrontEndSide/MemberShip/ShowUserAllMemberShip'
import ShowWalletHistory from '../InnerPages/FrontEndSide/Wallet/ShowWalletHistory'
import ShowCoinsHistory from '../InnerPages/FrontEndSide/Coins/ShowCoinsHistory'
import AddWallet from '../InnerPages/FrontEndSide/Wallet/AddWallet'
import AddCoins from '../InnerPages/FrontEndSide/Coins/AddCoins'
import DashBoard from './DashBoard'
import ShowReview from '../InnerPages/FrontEndSide/Review/ShowReview'
import ShowLowStockProducts from '../InnerPages/BackEndSide/Product/ShowLowStockProduct'
import ShowProductNotify from '../InnerPages/BackEndSide/Product_Notify/ShowProductNotify'
import axios from 'axios'
import NotAdminPage from '../AuthenticationPages/NotAdminPage'
import ShowSubAdmin from '../InnerPages/BackEndSide/SubAdmin/ShowSubAdmin'
import AddSubCategory from '../InnerPages/BackEndSide/SubCategory/AddSubCategory'
import ShowSubCategory from '../InnerPages/BackEndSide/SubCategory/ShowSubCategory'
import EditSubCategory from '../InnerPages/BackEndSide/SubCategory/EditSubCategory'
import AddNews from '../InnerPages/BackEndSide/News/AddLatestNews'
import ShowNews from '../InnerPages/BackEndSide/News/ShowLatestNews'
import EditNews from '../InnerPages/BackEndSide/News/EditLatestNews'
import AddShippingCharge from '../InnerPages/BackEndSide/Shipping/AddShippingCharge'
import ShowShippingCharge from '../InnerPages/BackEndSide/Shipping/ShowShippingCharge'
import EditShippingCharge from '../InnerPages/BackEndSide/Shipping/EditShippingCharge'
import ShowPostRequirement from '../InnerPages/FrontEndSide/PostRequirement/ShowPostRequirement'
import ShowCustomerSupport from '../InnerPages/FrontEndSide/CustomerSupport/ShowCustomerSupport'
import AddNottifly from '../InnerPages/BackEndSide/Notifly/AddNottifly'
import ShowNottifly from '../InnerPages/BackEndSide/Notifly/ShowNottifly'
import AddPostVideo from '../InnerPages/BackEndSide/Video/AddPostVideo'
import ShowPostVideo from '../InnerPages/BackEndSide/Video/ShowPostVideo'
import EditPostVideo from '../InnerPages/BackEndSide/Video/EditPostVideo'
import EditNottifly from '../InnerPages/BackEndSide/Notifly/EditNottifly'
import AddSpecification from '../InnerPages/BackEndSide/Specification/AddSpecification'
import ShowSpecification from '../InnerPages/BackEndSide/Specification/ShowSpecification'
import EditSpecification from '../InnerPages/BackEndSide/Specification/EditSpecification'
import ShowUserCart from '../InnerPages/FrontEndSide/User/ShowUserCart'
import AddHomeFeatures from '../InnerPages/BackEndSide/Home_Features/AddHomeFeatures'
import ShowHomeFeature from '../InnerPages/BackEndSide/Home_Features/ShowHomeFeatures'
import EditHomeFeature from '../InnerPages/BackEndSide/Home_Features/EditHomeFetures'
import AddOffers from '../InnerPages/BackEndSide/Offers/AddOffers'
import ShowOffers from '../InnerPages/BackEndSide/Offers/ShowOffers'
import EditOffers from '../InnerPages/BackEndSide/Offers/EditOffers'
import ShowResellerOrder from '../InnerPages/FrontEndSide/Order/ShowResellerOrder'
import ShowUserOrder from '../InnerPages/FrontEndSide/Order/ShowUserOrder'
import AddColor from '../InnerPages/BackEndSide/Color/AddColor'
import ShowColor from '../InnerPages/BackEndSide/Color/ShowColor'
import EditColor from '../InnerPages/BackEndSide/Color/EditColor'
import ShowSize from '../InnerPages/BackEndSide/Size/ShowSize'
import EditSize from '../InnerPages/BackEndSide/Size/EditSize'
import AddSize from '../InnerPages/BackEndSide/Size/AddSize'
import AddNotification from '../InnerPages/FrontEndSide/Notification/AddNotification'
import ShowNotification from '../InnerPages/FrontEndSide/Notification/ShowNotification'
import ShowCartDataList from '../InnerPages/BackEndSide/Product/ShowCartDataList'
import CreateRestaurant from '../InnerPages/Restaurant/CreateRestaurant'
import ShowRestaurant from '../InnerPages/Restaurant/ShowRestaurant'
import EditRestaurant from '../InnerPages/Restaurant/EditRestaurant'
import AddZone from '../InnerPages/FrontEndSide/Zones/AddZones'
import ShowZone from '../InnerPages/FrontEndSide/Zones/ShowZones'
import EditZone from '../InnerPages/FrontEndSide/Zones/EditZones'
import AddWarningLabels from '../InnerPages/BackEndSide/WarningLabel/AddWarningLabels'
import EditWarningLabels from '../InnerPages/BackEndSide/WarningLabel/EditWarningLabels'
import ShowWarningLabels from '../InnerPages/BackEndSide/WarningLabel/ShowWarningLabels'
import ShowState from '../InnerPages/BackEndSide/State/ShowState'
import EditState from '../InnerPages/BackEndSide/State/EditState'
import ShowCity from '../InnerPages/BackEndSide/City/ShowCity'
import EditCity from '../InnerPages/BackEndSide/City/EditCity'
import AddMeal from '../InnerPages/BackEndSide/Meal/AddMeal'
import ShowMeal from '../InnerPages/BackEndSide/Meal/ShowMeal'
import EditMeal from '../InnerPages/BackEndSide/Meal/EditMeal'
import AddBlogs from '../InnerPages/FrontEndSide/Blog/AddBlogs'
import ShowBlogs from '../InnerPages/FrontEndSide/Blog/ShowBlogs'
import EditBlogs from '../InnerPages/FrontEndSide/Blog/EditBlogs'
import AddRestaurantMeal from '../InnerPages/BackEndSide/Meal/AddRestaurantMeal'
import ShowCustomization from '../InnerPages/BackEndSide/Customization/ShowCustomization'
import ShowCustomizationSegment from '../InnerPages/BackEndSide/Customization/ShowCustomizationSegment'
import AddSubscription from '../InnerPages/BackEndSide/Subscription/AddSubscription'
import ShowSubscription from '../InnerPages/BackEndSide/Subscription/ShowSubscription'
import EditSubscription from '../InnerPages/BackEndSide/Subscription/EditSubscription'
import AddCountry from '../InnerPages/BackEndSide/Country/AddCountry'
import ShowCountry from '../InnerPages/BackEndSide/Country/ShowCountry'
import EditCountry from '../InnerPages/BackEndSide/Country/EditCountry'
import AddState from '../InnerPages/BackEndSide/State/AddState'
import AddCity from '../InnerPages/BackEndSide/City/AddCity'
import AddArea from '../InnerPages/BackEndSide/Area/AddArea'
import ShowArea from '../InnerPages/BackEndSide/Area/ShowArea'
import EditArea from '../InnerPages/BackEndSide/Area/EditArea'
import PolygonMap from '../../Components/Demo/PolygonMap'
import EditRestaurantDaysTime from '../InnerPages/Restaurant/EditRestaurantDaysTime'
import DrawPolygone from '../InnerPages/Restaurant/PolyGone/DrawPolygone'
import AddGeoMap from '../InnerPages/Restaurant/PolyGone/AddGeoMap'
import EditRestaurantProfile from '../InnerPages/Restaurant/EditRestaurantProfile'


let url = process.env.REACT_APP_API_URL

const HomePage = () => {

    let adminToken = localStorage.getItem('token');
    const [userRole, setUserRole] = useState('');
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const res = await axios.get(`${url}/auth/userName`, {
                    headers: {
                        Authorization: `${adminToken}`,
                    },
                });

                if (res?.data?.type === 'success') {
                    const userRole = res?.data?.role || '';
                    const userId = res?.data?.id
                    setUserRole(userRole);
                    setUserId(userId)
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserRole();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }


    return (
        <>
            <div id="layout-wrapper">
                <Header />
                <LeftSide />
            </div>
            <RightSide />


            <Routes>

                <Route path="*" element={<Navigate to="/admin" />} />

                <Route exact path='/poly' element={userRole === "admin" || userRole === "role_1" || userRole === "role_2" ? <PolygonMap /> : <Navigate to="/" />} />

                {/* User */}
                <Route exact path='/showUser' element={userRole === "admin" || userRole === "role_1" || userRole === "role_2" ? <ShowUser /> : <Navigate to="/" />} />

                {/* Restaurant */}
                <Route exact path='/createRestaurant' element={userRole === "admin" || userRole === "role_1" || userRole === "role_2" ? <CreateRestaurant /> : <Navigate to="/" />} />
                <Route exact path='/showRestaurant' element={userRole === "admin" || userRole === "role_1" || userRole === "role_2" ? <ShowRestaurant /> : <Navigate to="/" />} />
                <Route exact path='/editRestaurant' element={userRole === "admin" || userRole === "role_1" || userRole === "role_2" ? <EditRestaurant /> : <Navigate to="/" />} />
                <Route exact path='/editRestaurantProfile' element={userRole === "restaurant" ? <EditRestaurantProfile id={userId} /> : <Navigate to="/" />} />
                <Route exact path='/editRestaurantDaysTime' element={userRole === "restaurant" ? <EditRestaurantDaysTime id={userId} /> : <Navigate to="/" />} />

                {/* Zones */}
                <Route exact path='/addZone' element={userRole === "admin" || userRole === "role_1" || userRole === "role_2" ? <AddZone /> : <Navigate to="/" />} />
                <Route exact path='/showZone' element={userRole === "admin" || userRole === "role_1" || userRole === "role_2" ? <ShowZone /> : <Navigate to="/" />} />
                <Route exact path='/editZone' element={userRole === "admin" || userRole === "role_1" || userRole === "role_2" ? <EditZone /> : <Navigate to="/" />} />

                {/* Country */}
                <Route exact path='/addCountry' element={userRole === "admin" || userRole === "role_1" ? <AddCountry /> : <Navigate to="/" />} />
                <Route exact path='/showCountry' element={userRole === "admin" || userRole === "role_1" ? <ShowCountry /> : <Navigate to="/" />} />
                <Route exact path='/editCountry' element={userRole === "admin" || userRole === "role_1" ? <EditCountry /> : <Navigate to="/" />} />

                {/* State */}
                <Route exact path='/addState' element={userRole === "admin" || userRole === "role_1" ? <AddState /> : <Navigate to="/" />} />
                <Route exact path='/showState' element={userRole === "admin" || userRole === "role_1" ? <ShowState /> : <Navigate to="/" />} />
                <Route exact path='/editState' element={userRole === "admin" || userRole === "role_1" ? <EditState /> : <Navigate to="/" />} />

                {/* City */}
                <Route exact path='/addCity' element={userRole === "admin" || userRole === "role_1" ? <AddCity /> : <Navigate to="/" />} />
                <Route exact path='/showCity' element={userRole === "admin" || userRole === "role_1" ? <ShowCity /> : <Navigate to="/" />} />
                <Route exact path='/editCity' element={userRole === "admin" || userRole === "role_1" ? <EditCity /> : <Navigate to="/" />} />

                {/* Area */}
                <Route exact path='/addArea' element={userRole === "admin" || userRole === "role_1" ? <AddArea /> : <Navigate to="/" />} />
                <Route exact path='/showArea' element={userRole === "admin" || userRole === "role_1" ? <ShowArea /> : <Navigate to="/" />} />
                <Route exact path='/editArea' element={userRole === "admin" || userRole === "role_1" ? <EditArea /> : <Navigate to="/" />} />

                {/* Map Zone */}
                <Route exact path='/deliveryZone' element={userRole === "admin" || userRole === "restaurant" ? <DrawPolygone id={userId} role={userRole} /> : <Navigate to="/" />} />
                <Route exact path='/addMapPolygone/:zone' element={userRole === "admin" || userRole === "restaurant" ? <AddGeoMap id={userId} role={userRole} /> : <Navigate to="/" />} />

                {/* Category */}
                <Route exact path='/addCategory' element={userRole === "admin" || userRole === "role_1" ? <AddCategory /> : <Navigate to="/" />} />
                <Route exact path='/showCategory' element={userRole === "admin" || userRole === "role_1" ? <ShowCategory /> : <Navigate to="/" />} />
                <Route exact path='/editCategory' element={userRole === "admin" || userRole === "role_1" ? <EditCategory /> : <Navigate to="/" />} />

                {/* Warning-Labels */}
                <Route exact path='/addWarningLabels' element={userRole === "admin" || userRole === "role_1" ? <AddWarningLabels /> : <Navigate to="/" />} />
                <Route exact path='/showWarningLabels' element={userRole === "admin" || userRole === "role_1" ? <ShowWarningLabels /> : <Navigate to="/" />} />
                <Route exact path='/editWarningLabels' element={userRole === "admin" || userRole === "role_1" ? <EditWarningLabels /> : <Navigate to="/" />} />

                {/* Meal Package */}
                <Route exact path='/addMeal' element={userRole === "admin" ? <AddMeal /> : <Navigate to="/" />} />
                <Route exact path='/addRestaurantMeal' element={userRole === "restaurant" ? <AddRestaurantMeal role={userRole} id={userId} /> : <Navigate to="/" />} />
                <Route exact path='/showMeal' element={userRole === "admin" || userRole === "restaurant" ? <ShowMeal role={userRole} id={userId} /> : <Navigate to="/" />} />
                <Route exact path='/editMeal' element={userRole === "admin" || userRole === "restaurant" ? <EditMeal role={userRole} id={userId} /> : <Navigate to="/" />} />

                {/* Customization */}
                <Route exact path='/showCustomization' element={userRole === "admin" || userRole === "restaurant" ? <ShowCustomization /> : <Navigate to="/" />} />
                <Route exact path='/showCustomizationSegment' element={userRole === "admin" || userRole === "restaurant" ? <ShowCustomizationSegment /> : <Navigate to="/" />} />

                {/* Banner */}
                <Route exact path='/addBanner' element={userRole === "admin" ? <AddBanner /> : <Navigate to="/" />} />
                <Route exact path='/showBanner' element={userRole === "admin" ? <ShowBanner /> : <Navigate to="/" />} />
                <Route exact path='/editBanner' element={userRole === "admin" ? <EditBanner /> : <Navigate to="/" />} />

                {/* Subscription */}
                <Route exact path='/addSubscription' element={userRole === "admin" ? <AddSubscription /> : <Navigate to="/" />} />
                <Route exact path='/showSubscription' element={userRole === "admin" ? <ShowSubscription /> : <Navigate to="/" />} />
                <Route exact path='/editSubscription' element={userRole === "admin" ? <EditSubscription /> : <Navigate to="/" />} />


                {/* Blogs */}
                <Route exact path='/addBlogs' element={userRole === "admin" || userRole === "role_1" ? <AddBlogs /> : <Navigate to="/" />} />
                <Route exact path='/showBlogs' element={userRole === "admin" || userRole === "role_1" ? <ShowBlogs /> : <Navigate to="/" />} />
                <Route exact path='/editBlogs' element={userRole === "admin" || userRole === "role_1" ? <EditBlogs /> : <Navigate to="/" />} />

            </Routes>
        </>
    )
}

export default HomePage
