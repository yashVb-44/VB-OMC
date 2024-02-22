import React, { useEffect, useState } from "react";
import logo_sm from "../../resources/assets/images/image_2023_08_19T05_11_01_553Z.png";
// import logo_sm from "../../resources/assets/images/logo-sm.png";
import logo_dark from "../../resources/assets/images/logo-dark.png";
import down_arrow from "../../resources/assets/images/down-arrow.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";

let url = process.env.REACT_APP_API_URL

const LeftSide = () => {

    const adminToken = localStorage.getItem('token');
    const Navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState("");
    const [userRole, setUserRole] = useState('');


    // get user role (admin or subadmin)
    useEffect(() => {

        let adminToken = localStorage.getItem('token');
        async function checkAdmin() {
            try {
                const res = await axios.get(`${url}/auth/userName`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    }
                )
                if (res?.data?.type === "success") {
                    setUserRole(res?.data?.role);
                }
            } catch (error) {
                console.log(error)
            }
        }

        checkAdmin()
    }, []);


    // get current url
    useEffect(() => {
        const currentURL = window.location.href;
        const url = new URL(currentURL);
        const point = url.pathname.split("/").pop();
        setActiveMenu(point);
    });

    const [settingsData, setSettingsData] = useState({})


    useEffect(() => {
        async function getSettings() {
            try {
                const res = await axios.get(`${url}/app/settings/get`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    });
                setSettingsData(res?.data?.Settings);
            } catch (error) {
                console.log(error)
            }
        }
        getSettings()
    }, [settingsData])

    return (
        <>
            <div className="vertical-menu">
                <div className="navbar-brand-box">
                    <a className="logo logo-dark">
                        <span className="logo-sm">
                            <img src={settingsData?.app_logo} alt="" height={40} width={40} />
                        </span>
                        <span className="logo-lg">
                            <img src={settingsData?.app_logo} alt="" height={40} width={40} />
                        </span>
                    </a>

                    <a className="logo logo-light">
                        <span className="logo-sm">
                            <img src={settingsData?.app_logo} alt="" height={40} width={40} />
                        </span>
                        <span className="logo-lg">
                            <img src={settingsData?.app_logo} alt="" height={40} width={40} />
                        </span>
                    </a>
                </div>

                <button
                    type="button"
                    className="btn btn-sm px-3 font-size-16 header-item waves-effect vertical-menu-btn"
                    onClick={() => {
                        document.body.setAttribute("data-sidebar-size", "sm");
                        document.body.classList.add("sidebar-enable");
                        document.body.classList.add("sm");
                        document.body.classList.remove("lg");
                    }}
                >
                    <i className="fa fa-fw fa-bars"></i>
                </button>

                <div data-simplebar className="sidebar-menu-scroll">
                    <div id="sidebar-menu">
                        <ul className="metismenu list-unstyled" id="side-menu">
                            <li className="menu-title">Menu</li>

                            <li
                                className={`${activeMenu === "admin" ? "mm-active" : ""}`}
                                onClick={() => {
                                    Navigate("/admin");
                                }}
                            >
                                <a className={`${activeMenu === "admin" ? "active" : ""}`}>
                                    <i className="uil-home-alt">
                                        <i className="fas fa-home" aria-hidden="true"></i>
                                    </i>
                                    {/* <span className="badge rounded-pill bg-primary float-end">
                                        01
                                    </span> */}
                                    <span>Dashboard</span>
                                </a>
                            </li>

                            {(userRole === "admin") &&
                                (
                                    <li
                                        className={`${activeMenu === "addChargesSettings" ||
                                            activeMenu === "memberShipSettings" ||
                                            activeMenu === "generalSettings" ||
                                            activeMenu === "pageSettings"
                                            ? "mm-active" : ""}`}
                                    >
                                        <a
                                            className={`${activeMenu === "addChargesSettings" ||
                                                activeMenu === "memberShipSettings" ||
                                                activeMenu === "generalSettings" ||
                                                activeMenu === "pageSettings"

                                                ? "active" : ""
                                                } waves-effect d-flex sub-drop`}
                                            onClick={() => {
                                                document
                                                    .querySelector(".sub-menu1")
                                                    .classList.toggle("active");
                                                document.querySelector("#w-243").classList.toggle("active");
                                            }}
                                        >
                                            <div>
                                                <i className="uil-store">
                                                    <i className="fas fa-cogs" aria-hidden="true"></i>
                                                </i>
                                                <span style={{ marginLeft: "3px" }}>Settings</span>
                                            </div>
                                            <img className="w-24" id="w-243" src={down_arrow} />
                                        </a>
                                        <ul className="sub-menu sub-menu1" aria-expanded="false">
                                            <li
                                                onClick={() => {
                                                    Navigate("/admin/generalSettings");
                                                }}
                                                style={{ cursor: "pointer" }}
                                                className={`${activeMenu === "generalSettings" ? "mm-active" : ""}`}

                                            >
                                                <a>General Settings</a>
                                            </li>
                                            <li
                                                onClick={() => {
                                                    Navigate("/admin/pageSettings");
                                                }}
                                                style={{ cursor: "pointer" }}
                                                className={`${activeMenu === "pageSettings" ? "mm-active" : ""}`}

                                            >
                                                <a>Page Settings</a>
                                            </li>
                                        </ul>
                                    </li>
                                )}


                            <li className="menu-title">Apps</li>

                            {/* Orders */}
                            {(userRole === "admin" || userRole === "role_1" || userRole === "role_2") &&
                                (<li
                                    className={`${activeMenu === "showOrders" ||
                                        activeMenu === "showAllUserOrders" ||
                                        activeMenu === "showAllResellerOrders" ||
                                        activeMenu === "editOrders"
                                        ? "mm-active" : ""}`}
                                >
                                    <a
                                        className={`${activeMenu === "showOrders" ||
                                            activeMenu === "showAllUserOrders" ||
                                            activeMenu === "showAllResellerOrders" ||
                                            activeMenu === "editOrders"

                                            ? "active" : ""
                                            } waves-effect d-flex sub-drop`}
                                        onClick={() => {
                                            document
                                                .querySelector(".sub-menu2")
                                                .classList.toggle("active");
                                            document.querySelector("#w-244").classList.toggle("active");
                                        }}
                                    >
                                        <div>
                                            <i className="uil-store">
                                                <i className="fas fa-shopping-bag" aria-hidden="true"></i>
                                            </i>
                                            <span style={{ marginLeft: "3px" }}>Orders</span>
                                        </div>
                                        <img className="w-24" id="w-244" src={down_arrow} />
                                    </a>
                                    <ul className="sub-menu sub-menu2" aria-expanded="false">
                                        <li
                                            onClick={() => {
                                                Navigate("/admin/showOrders");
                                            }}
                                            style={{ cursor: "pointer" }}
                                            className={`${activeMenu === "showOrders" ? "mm-active" : ""}`}

                                        >
                                            <a>All Orders</a>
                                        </li>
                                        <li
                                            onClick={() => {
                                                Navigate("/admin/showAllUserOrders");
                                            }}
                                            style={{ cursor: "pointer" }}
                                            className={`${activeMenu === "showAllUserOrders" ? "mm-active" : ""}`}

                                        >
                                            <a>User Orders</a>
                                        </li>
                                        <li
                                            onClick={() => {
                                                Navigate("/admin/showAllResellerOrders");
                                            }}
                                            style={{ cursor: "pointer" }}
                                            className={`${activeMenu === "showAllResellerOrders" ? "mm-active" : ""}`}

                                        >
                                            <a>Reseller Orders</a>
                                        </li>
                                    </ul>
                                </li>)}

                            {/* Porduct */}
                            {(userRole === "admin" || userRole === "role_1") &&
                                (<li
                                    className={`${activeMenu === "showProduct" ||
                                        activeMenu === `addProduct` ||
                                        activeMenu === `editProduct` ||
                                        activeMenu === `addVariation` ||
                                        activeMenu === `showVariation` ||
                                        activeMenu === `editVariation` ||
                                        activeMenu === `addVariationSize` ||
                                        activeMenu === `showVariationSize` ||
                                        activeMenu === `showVariationSize` ||
                                        activeMenu === `addColor` ||
                                        activeMenu === `editColor` ||
                                        activeMenu === `showColor` ||
                                        activeMenu === `showSize` ||
                                        activeMenu === `addSize` ||
                                        activeMenu === `editSize` ||
                                        activeMenu === `showCategory` ||
                                        activeMenu === `addCategory` ||
                                        activeMenu === `editCategory` ||
                                        activeMenu === `showSubCategory` ||
                                        activeMenu === `addSubCategory` ||
                                        activeMenu === `editSubCategory` ||
                                        activeMenu === `showCartData`
                                        ? "mm-active" : ""}`}
                                >
                                    <a
                                        className={`${activeMenu === "showProduct" ||
                                            activeMenu === `addProduct` ||
                                            activeMenu === `editProduct` ||
                                            activeMenu === `addVariation` ||
                                            activeMenu === `showVariation` ||
                                            activeMenu === `editVariation` ||
                                            activeMenu === `addVariationSize` ||
                                            activeMenu === `showVariationSize` ||
                                            activeMenu === `showVariationSize` ||
                                            activeMenu === `addColor` ||
                                            activeMenu === `editColor` ||
                                            activeMenu === `showColor` ||
                                            activeMenu === `showSize` ||
                                            activeMenu === `addSize` ||
                                            activeMenu === `editSize` ||
                                            activeMenu === `showCategory` ||
                                            activeMenu === `addCategory` ||
                                            activeMenu === `editCategory` ||
                                            activeMenu === `showSubCategory` ||
                                            activeMenu === `addSubCategory` ||
                                            activeMenu === `editSubCategory` ||
                                            activeMenu === `showCartData`
                                            ? "active" : ""
                                            } waves-effect d-flex sub-drop`}
                                        onClick={() => {
                                            document
                                                .querySelector(".sub-menu3")
                                                .classList.toggle("active");
                                            document.querySelector("#w-245").classList.toggle("active");
                                        }}
                                    >
                                        <div>
                                            <i className="uil-store">
                                                <i className="fas fa-box-open"></i>
                                            </i>
                                            <span style={{ marginLeft: "3px" }}>Product</span>
                                        </div>
                                        <img className="w-24" id="w-245" src={down_arrow} />
                                    </a>
                                    <ul className="sub-menu sub-menu3" aria-expanded="false">
                                        <li
                                            onClick={() => {
                                                Navigate("/admin/showProduct");
                                            }}
                                            style={{ cursor: "pointer" }}
                                            className={`
                                            ${activeMenu === "showProduct" ||
                                                    activeMenu === `addProduct` ||
                                                    activeMenu === `editProduct` ||
                                                    activeMenu === `addVariation` ||
                                                    activeMenu === `showVariation` ||
                                                    activeMenu === `editVariation` ||
                                                    activeMenu === `addVariationSize` ||
                                                    activeMenu === `showVariationSize` ||
                                                    activeMenu === `editVariationSize`
                                                    ? "mm-active" : ""}`}

                                        >
                                            <a><i className="fas fa-box-open"></i> All Products</a>
                                        </li>
                                        <li
                                            onClick={() => {
                                                Navigate("/admin/showColor");
                                            }}
                                            style={{ cursor: "pointer" }}
                                            className={`
                                        ${activeMenu === `showColor` ||
                                                    activeMenu === `addColor` ||
                                                    activeMenu === `editColor`
                                                    ? "mm-active" : ""}`}

                                        >
                                            <a> <i class="fas fa-fill-drip"></i> Product Color</a>
                                        </li>
                                        <li
                                            onClick={() => {
                                                Navigate("/admin/showSize");
                                            }}
                                            style={{ cursor: "pointer" }}
                                            className={`
                                        ${activeMenu === `showSize` ||
                                                    activeMenu === `addSize` ||
                                                    activeMenu === `editSize`
                                                    ? "mm-active" : ""}`}

                                        >
                                            <a> <i class="fas fa-ruler-combined"></i> Product Size</a>
                                        </li>
                                        <li
                                            onClick={() => {
                                                Navigate("/admin/showCategory");
                                            }}
                                            style={{ cursor: "pointer" }}
                                            className={`
                                        ${activeMenu === `showCategory` ||
                                                    activeMenu === `addCategory` ||
                                                    activeMenu === `editCategory`
                                                    ? "mm-active" : ""}`}
                                        >
                                            <a> <i className="fas fa-th-large"></i> Category</a>
                                        </li>
                                        <li
                                            onClick={() => {
                                                Navigate("/admin/showSubCategory");
                                            }}
                                            style={{ cursor: "pointer" }}
                                            className={`
                                        ${activeMenu === `showSubCategory` ||
                                                    activeMenu === `addSubCategory` ||
                                                    activeMenu === `editSubCategory`
                                                    ? "mm-active" : ""}`}

                                        >
                                            <a> <i className="fas fa-clipboard-list"></i> Sub-Category</a>
                                        </li>
                                        <li
                                            onClick={() => {
                                                Navigate("/admin/showCartData");
                                            }}
                                            style={{ cursor: "pointer" }}
                                            className={`
                                        ${activeMenu === `showCartData`
                                                    ? "mm-active" : ""}`}
                                        >
                                            <a> <i className="fas fa-shopping-cart"></i> Users Cart Data</a>
                                        </li>
                                    </ul>
                                </li>)}

                            {/* User */}
                            {(userRole === "admin") &&
                                (<li
                                    className={`${activeMenu === `showUser` ||
                                        activeMenu === `editUser` ||
                                        activeMenu === `showUserCart`
                                        ? "mm-active"
                                        : ""
                                        }`}
                                    onClick={() => {
                                        Navigate("/admin/showUser");
                                    }}
                                >
                                    <a
                                        className={`${activeMenu === `showUser` ||
                                            activeMenu === `editUser` ||
                                            activeMenu === `showUserCart`
                                            ? "active"
                                            : ""
                                            } waves-effect`}
                                    >
                                        <i className="uil-book-alt">
                                            <i className="fas fa-user"></i>
                                        </i>
                                        <span>Users</span>
                                    </a>
                                </li>)}

                            {/* Nottifly */}
                            {(userRole === "admin" || userRole === "role_1") &&
                                (<li
                                    className={`${activeMenu === "showNottifly" ||
                                        activeMenu === "editNottifly" ||
                                        activeMenu === "addNottifly" ||
                                        activeMenu === `showPostVideo` ||
                                        activeMenu === `addPostVideo` ||
                                        activeMenu === `editPostVideo` ||
                                        activeMenu === `addNews` ||
                                        activeMenu === `showNews` ||
                                        activeMenu === `editNews`
                                        ? "mm-active" : ""}`}
                                >
                                    <a
                                        className={`${activeMenu === "showNottifly" ||
                                            activeMenu === "editNottifly" ||
                                            activeMenu === "addNottifly" ||
                                            activeMenu === `showPostVideo` ||
                                            activeMenu === `addPostVideo` ||
                                            activeMenu === `editPostVideo` ||
                                            activeMenu === `addNews` ||
                                            activeMenu === `showNews` ||
                                            activeMenu === `editNews`
                                            ? "active" : ""
                                            } waves-effect d-flex sub-drop`}
                                        onClick={() => {
                                            document
                                                .querySelector(".sub-menu4")
                                                .classList.toggle("active");
                                            document.querySelector("#w-246").classList.toggle("active");
                                        }}
                                    >
                                        <div>
                                            <i className="uil-store">
                                                <i className="fas fa-dove"></i>
                                            </i>
                                            <span style={{ marginLeft: "3px" }}>Nottifly</span>
                                        </div>
                                        <img className="w-24" id="w-246" src={down_arrow} />
                                    </a>
                                    <ul className="sub-menu sub-menu4" aria-expanded="false">
                                        <li
                                            onClick={() => {
                                                Navigate("/admin/showNottifly");
                                            }}
                                            style={{ cursor: "pointer" }}
                                            className={`${activeMenu === "showNottifly" ||
                                                activeMenu === "addNottifly" ||
                                                activeMenu === "editNottifly"
                                                ? "mm-active" : ""}`}

                                        >
                                            <a> <i className="fas fa-dove"></i> Nottifly</a>
                                        </li>
                                        <li
                                            onClick={() => {
                                                Navigate("/admin/showPostVideo");
                                            }}
                                            style={{ cursor: "pointer" }}
                                            className={`${activeMenu === `showPostVideo` ||
                                                activeMenu === `addPostVideo` ||
                                                activeMenu === `editPostVideo`
                                                ? "mm-active" : ""}`}

                                        >
                                            <a> <i className="fas fa-video"></i> Post Videos</a>
                                        </li>
                                        <li
                                            onClick={() => {
                                                Navigate("/admin/showNews");
                                            }}
                                            style={{ cursor: "pointer" }}
                                            className={`${activeMenu === `addNews` ||
                                                activeMenu === `showNews` ||
                                                activeMenu === `editNews`
                                                ? "mm-active" : ""}`}

                                        >
                                            <a> <i className="fas fa-newspaper"></i> All News</a>
                                        </li>
                                        <li
                                            onClick={() => {
                                                Navigate("/admin/showNotification");
                                            }}
                                            style={{ cursor: "pointer" }}
                                            className={`${activeMenu === `sendNotification` ||
                                                activeMenu === `showNotification`
                                                ? "mm-active" : ""}`}

                                        >
                                            <a> <i className="fas fa-paper-plane"></i> All Notification</a>
                                        </li>
                                    </ul>
                                </li>)}

                            {/* Wallet/Coins */}
                            {(userRole === "admin") &&
                                (<li
                                    className={`${activeMenu === `showWalletHistory` ||
                                        activeMenu === `addWallet` ||
                                        activeMenu === `showCoupon` ||
                                        activeMenu === `addCoupon` ||
                                        activeMenu === `editCoupon` ||
                                        activeMenu === `showCoinsHistory` ||
                                        activeMenu === `addCoins`
                                        ? "mm-active" : ""}`}
                                >
                                    <a
                                        className={`${activeMenu === `showWalletHistory` ||
                                            activeMenu === `addWallet` ||
                                            activeMenu === `showCoupon` ||
                                            activeMenu === `addCoupon` ||
                                            activeMenu === `editCoupon` ||
                                            activeMenu === `showCoinsHistory` ||
                                            activeMenu === `addCoins`
                                            ? "active" : ""
                                            } waves-effect d-flex sub-drop`}
                                        onClick={() => {
                                            document
                                                .querySelector(".sub-menu5")
                                                .classList.toggle("active");
                                            document.querySelector("#w-247").classList.toggle("active");
                                        }}
                                    >
                                        <div>
                                            <i className="uil-store">
                                                <i class="fas fa-piggy-bank"></i>
                                            </i>
                                            <span style={{ marginLeft: "3px" }}>Wallet/Coins</span>
                                        </div>
                                        <img className="w-24" id="w-247" src={down_arrow} />
                                    </a>
                                    <ul className="sub-menu sub-menu5" aria-expanded="false">
                                        <li
                                            onClick={() => {
                                                Navigate("/admin/showWalletHistory");
                                            }}
                                            style={{ cursor: "pointer" }}
                                            className={`${activeMenu === `showWalletHistory` ||
                                                activeMenu === `addWallet`
                                                ? "mm-active" : ""}`}

                                        >
                                            <a> <i className="fas fa-wallet"></i> Wallet</a>
                                        </li>
                                        <li
                                            onClick={() => {
                                                Navigate("/admin/showCoinsHistory");
                                            }}
                                            style={{ cursor: "pointer" }}
                                            className={`${activeMenu === `showCoinsHistory` ||
                                                activeMenu === `addCoins`
                                                ? "mm-active" : ""}`}
                                        >
                                            <a>  <i className="fas fa-coins"></i> Coins</a>
                                        </li>
                                        <li
                                            onClick={() => {
                                                Navigate("/admin/showCoupon");
                                            }}
                                            style={{ cursor: "pointer" }}
                                            className={`${activeMenu === `showCoupon` ||
                                                activeMenu === `addCoupon` ||
                                                activeMenu === `editCoupon`
                                                ? "mm-active" : ""}`}

                                        >
                                            <a>  <i className="fas fa-ticket-alt"></i> Coupons</a>
                                        </li>
                                    </ul>
                                </li>)}

                            {/* Stock */}
                            {(userRole === "admin" || userRole === "role_1" || userRole === "role_2") &&
                                (<li
                                    className={`${activeMenu === `showLowStockProduct` ||
                                        activeMenu === `showProductNotify`
                                        ? "mm-active" : ""}`}
                                >
                                    <a
                                        className={`${activeMenu === `showLowStockProduct` ||
                                            activeMenu === `showProductNotify`
                                            ? "active" : ""
                                            } waves-effect d-flex sub-drop`}
                                        onClick={() => {
                                            document
                                                .querySelector(".sub-menu6")
                                                .classList.toggle("active");
                                            document.querySelector("#w-248").classList.toggle("active");
                                        }}
                                    >
                                        <div>
                                            <i className="uil-store">
                                                <i className="fas fa-boxes"></i>
                                            </i>
                                            <span style={{ marginLeft: "3px" }}>Stock</span>
                                        </div>
                                        <img className="w-24" id="w-248" src={down_arrow} />
                                    </a>
                                    <ul className="sub-menu sub-menu6" aria-expanded="false">
                                        <li
                                            onClick={() => {
                                                Navigate("/admin/showLowStockProduct");
                                            }}
                                            style={{ cursor: "pointer" }}
                                            className={`${activeMenu === `showLowStockProduct`
                                                ? "mm-active" : ""}`}

                                        >
                                            <a> <i className="fas fa-boxes"></i> Low Stock Product</a>
                                        </li>
                                        <li
                                            onClick={() => {
                                                Navigate("/admin/showProductNotify");
                                            }}
                                            style={{ cursor: "pointer" }}
                                            className={`${activeMenu === `showProductNotify`
                                                ? "mm-active" : ""}`}
                                        >
                                            <a>  <i className="fas fa-hand-holding-medical"></i> User Notify Product</a>
                                        </li>
                                    </ul>
                                </li>)}

                            {/* Customer Support */}
                            {(userRole === "admin" || userRole === "role_1" || userRole === "role_3") &&
                                (<li
                                    className={`${activeMenu === `showCustomerSupport` ||
                                        activeMenu === `showPostRequirement`
                                        ? "mm-active" : ""}`}
                                >
                                    <a
                                        className={`${activeMenu === `showCustomerSupport` ||
                                            activeMenu === `showPostRequirement`
                                            ? "active" : ""
                                            } waves-effect d-flex sub-drop`}
                                        onClick={() => {
                                            document
                                                .querySelector(".sub-menu7")
                                                .classList.toggle("active");
                                            document.querySelector("#w-249").classList.toggle("active");
                                        }}
                                    >
                                        <div>
                                            <i className="uil-store">
                                                <i className="fas fa-headset"></i>
                                            </i>
                                            <span style={{ marginLeft: "3px" }}>Customer Support</span>
                                        </div>
                                        <img className="w-24" id="w-249" src={down_arrow} />
                                    </a>
                                    <ul className="sub-menu sub-menu7" aria-expanded="false">
                                        <li
                                            onClick={() => {
                                                Navigate("/admin/showCustomerSupport");
                                            }}
                                            style={{ cursor: "pointer" }}
                                            className={`${activeMenu === `showCustomerSupport`
                                                ? "mm-active" : ""}`}

                                        >
                                            <a> <i className="fas fa-headset"></i> Customer Support</a>
                                        </li>
                                        <li
                                            onClick={() => {
                                                Navigate("/admin/showPostRequirement");
                                            }}
                                            style={{ cursor: "pointer" }}
                                            className={`${activeMenu === `showPostRequirement`
                                                ? "mm-active" : ""}`}
                                        >
                                            <a>  <i className="fas fa-file-signature"></i> Requirement Post</a>
                                        </li>
                                    </ul>
                                </li>)}

                            {/* Offers */}
                            {(userRole === "admin" || userRole === "role_1") &&
                                (<li
                                    className={`${activeMenu === `showOffers` ||
                                        activeMenu === `addOffers` ||
                                        activeMenu === `editOffers` ||
                                        activeMenu === `showUnder99` ||
                                        activeMenu === `addUnder99` ||
                                        activeMenu === `editUnder99` ||
                                        activeMenu === `showBanner` ||
                                        activeMenu === `addBanner` ||
                                        activeMenu === `editBanner` ||
                                        activeMenu === `showReview`
                                        ? "mm-active" : ""}`}
                                >
                                    <a
                                        className={`${activeMenu === `showOffers` ||
                                            activeMenu === `addOffers` ||
                                            activeMenu === `editOffers` ||
                                            activeMenu === `showUnder99` ||
                                            activeMenu === `addUnder99` ||
                                            activeMenu === `editUnder99` ||
                                            activeMenu === `showBanner` ||
                                            activeMenu === `addBanner` ||
                                            activeMenu === `editBanner` ||
                                            activeMenu === `showReview`
                                            ? "active" : ""
                                            } waves-effect d-flex sub-drop`}
                                        onClick={() => {
                                            document
                                                .querySelector(".sub-menu8")
                                                .classList.toggle("active");
                                            document.querySelector("#w-250").classList.toggle("active");
                                        }}
                                    >
                                        <div>
                                            <i className="uil-store">
                                                <i className="fa fa-gift"></i>
                                            </i>
                                            <span style={{ marginLeft: "3px" }}>Offers</span>
                                        </div>
                                        <img className="w-24" id="w-250" src={down_arrow} />
                                    </a>
                                    <ul className="sub-menu sub-menu8" aria-expanded="false">
                                        <li
                                            onClick={() => {
                                                Navigate("/admin/showOffers");
                                            }}
                                            style={{ cursor: "pointer" }}
                                            className={`${activeMenu === `showOffers` ||
                                                activeMenu === `addOffers` ||
                                                activeMenu === `editOffers`
                                                ? "mm-active" : ""}`}

                                        >
                                            <a> <i className="fa fa-gift"></i> All Offers</a>
                                        </li>
                                        <li
                                            onClick={() => {
                                                Navigate("/admin/showUnder99");
                                            }}
                                            style={{ cursor: "pointer" }}
                                            className={`${activeMenu === `showUnder99` ||
                                                activeMenu === `addUnder99` ||
                                                activeMenu === `editUnder99`
                                                ? "mm-active" : ""}`}
                                        >
                                            <a> <i className="fas fa-file-alt"></i> Under 99</a>
                                        </li>
                                        <li
                                            onClick={() => {
                                                Navigate("/admin/showBanner");
                                            }}
                                            style={{ cursor: "pointer" }}
                                            className={`${activeMenu === `showBanner` ||
                                                activeMenu === `addBanner` ||
                                                activeMenu === `editBanner`
                                                ? "mm-active" : ""}`}
                                        >
                                            <a> <i className="fas fa-images"></i> All Banners</a>
                                        </li>
                                        <li
                                            onClick={() => {
                                                Navigate("/admin/showReview");
                                            }}
                                            style={{ cursor: "pointer" }}
                                            className={`${activeMenu === `showReview`
                                                ? "mm-active" : ""}`}
                                        >
                                            <a> <i className="fas fa-user-edit"></i> Rating & Review</a>
                                        </li>
                                    </ul>
                                </li>)}

                            {/* Courior Prefernce */}
                            {(userRole === "admin" || userRole === "role_1") &&
                                (<li
                                    className={`${activeMenu === `showSpecification` ||
                                        activeMenu === `addSpecification` ||
                                        activeMenu === `editSpecification` ||
                                        activeMenu === `addShippingCharge` ||
                                        activeMenu === `editShippingCharge` ||
                                        activeMenu === `showShippingCharge`
                                        ? "mm-active" : ""}`}
                                >
                                    <a
                                        className={`${activeMenu === `showSpecification` ||
                                            activeMenu === `addSpecification` ||
                                            activeMenu === `editSpecification` ||
                                            activeMenu === `addShippingCharge` ||
                                            activeMenu === `editShippingCharge` ||
                                            activeMenu === `showShippingCharge`
                                            ? "active" : ""
                                            } waves-effect d-flex sub-drop`}
                                        onClick={() => {
                                            document
                                                .querySelector(".sub-menu9")
                                                .classList.toggle("active");
                                            document.querySelector("#w-251").classList.toggle("active");
                                        }}
                                    >
                                        <div>
                                            <i className="uil-store">
                                                <i className="fas fa-th-list"></i>
                                            </i>
                                            <span style={{ marginLeft: "3px" }}>Courier</span>
                                        </div>
                                        <img className="w-24" id="w-251" src={down_arrow} />
                                    </a>
                                    <ul className="sub-menu sub-menu9" aria-expanded="false">
                                        <li
                                            onClick={() => {
                                                Navigate("/admin/showSpecification");
                                            }}
                                            style={{ cursor: "pointer" }}
                                            className={`${activeMenu === `showSpecification` ||
                                                activeMenu === `addSpecification` ||
                                                activeMenu === `editSpecification`
                                                ? "mm-active" : ""}`}

                                        >
                                            <a> <i className="fas fa-th-list"></i> Courier Prefernce</a>
                                        </li>
                                        <li
                                            onClick={() => {
                                                Navigate("/admin/showShippingCharge");
                                            }}
                                            style={{ cursor: "pointer" }}
                                            className={`${activeMenu === `addShippingCharge` ||
                                                activeMenu === `editShippingCharge` ||
                                                activeMenu === `showShippingCharge`
                                                ? "mm-active" : ""}`}
                                        >
                                            <a>  <i className="fas fa-truck"></i> Shipping Charges</a>
                                        </li>
                                    </ul>
                                </li>)}

                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LeftSide;
