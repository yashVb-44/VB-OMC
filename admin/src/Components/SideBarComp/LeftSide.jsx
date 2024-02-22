import React, { useEffect, useState } from "react";
import logo_sm from "../../resources/assets/images/image_2023_08_19T05_11_01_553Z.png";
// import logo_sm from "../../resources/assets/images/logo-sm.png";
import logo_dark from "../../resources/assets/images/logo-dark.png";
import down_arrow from "../../resources/assets/images/down-arrow.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../resources/assets/images/omc_logo.png"

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
                            {/* <img src={settingsData?.app_logo} alt="" height={40} width={40} /> */}
                            <img src={logo} alt="" height={40} width={40} />
                        </span>
                        <span className="logo-lg">
                            {/* <img src={settingsData?.app_logo} alt="" height={40} width={40} /> */}
                            <img src={logo} alt="" height={40} width={40} />
                        </span>
                    </a>

                    <a className="logo logo-light">
                        <span className="logo-sm">
                            {/* <img src={settingsData?.app_logo} alt="" height={40} width={40} /> */}
                            <img src={logo} alt="" height={40} width={40} />
                        </span>
                        <span className="logo-lg">
                            {/* <img src={settingsData?.app_logo} alt="" height={40} width={40} /> */}
                            <img src={logo} alt="" height={40} width={40} />
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

                            <li className="menu-title">Apps</li>

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

                            {/* Restaurant */}
                            {(userRole === "admin") &&
                                (<li
                                    className={`${activeMenu === `showRestaurant` ||
                                        activeMenu === `editRestaurant` ||
                                        activeMenu === `createRestaurant`
                                        ? "mm-active"
                                        : ""
                                        }`}
                                    onClick={() => {
                                        Navigate("/admin/showRestaurant");
                                    }}
                                >
                                    <a
                                        className={`${activeMenu === `showRestaurant` ||
                                            activeMenu === `editRestaurant` ||
                                            activeMenu === `createRestaurant`
                                            ? "active"
                                            : ""
                                            } waves-effect`}
                                    >
                                        <i className="uil-book-alt">
                                            <i className="fas fa-house-user"></i>
                                        </i>
                                        <span>Restaurants</span>
                                    </a>
                                </li>)}


                            {/* Zones */}
                            {/* {(userRole === "admin") &&
                                (<li
                                    className={`${activeMenu === `showZone` ||
                                        activeMenu === `editZone` ||
                                        activeMenu === `addZone`
                                        ? "mm-active"
                                        : ""
                                        }`}
                                    onClick={() => {
                                        Navigate("/admin/showZone");
                                    }}
                                >
                                    <a
                                        className={`${activeMenu === `showZone` ||
                                            activeMenu === `addZone` ||
                                            activeMenu === `editZone`
                                            ? "active"
                                            : ""
                                            } waves-effect`}
                                    >
                                        <i className="uil-book-alt">
                                            <i className="fas fa-stop-circle"></i>
                                        </i>
                                        <span>Zones</span>
                                    </a>
                                </li>)} */}


                            {/* State */}
                            {/* {(userRole === "admin") &&
                                (<li
                                    className={`${activeMenu === `showState` ||
                                        activeMenu === `editState` ||
                                        activeMenu === `editCity` ||
                                        activeMenu === `showCity`
                                        ? "mm-active"
                                        : ""
                                        }`}
                                    onClick={() => {
                                        Navigate("/admin/showState");
                                    }}
                                >
                                    <a
                                        className={`${activeMenu === `showState` ||
                                            activeMenu === `editState` ||
                                            activeMenu === `editCity` ||
                                            activeMenu === `showCity`
                                            ? "active"
                                            : ""
                                            } waves-effect`}
                                    >
                                        <i className="uil-book-alt">
                                            <i className="fas fa-city"></i>
                                        </i>
                                        <span>State & City</span>
                                    </a>
                                </li>)} */}


                            {/* Banner */}
                            {(userRole === "admin") &&
                                (<li
                                    className={`${activeMenu === `showBanner` ||
                                        activeMenu === `editBanner` ||
                                        activeMenu === `addBanner`
                                        ? "mm-active"
                                        : ""
                                        }`}
                                    onClick={() => {
                                        Navigate("/admin/showBanner");
                                    }}
                                >
                                    <a
                                        className={`${activeMenu === `showBanner` ||
                                            activeMenu === `editBanner` ||
                                            activeMenu === `addBanner`
                                            ? "active"
                                            : ""
                                            } waves-effect`}
                                    >
                                        <i className="uil-book-alt">
                                            <i className="fas fa-window-maximize"></i>
                                        </i>
                                        <span>Banner</span>
                                    </a>
                                </li>)}


                            {/* WarningLabel */}
                            {(userRole === "admin") &&
                                (<li
                                    className={`${activeMenu === `showWarningLabels` ||
                                        activeMenu === `editWarningLabels` ||
                                        activeMenu === `addWarningLabels`
                                        ? "mm-active"
                                        : ""
                                        }`}
                                    onClick={() => {
                                        Navigate("/admin/showWarningLabels");
                                    }}
                                >
                                    <a
                                        className={`${activeMenu === `showWarningLabels` ||
                                            activeMenu === `editWarningLabels` ||
                                            activeMenu === `addWarningLabels`
                                            ? "active"
                                            : ""
                                            } waves-effect`}
                                    >
                                        <i className="uil-book-alt">
                                            <i className="fa fa-exclamation-triangle"></i>
                                        </i>
                                        <span>Warning-Label</span>
                                    </a>
                                </li>)}

                            {/* Meal Package */}
                            {(userRole === "admin" || userRole === "restaurant") &&
                                (<li
                                    className={`${activeMenu === `showMeal` ||
                                        activeMenu === `editMeal` ||
                                        activeMenu === `addMeal` ||
                                        activeMenu === `addRestaurantMeal` ||
                                        activeMenu === `showCustomization` ||
                                        activeMenu === `showCustomizationSegment`
                                        ? "mm-active"
                                        : ""
                                        }`}
                                    onClick={() => {
                                        Navigate("/admin/showMeal");
                                    }}
                                >
                                    <a
                                        className={`${activeMenu === `showMeal` ||
                                            activeMenu === `editMeal` ||
                                            activeMenu === `addMeal` ||
                                            activeMenu === `addRestaurantMeal` ||
                                            activeMenu === `showCustomization` ||
                                            activeMenu === `showCustomizationSegment`
                                            ? "active"
                                            : ""
                                            } waves-effect`}
                                    >
                                        <i className="uil-book-alt">
                                            <i className="fas fa-hamburger"></i>
                                        </i>
                                        <span>Meal</span>
                                    </a>
                                </li>)}

                            {/* Subscription */}
                            {(userRole === "admin") &&
                                (<li
                                    className={`${activeMenu === `showSubscription` ||
                                        activeMenu === `editSubscription` ||
                                        activeMenu === `addSubscription`
                                        ? "mm-active"
                                        : ""
                                        }`}
                                    onClick={() => {
                                        Navigate("/admin/showSubscription");
                                    }}
                                >
                                    <a
                                        className={`${activeMenu === `showSubscription` ||
                                            activeMenu === `editSubscription` ||
                                            activeMenu === `addSubscription`
                                            ? "active"
                                            : ""
                                            } waves-effect`}
                                    >
                                        <i className="uil-book-alt">
                                            <i className="fas fa-window-maximize"></i>
                                        </i>
                                        <span>Subscription</span>
                                    </a>
                                </li>)}

                            {/* Country */}
                            {(userRole === "admin") &&
                                (<li
                                    className={`${activeMenu === `showCountry` ||
                                        activeMenu === `addCountry` ||
                                        activeMenu === `editCountry`
                                        ? "mm-active"
                                        : ""
                                        }`}
                                    onClick={() => {
                                        Navigate("/admin/showCountry");
                                    }}
                                >
                                    <a
                                        className={`${activeMenu === `showCountry` ||
                                            activeMenu === `addCountry` ||
                                            activeMenu === `editCountry`
                                            ? "active"
                                            : ""
                                            } waves-effect`}
                                    >
                                        <i className="uil-book-alt">
                                            <i className="fa fa-flag"></i>
                                        </i>
                                        <span>Country</span>
                                    </a>
                                </li>)}

                            {/* State */}
                            {(userRole === "admin") &&
                                (<li
                                    className={`${activeMenu === `showState` ||
                                        activeMenu === `addState` ||
                                        activeMenu === `editState`
                                        ? "mm-active"
                                        : ""
                                        }`}
                                    onClick={() => {
                                        Navigate("/admin/showState");
                                    }}
                                >
                                    <a
                                        className={`${activeMenu === `showState` ||
                                            activeMenu === `addState` ||
                                            activeMenu === `editState`
                                            ? "active"
                                            : ""
                                            } waves-effect`}
                                    >
                                        <i className="uil-book-alt">
                                            <i className="fas fa-chart-pie"></i>
                                        </i>
                                        <span>State</span>
                                    </a>
                                </li>)}

                            {/* City */}
                            {(userRole === "admin") &&
                                (<li
                                    className={`${activeMenu === `showCity` ||
                                        activeMenu === `addCity` ||
                                        activeMenu === `editCity`
                                        ? "mm-active"
                                        : ""
                                        }`}
                                    onClick={() => {
                                        Navigate("/admin/showCity");
                                    }}
                                >
                                    <a
                                        className={`${activeMenu === `showCity` ||
                                            activeMenu === `addCity` ||
                                            activeMenu === `editCity`
                                            ? "active"
                                            : ""
                                            } waves-effect`}
                                    >
                                        <i className="uil-book-alt">
                                            <i className="fas fa-city"></i>
                                        </i>
                                        <span>City</span>
                                    </a>
                                </li>)}

                            {/* Blogs */}
                            {/* {(userRole === "admin") &&
                                (<li
                                    className={`${activeMenu === `showBlogs` ||
                                        activeMenu === `editBlogs` ||
                                        activeMenu === `addBlogs`
                                        ? "mm-active"
                                        : ""
                                        }`}
                                    onClick={() => {
                                        Navigate("/admin/showBlogs");
                                    }}
                                >
                                    <a
                                        className={`${activeMenu === `showBlogs` ||
                                            activeMenu === `editBlogs` ||
                                            activeMenu === `addBlogs`
                                            ? "active"
                                            : ""
                                            } waves-effect`}
                                    >
                                        <i className="uil-book-alt">
                                            <i className="fas fa-book"></i>
                                        </i>
                                        <span>Blogs</span>
                                    </a>
                                </li>)} */}

                            {userRole === "restaurant" && <li className="menu-title">Settings</li>}

                            {/* date & time */}
                            {(userRole === "restaurant") &&
                                (<li
                                    className={`${activeMenu === `editRestaurantProfile`
                                        ? "mm-active"
                                        : ""
                                        }`}
                                    onClick={() => {
                                        Navigate("/admin/editRestaurantProfile");
                                    }}
                                >
                                    <a
                                        className={`${activeMenu === `editRestaurantProfile`
                                            ? "active"
                                            : ""
                                            } waves-effect`}
                                    >
                                        <i className="uil-book-alt">
                                            <i className="fas fa-user-edit"></i>
                                        </i>
                                        <span> Profile</span>
                                    </a>
                                </li>)}

                            {/* date & time */}
                            {(userRole === "restaurant") &&
                                (<li
                                    className={`${activeMenu === `editRestaurantDaysTime`
                                        ? "mm-active"
                                        : ""
                                        }`}
                                    onClick={() => {
                                        Navigate("/admin/editRestaurantDaysTime");
                                    }}
                                >
                                    <a
                                        className={`${activeMenu === `editRestaurantDaysTime`
                                            ? "active"
                                            : ""
                                            } waves-effect`}
                                    >
                                        <i className="uil-book-alt">
                                            <i className="fas fa-business-time"></i>
                                        </i>
                                        <span> Day/Time</span>
                                    </a>
                                </li>)}

                            {/* delivery zones */}
                            {(userRole === "restaurant") &&
                                (<li
                                    className={`${activeMenu === `deliveryZone`
                                        ? "mm-active"
                                        : ""
                                        }`}
                                    onClick={() => {
                                        Navigate("/admin/deliveryZone");
                                    }}
                                >
                                    <a
                                        className={`${activeMenu === `deliveryZone`
                                            ? "active"
                                            : ""
                                            } waves-effect`}
                                    >
                                        <i className="uil-book-alt">
                                            <i className="fas fa-map"></i>
                                        </i>
                                        <span>Delivery Zone</span>
                                    </a>
                                </li>)}

                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LeftSide;
