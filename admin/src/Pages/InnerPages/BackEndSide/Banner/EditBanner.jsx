import React, { useState, useEffect } from "react";
import AlertBox from '../../../../Components/AlertComp/AlertBox';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Select from "react-select";

const url = process.env.REACT_APP_API_URL;

const EditBanner = () => {
    const adminToken = localStorage.getItem('token');
    const Navigate = useNavigate();
    const selectedBannerData = useSelector((state) => state?.BannerDataChange?.payload);
    const [bannerData, setBannerData] = useState({})

    useEffect(() => {
        async function getBanner() {
            try {
                const res = await axios.get(`${url}/banner/get/${selectedBannerData?._id}`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    });
                setBannerData(res?.data?.banner || {});
            } catch (error) {
                console.log(error)
            }
        }
        getBanner();
    }, [selectedBannerData]);


    useEffect(() => {
        setBannerName(bannerData?.name || '');

        const selectedCategoriesIds = {
            value: bannerData?.Meal?._id || '',
            label: bannerData?.Meal?.name || ''
        };

        setSelectedCategories(selectedCategoriesIds);
    }, [bannerData]);;


    const [bannerName, setBannerName] = useState(selectedBannerData?.name || '');
    const [bannerImage, setBannerImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(selectedBannerData?.image || '');
    const [sequence, setSequence] = useState(selectedBannerData?.sequence || '');
    const [mealOptions, setMealOptions] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState("");
    // const [bannerLink, setBannerLink] = useState(selectedBannerData?.link || '');
    const [statusMessage, setStatusMessage] = useState('');
    const [bannerAddStatus, setBannerAddStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (bannerName !== "") {
            const formData = new FormData();
            formData.append("name", bannerName);
            formData.append("image", bannerImage);
            // formData.append("Banner_Link", bannerLink);
            formData.append("sequence", sequence);
            const selectedMealIds = selectedCategories?.value;
            formData.append("meal", selectedMealIds);

            try {
                const response = await axios.put(
                    `${url}/banner/update/${selectedBannerData?._id}`,
                    formData,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    }
                );

                if (response.data.type === "success") {
                    setBannerAddStatus(response.data.type);
                    setStatusMessage(response.data.message);

                    setTimeout(() => {
                        Navigate("/admin/showBanner");
                    }, 900);
                } else {
                    setBannerAddStatus(response.data.type);
                    setStatusMessage(response.data.message);
                }
            } catch (error) {
                setBannerAddStatus("error");
                setStatusMessage("Banner not Update !");
            }
        }
    };

    const handleMealChange = (selectedOptions) => {
        setSelectedCategories(selectedOptions);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setBannerAddStatus("");
            setStatusMessage("");
        }, 1500);

        return () => clearTimeout(timer);
    }, [bannerAddStatus, statusMessage]);


    useEffect(() => {
        async function fetchMealData() {
            try {
                const mealResponse = await axios.get(
                    `${url}/meal/active/list/get/forAdmin`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    }
                );
                const options = mealResponse?.data?.meal?.map((option) => ({
                    value: option._id,
                    label: option.name,
                }));
                setMealOptions(options);

            } catch (error) {
                console.error("Failed to fetch meals:", error);
            }
        }
        fetchMealData();
    }, []);

    const customStyles = {
        singleValue: (provided) => ({
            ...provided,
            color: 'black',
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? 'white' : 'white',
            color: state.isSelected ? 'black' : 'black',
            ':hover': {
                backgroundColor: '#e6f7ff',
            },
        }),
    };

    return (
        <>
            <div className="main-content dark">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="page-title-box d-flex align-items-center justify-content-between">
                                    <h4 className="mb-0">Edit Banner</h4>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Banner Name:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        required
                                                        className="form-control"
                                                        type="text"
                                                        id="example-text-input"
                                                        value={bannerName}
                                                        onChange={(e) => {
                                                            setBannerName(e.target.value);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Banner Sequence:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        min="1"
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={sequence}
                                                        onChange={(e) => setSequence(e.target.value)}
                                                        id="example-number-input"
                                                    />
                                                </div>
                                            </div>
                                            {/* <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Meal Name:
                                                </label>
                                                <div className="col-md-10">
                                                    <Select
                                                        value={SelectedMeal}
                                                        defaultInputValue={selectedBannerData?.Meal_Name}
                                                        defaultValue={selectedBannerData?.Meal_Name}
                                                        onChange={(e) => {
                                                            setSelectedMeal(e);
                                                        }}
                                                        options={options}
                                                        styles={customStyles}
                                                    />
                                                </div>
                                            </div> */}
                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Meal Name:
                                                </label>
                                                <div className="col-md-10">
                                                    <Select
                                                        required
                                                        value={selectedCategories}
                                                        onChange={handleMealChange}
                                                        options={mealOptions}
                                                        placeholder="Select Meal"
                                                        className="w-full md:w-20rem"
                                                        styles={customStyles}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Banner Image:
                                                    <div className="imageSize">(Recommended Resolution: W-856 x H-400 )</div>
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        className="form-control"
                                                        type="file"
                                                        onChange={(e) => {
                                                            setBannerImage(e.target.files[0]);
                                                        }}
                                                        id="example-text-input"
                                                    />
                                                    <div className="fileupload_img col-md-10 mt-3 mb-2">
                                                        <img
                                                            type="image"
                                                            src={bannerImage ? URL.createObjectURL(bannerImage) : `${previewImage}`}
                                                            alt="user image"
                                                            height={100}
                                                            width={100}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Banner Link:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        className="form-control"
                                                        type="url"
                                                        value={bannerLink}
                                                        onChange={(e) => setBannerLink(e.target.value)}
                                                        id="example-url-input"
                                                    />
                                                </div>
                                            </div> */}
                                            <div className="mb-3 row">
                                                <div className="col-md-10 offset-md-2">
                                                    <div className="row mb-10">
                                                        <div className="col ms-auto">
                                                            <div className="d-flex flex-reverse flex-wrap gap-2">
                                                                <a
                                                                    className="btn btn-danger"
                                                                    onClick={() => Navigate("/admin/showBanner")}
                                                                >
                                                                    {" "}
                                                                    <i className="fas fa-window-close"></i> Cancel{" "}
                                                                </a>
                                                                <button className="btn btn-success" type="submit">
                                                                    {" "}
                                                                    <i className="fas fa-save"></i> Save{" "}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <AlertBox status={bannerAddStatus} statusMessage={statusMessage} />
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditBanner;
