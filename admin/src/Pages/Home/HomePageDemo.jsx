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
import AddProductBanner from '../InnerPages/BackEndSide/Product_Banner/AddProductBanner'
import ShowProductBanner from '../InnerPages/BackEndSide/Product_Banner/ShowProductBanner'
import EditProductBanner from '../InnerPages/BackEndSide/Product_Banner/EditProductBanner'
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
import AddTourType from '../InnerPages/FrontEndSide/TourTypes/AddTourTypes'
import ShowTourType from '../InnerPages/FrontEndSide/TourTypes/ShowTourTypes'
import EditTourType from '../InnerPages/FrontEndSide/TourTypes/EditTourTypes'
import AddZone from '../InnerPages/FrontEndSide/Zones/AddZones'
import ShowZone from '../InnerPages/FrontEndSide/Zones/ShowZones'
import EditZone from '../InnerPages/FrontEndSide/Zones/EditZones'
import AddAmenities from '../InnerPages/BackEndSide/Amenities/AddAmenities'
import EditAmenities from '../InnerPages/BackEndSide/Amenities/EditAmenities'
import ShowAmenities from '../InnerPages/BackEndSide/Amenities/ShowAmenities'
import ShowState from '../InnerPages/BackEndSide/State/ShowState'
import EditState from '../InnerPages/BackEndSide/State/EditState'
import ShowCity from '../InnerPages/BackEndSide/City/ShowCity'
import EditCity from '../InnerPages/BackEndSide/City/EditCity'
import AddTour from '../InnerPages/BackEndSide/Meal/AddMeal'
import ShowTour from '../InnerPages/BackEndSide/Meal/ShowMeal'
import EditTour from '../InnerPages/BackEndSide/Meal/EditMeal'
import AddBlogs from '../InnerPages/FrontEndSide/Blog/AddBlogs'
import ShowBlogs from '../InnerPages/FrontEndSide/Blog/ShowBlogs'
import EditBlogs from '../InnerPages/FrontEndSide/Blog/EditBlogs'


let url = process.env.REACT_APP_API_URL

const HomePage = () => {

    let adminToken = localStorage.getItem('token');
    const [userRole, setUserRole] = useState('');
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
                    setUserRole(userRole);
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

                {/* Restaurant */}
                <Route exact path='/createRestaurant' element={userRole === "admin" || userRole === "role_1" || userRole === "role_2" ? <CreateRestaurant /> : <Navigate to="/" />} />
                <Route exact path='/showRestaurant' element={userRole === "admin" || userRole === "role_1" || userRole === "role_2" ? <ShowRestaurant /> : <Navigate to="/" />} />
                <Route exact path='/editRestaurant' element={userRole === "admin" || userRole === "role_1" || userRole === "role_2" ? <EditRestaurant /> : <Navigate to="/" />} />

                {/* Tour-Type */}
                <Route exact path='/addTourType' element={userRole === "admin" || userRole === "role_1" || userRole === "role_2" ? <AddTourType /> : <Navigate to="/" />} />
                <Route exact path='/showTourType' element={userRole === "admin" || userRole === "role_1" || userRole === "role_2" ? <ShowTourType /> : <Navigate to="/" />} />
                <Route exact path='/editTourType' element={userRole === "admin" || userRole === "role_1" || userRole === "role_2" ? <EditTourType /> : <Navigate to="/" />} />

                {/* Zones */}
                <Route exact path='/addZone' element={userRole === "admin" || userRole === "role_1" || userRole === "role_2" ? <AddZone /> : <Navigate to="/" />} />
                <Route exact path='/showZone' element={userRole === "admin" || userRole === "role_1" || userRole === "role_2" ? <ShowZone /> : <Navigate to="/" />} />
                <Route exact path='/editZone' element={userRole === "admin" || userRole === "role_1" || userRole === "role_2" ? <EditZone /> : <Navigate to="/" />} />

                {/* Category */}
                <Route exact path='/addCategory' element={userRole === "admin" || userRole === "role_1" ? <AddCategory /> : <Navigate to="/" />} />
                <Route exact path='/showCategory' element={userRole === "admin" || userRole === "role_1" ? <ShowCategory /> : <Navigate to="/" />} />
                <Route exact path='/editCategory' element={userRole === "admin" || userRole === "role_1" ? <EditCategory /> : <Navigate to="/" />} />

                {/* Amenities */}
                <Route exact path='/addAmenities' element={userRole === "admin" || userRole === "role_1" ? <AddAmenities /> : <Navigate to="/" />} />
                <Route exact path='/showAmenities' element={userRole === "admin" || userRole === "role_1" ? <ShowAmenities /> : <Navigate to="/" />} />
                <Route exact path='/editAmenities' element={userRole === "admin" || userRole === "role_1" ? <EditAmenities /> : <Navigate to="/" />} />

                {/* State */}
                <Route exact path='/showState' element={userRole === "admin" || userRole === "role_1" ? <ShowState /> : <Navigate to="/" />} />
                <Route exact path='/editState' element={userRole === "admin" || userRole === "role_1" ? <EditState /> : <Navigate to="/" />} />

                {/* City */}
                <Route exact path='/showCity' element={userRole === "admin" || userRole === "role_1" ? <ShowCity /> : <Navigate to="/" />} />
                <Route exact path='/editCity' element={userRole === "admin" || userRole === "role_1" ? <EditCity /> : <Navigate to="/" />} />

                {/* Tour Package */}
                <Route exact path='/addMeal' element={userRole === "admin" || userRole === "role_1" ? <AddTour /> : <Navigate to="/" />} />
                <Route exact path='/showMeal' element={userRole === "admin" || userRole === "role_1" ? <ShowTour /> : <Navigate to="/" />} />
                <Route exact path='/editMeal' element={userRole === "admin" || userRole === "role_1" ? <EditTour /> : <Navigate to="/" />} />

                {/* Blogs */}
                <Route exact path='/addBlogs' element={userRole === "admin" || userRole === "role_1" ? <AddBlogs /> : <Navigate to="/" />} />
                <Route exact path='/showBlogs' element={userRole === "admin" || userRole === "role_1" ? <ShowBlogs /> : <Navigate to="/" />} />
                <Route exact path='/editBlogs' element={userRole === "admin" || userRole === "role_1" ? <EditBlogs /> : <Navigate to="/" />} />

                {/* Order */}
                <Route exact path='/showOrders' element={userRole === "admin" || userRole === "role_1" || userRole === "role_2" ? <ShowOrder /> : <Navigate to="/" />} />
                <Route exact path='/showAllResellerOrders' element={userRole === "admin" || userRole === "role_1" || userRole === "role_2" ? <ShowResellerOrder /> : <Navigate to="/" />} />
                <Route exact path='/showAllUserOrders' element={userRole === "admin" || userRole === "role_1" || userRole === "role_2" ? <ShowUserOrder /> : <Navigate to="/" />} />
                <Route exact path='/editOrders' element={userRole === "admin" || userRole === "role_1" || userRole === "role_2" ? <EditOrder /> : <Navigate to="/" />} />


                {/* Product */}
                <Route exact path='/addProduct' element={userRole === "admin" || userRole === "role_1" ? <AddProduct /> : <Navigate to="/" />} />
                <Route exact path='/showProduct' element={userRole === "admin" || userRole === "role_1" ? <ShowProduct /> : <Navigate to="/" />} />
                <Route exact path='/editProduct' element={userRole === "admin" || userRole === "role_1" ? <EditProduct /> : <Navigate to="/" />} />

                {/* Variation */}
                <Route exact path='/showVariation' element={userRole === "admin" || userRole === "role_1" ? <ShowVariation /> : <Navigate to="/" />} />
                <Route exact path='/showVariationSize' element={userRole === "admin" || userRole === "role_1" ? <ShowVariationSize /> : <Navigate to="/" />} />

                {/* Add Color */}
                <Route exact path="/addColor" element={userRole === "admin" || userRole === "role_1" ? <AddColor /> : <Navigate to="/" />} />
                <Route exact path="/showColor" element={userRole === "admin" || userRole === "role_1" ? <ShowColor /> : <Navigate to="/" />} />
                <Route exact path="/editColor" element={userRole === "admin" || userRole === "role_1" ? <EditColor /> : <Navigate to="/" />} />

                {/* Add Size */}
                <Route exact path="/addSize" element={userRole === "admin" || userRole === "role_1" ? <AddSize /> : <Navigate to="/" />} />
                <Route exact path="/showSize" element={userRole === "admin" || userRole === "role_1" ? <ShowSize /> : <Navigate to="/" />} />
                <Route exact path="/editSize" element={userRole === "admin" || userRole === "role_1" ? <EditSize /> : <Navigate to="/" />} />

                {/* SubCategory */}
                <Route exact path='/addSubCategory' element={userRole === "admin" || userRole === "role_1" ? <AddSubCategory /> : <Navigate to="/" />} />
                <Route exact path='/showSubCategory' element={userRole === "admin" || userRole === "role_1" ? <ShowSubCategory /> : <Navigate to="/" />} />
                <Route exact path='/editSubCategory' element={userRole === "admin" || userRole === "role_1" ? <EditSubCategory /> : <Navigate to="/" />} />

                {/* Cart data */}
                <Route exact path='/showCartData' element={userRole === "admin" || userRole === "role_1" ? <ShowCartDataList /> : <Navigate to="/" />} />

                {/* User */}
                <Route exact path='/showUser' element={userRole === "admin" ? <ShowUser /> : <Navigate to="/" />} />
                <Route exact path='/editUser' element={userRole === "admin" ? <EditUser /> : <Navigate to="/" />} />
                <Route exact path='/showUserCart' element={userRole === "admin" ? <ShowUserCart /> : <Navigate to="/" />} />



                {/* Nottifly */}
                <Route exact path="/addNottifly" element={userRole === "admin" || userRole === "role_1" ? <AddNottifly /> : <Navigate to="/" />} />
                <Route exact path="/showNottifly" element={userRole === "admin" || userRole === "role_1" ? <ShowNottifly /> : <Navigate to="/" />} />
                <Route exact path="/editNottifly" element={userRole === "admin" || userRole === "role_1" ? <EditNottifly /> : <Navigate to="/" />} />

                {/* Post Video */}
                <Route exact path="/addPostVideo" element={userRole === "admin" || userRole === "role_1" ? <AddPostVideo /> : <Navigate to="/" />} />
                <Route exact path="/showPostVideo" element={userRole === "admin" || userRole === "role_1" ? <ShowPostVideo /> : <Navigate to="/" />} />
                <Route exact path="/editPostVideo" element={userRole === "admin" || userRole === "role_1" ? <EditPostVideo /> : <Navigate to="/" />} />

                {/* News */}
                <Route exact path="/addNews" element={userRole === "admin" || userRole === "role_1" ? <AddNews /> : <Navigate to="/" />} />
                <Route exact path="/showNews" element={userRole === "admin" || userRole === "role_1" ? <ShowNews /> : <Navigate to="/" />} />
                <Route exact path="/editNews" element={userRole === "admin" || userRole === "role_1" ? <EditNews /> : <Navigate to="/" />} />

                {/* Notification */}
                <Route exact path="/sendNotification" element={userRole === "admin" || userRole === "role_1" ? <AddNotification /> : <Navigate to="/" />} />
                <Route exact path="/showNotification" element={userRole === "admin" || userRole === "role_1" ? <ShowNotification /> : <Navigate to="/" />} />



                {/* Wallet */}
                <Route exact path='/showWalletHistory' element={userRole === "admin" ? <ShowWalletHistory /> : <Navigate to="/" />} />
                <Route exact path='/addWallet' element={userRole === "admin" ? <AddWallet /> : <Navigate to="/" />} />

                {/* Coins */}
                <Route exact path='/showCoinsHistory' element={userRole === "admin" ? <ShowCoinsHistory /> : <Navigate to="/" />} />
                <Route exact path='/addCoins' element={userRole === "admin" ? <AddCoins /> : <Navigate to="/" />} />

                {/* Coupon */}
                <Route exact path='/showCoupon' element={userRole === "admin" ? <ShowCoupon /> : <Navigate to="/" />} />
                <Route exact path='/addCoupon' element={userRole === "admin" ? <AddCoupon /> : <Navigate to="/" />} />
                <Route exact path='/editCoupon' element={userRole === "admin" ? <EditCoupon /> : <Navigate to="/" />} />




                {/* Home Offers */}
                <Route exact path="/addOffers" element={userRole === "admin" || userRole === "role_1" ? <AddHomeFeatures /> : <Navigate to="/" />} />
                <Route exact path="/showOffers" element={userRole === "admin" || userRole === "role_1" ? <ShowHomeFeature /> : <Navigate to="/" />} />
                <Route exact path="/editOffers" element={userRole === "admin" || userRole === "role_1" ? <EditHomeFeature /> : <Navigate to="/" />} />

                {/* Under99 */}
                <Route exact path="/addUnder99" element={userRole === "admin" || userRole === "role_1" ? <AddOffers /> : <Navigate to="/" />} />
                <Route exact path="/showUnder99" element={userRole === "admin" || userRole === "role_1" ? <ShowOffers /> : <Navigate to="/" />} />
                <Route exact path="/editUnder99" element={userRole === "admin" || userRole === "role_1" ? <EditOffers /> : <Navigate to="/" />} />

                {/* Review */}
                <Route exact path="/showReview" element={userRole === "admin" || userRole === "role_1" ? <ShowReview /> : <Navigate to="/" />} />

                {/* Banner */}
                <Route exact path='/addBanner' element={userRole === "admin" || userRole === "role_1" ? <AddBanner /> : <Navigate to="/" />} />
                <Route exact path='/showBanner' element={userRole === "admin" || userRole === "role_1" ? <ShowBanner /> : <Navigate to="/" />} />
                <Route exact path='/editBanner' element={userRole === "admin" || userRole === "role_1" ? <EditBanner /> : <Navigate to="/" />} />
                {/* <Route exact path='/addProductBanner' element={userRole === "admin" || userRole === "role_1"  ? <AddProductBanner /> : <Navigate to="/" />} />
                <Route exact path='/showProductBanner' element={userRole === "admin" || userRole === "role_1"  ? <ShowProductBanner /> : <Navigate to="/" />} />
                <Route exact path='/editProductBanner' element={userRole === "admin" || userRole === "role_1"  ? <EditProductBanner /> : <Navigate to="/" />} /> */}



                {/* CustomerSupport */}
                <Route exact path="/showCustomerSupport" element={userRole === "admin" || userRole === "role_1" || userRole === "role_1" || userRole === "role_3" ? <ShowCustomerSupport /> : <Navigate to="/" />} />

                {/* PostRequirement */}
                <Route exact path="/showPostRequirement" element={userRole === "admin" || userRole === "role_1" || userRole === "role_3" ? <ShowPostRequirement /> : <Navigate to="/" />} />



                {/* Stock */}
                <Route exact path='/showLowStockProduct' element={userRole === "admin" || userRole === "role_1" || userRole === "role_2" ? <ShowLowStockProducts /> : <Navigate to="/" />} />
                <Route exact path='/showProductNotify' element={userRole === "admin" || userRole === "role_1" || userRole === "role_2" ? <ShowProductNotify /> : <Navigate to="/" />} />



                {/* Data (Specification) */}
                <Route exact path='/addSpecification' element={userRole === "admin" ? <AddSpecification /> : <Navigate to="/" />} />
                <Route exact path='/showSpecification' element={userRole === "admin" ? <ShowSpecification /> : <Navigate to="/" />} />
                <Route exact path='/editSpecification' element={userRole === "admin" ? <EditSpecification /> : <Navigate to="/" />} />

                {/* Shipping */}
                <Route path="/addShippingCharge" element={userRole === "admin" ? <AddShippingCharge /> : <Navigate to="/" />} />
                <Route path="/showShippingCharge" element={userRole === "admin" ? <ShowShippingCharge /> : <Navigate to="/" />} />
                <Route path="/editShippingCharge" element={userRole === "admin" ? <EditShippingCharge /> : <Navigate to="/" />} />


                {/* Settings */}
                {/* <Route exact path='/addChargesSettings' element={<AddChargesSettings />} />
                <Route exact path='/memberShipSettings' element={<MemberShipSettings />} /> */}
                <Route exact path='/generalSettings' element={userRole === "admin" ? <GeneralSettingsMain /> : <Navigate to="/" />} />
                <Route exact path='/pageSettings' element={userRole === "admin" ? <PageSettings /> : <Navigate to="/" />} />

                {/* MemberShip */}
                {/* <Route exact path='/showMemberShip' element={<ShowMemberShip />} />
                <Route exact path='/showAllMemberShipOfUser' element={<ShowUserAllMemberShip />} /> */}


                {/* DashBoard */}
                <Route exact path='/' element={<DashBoard />} />


                {/* Sub Admins */}
                <Route exact path="/showSubAdmin" element={userRole === "admin" ? <ShowSubAdmin /> : <Navigate to="/" />} />

            </Routes>
        </>
    )
}

export default HomePage
