import React, { useRef, useState } from "react";
import defualtImage from "../../../../resources/assets/images/add-image.png";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AlertBox from "../../../../Components/AlertComp/AlertBox";
import Modal from "react-modal";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Select from "react-select";
import { useSelector } from "react-redux";

let url = process.env.REACT_APP_API_URL

const EditMeal = ({ role, id }) => {

    const selectedMealData = useSelector((state) => state?.MealDataChange?.payload)
    const adminToken = localStorage.getItem('token');
    const [mealData, setMealData] = useState({})
    const Navigate = useNavigate();

    useEffect(() => {
        async function getMeal() {
            try {
                const res = await axios.get(`${url}/meal/single/get/${selectedMealData}`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    });

                setMealData(res?.data?.meal || {});
            } catch (error) {
                console.log(error)
            }
        }
        getMeal();
    }, [selectedMealData]);


    useEffect(() => {
        setMealName(mealData?.name)
        setMeals(mealData?.meals)
        setBite(mealData?.bites)
        setDescription(mealData?.description)
        setIsCustimizeMandatory(mealData?.isCustimizeMandatory)

        if (Array.isArray(mealData?.warningLabels)) {
            const selectedWarningLabels = mealData?.warningLabels?.map(warning => ({
                value: warning,
                label: warning
            }));
            setSelectedWarningLabels(selectedWarningLabels);
        } else {
            setSelectedWarningLabels([]);
        }

        const selectedRestaurant = {
            value: mealData?.restaurant?._id,
            label: mealData?.restaurant?.name,
        };
        setSelectedRestaurant(selectedRestaurant);
        setPreviewCoverImage(mealData?.cover)
        setPreviewGallaryImage(mealData?.gallary)


    }, [mealData])


    // meal
    const [mealName, setMealName] = useState("");

    const [meals, setMeals] = useState(0)
    const [bite, setBite] = useState(0)
    const [description, setDescription] = useState("");
    const [isCustimizeMandatory, setIsCustimizeMandatory] = useState()

    const [previewCoverImage, setPreviewCoverImage] = useState(mealData?.cover)
    const [previewGallaryImage, setPreviewGallaryImage] = useState(
        mealData?.gallary?.map((image) => image) || []
    );
    const [mealCoverImage, setMealCoverImage] = useState("");
    const [gallaryImages, setGallaryImages] = useState([]);

    const [selectedRestaurant, setSelectedRestaurant] = useState("");
    const [restaurantOptions, setRestaurantOptions] = useState([]);
    const [selectedWarningLabels, setSelectedWarningLabels] = useState([]);
    const [warningLabelsOptions, setWarningLabelsOptions] = useState([]);

    const [mealAddStatus, setMealAddStatus] = useState();
    const [statusMessage, setStatusMessage] = useState("");


    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);


    const CustimizeMandatory = [
        { name: "No", value: false },
        { name: "Yes", value: true }
    ]


    useEffect(() => {
        Modal.setAppElement(document.body);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        setButtonDisabled(true)

        if (mealName !== "") {
            const formData = new FormData();
            formData.append("name", mealName);
            formData.append("meals", meals);
            formData.append("bites", bite);

            formData.append("restaurant", selectedRestaurant?.value);

            formData.append("description", description);

            const SelectedAmenities = selectedWarningLabels.map(amenitie => amenitie.value);
            formData.append("warningLabels", SelectedAmenities);
            formData.append("isCustimizeMandatory", isCustimizeMandatory);

            formData.append("cover", mealCoverImage);
            gallaryImages?.forEach((image) => {
                formData.append('gallary', image);
            });


            try {
                let response = await axios.put(
                    `${url}/meal/update/${selectedMealData}`,
                    formData,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    }
                );
                if (response.data.type === "success") {
                    setMealAddStatus(response.data.type);
                    let alertBox = document.getElementById("alert-box");
                    alertBox.classList.add("alert-wrapper");
                    setStatusMessage(response.data.message);

                    setTimeout(() => {
                        Navigate("/admin/showMeal");
                    }, 900);

                } else {
                    setMealAddStatus(response.data.type);
                    let alertBox = document.getElementById("alert-box");
                    alertBox.classList.add("alert-wrapper");
                    setStatusMessage(response.data.message);
                }
            } catch (error) {
                setMealAddStatus("error");
                let alertBox = document.getElementById("alert-box");
                alertBox.classList.add("alert-wrapper");
                setStatusMessage("Meal not Update !");
            }
            finally {
                setLoading(false)
                setButtonDisabled(false)
            }

        }
    };

    useEffect(() => {
        setGallaryImages([]);
        setPreviewGallaryImage(
            mealData?.gallary?.map((image) => image) || []
        );
    }, []);

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        setGallaryImages(files);
        setPreviewGallaryImage(files?.map((file) => URL.createObjectURL(file)));
    };


    useEffect(() => {
        const timer = setTimeout(() => {
            setMealAddStatus("");
            setStatusMessage("");
            let alertBox = document?.getElementById("alert-box");
            alertBox?.classList?.remove("alert-wrapper");
        }, 1500);

        return () => clearTimeout(timer);
    }, [mealAddStatus, statusMessage]);

    useEffect(() => {
        // Fetch restaurant data from your API
        async function fetchRestaurantData() {
            try {
                const response = await axios.get(`${url}/restaurant/list/getAll`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    });
                const options = response?.data?.restaurant?.map((option) => ({
                    value: option._id,
                    label: option.name.charAt(0).toUpperCase() + option.name.slice(1),
                }));
                setRestaurantOptions(options);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        }


        // Fetch Warning-Labels data from your API
        async function fetchWarningLabelsData() {
            try {
                const response = await axios.get(`${url}/warningLabels/list/getAll`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    });
                const options = response?.data?.warningLabel?.map((option) => ({
                    value: option.name,
                    label: option.name,
                }));
                setWarningLabelsOptions(options);
            } catch (error) {
                console.error('Failed to fetch Warning-Labels:', error);
            }
        }

        fetchRestaurantData()
        fetchWarningLabelsData()

    }, [selectedRestaurant, selectedWarningLabels]);

    const handleRestaurantChange = (selectedOptions) => {
        setSelectedRestaurant(selectedOptions);
    };

    const handleWarningLabelsChange = (selectedOptions) => {
        setSelectedWarningLabels(selectedOptions);
    };

    const handleDescriptionChange = (selectedOptions) => {
        setDescription(selectedOptions);
    };


    //  for react quill (long desc)
    const editor = useRef();


    const tableOptions = [];
    const maxRows = 8;
    const maxCols = 5;
    for (let r = 1; r <= maxRows; r++) {
        for (let c = 1; c <= maxCols; c++) {
            tableOptions.push('newtable_' + r + '_' + c);
        }
    }

    const editorModules = {
        toolbar: [
            [{ header: '1' }, { header: '2' }, { header: [3, 4, 5, 6] }, { font: [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'video', 'image'],
            ['clean'],
            ['code-block'],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }, { table: tableOptions }],
        ],
    };

    // custom style for react quill
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
                                    <h4 className="mb-0">Edit Meal</h4>
                                    {loading && <div className="loader">Loading...</div>}
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
                                                    Meal Name:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        required
                                                        className="form-control"
                                                        type="text"
                                                        id="example-text-input"
                                                        value={mealName}
                                                        onChange={(e) => {
                                                            setMealName(e.target.value);
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Warning-Labels:
                                                </label>
                                                <div className="col-md-10">
                                                    <Select
                                                        required
                                                        value={selectedWarningLabels}
                                                        onChange={handleWarningLabelsChange}
                                                        options={warningLabelsOptions}
                                                        placeholder="Select WarningLabels"
                                                        className="w-full md:w-20rem"
                                                        isMulti
                                                    // styles={customStyles}
                                                    />
                                                </div>
                                            </div>

                                            {role === "admin" &&
                                                <div className="mb-3 row">
                                                    <label
                                                        htmlFor="example-text-input"
                                                        className="col-md-2 col-form-label"
                                                    >
                                                        Restaurant Name:
                                                    </label>
                                                    <div className="col-md-10">
                                                        <Select
                                                            required
                                                            value={selectedRestaurant}
                                                            onChange={handleRestaurantChange}
                                                            options={restaurantOptions}
                                                            placeholder="Select Restaurant"
                                                            className="w-full md:w-20rem"
                                                        // styles={customStyles}
                                                        />
                                                    </div>
                                                </div>
                                            }

                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Meals:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        min="0"
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        id="example-number-input"
                                                        value={meals}
                                                        onChange={(e) => {
                                                            setMeals(e.target.value);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Bites:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        min="0"
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        id="example-number-input"
                                                        value={bite}
                                                        onChange={(e) => {
                                                            setBite(e.target.value);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Description:
                                                </label>
                                                <div className="col-md-10">
                                                    <ReactQuill
                                                        ref={editor}
                                                        value={description}
                                                        onChange={handleDescriptionChange}
                                                        modules={editorModules}
                                                        className="custom-quill-editor"
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Meal Cover Image:
                                                    <div className="imageSize">(Recommended Resolution:
                                                        W-971 X H-1500,
                                                        W-1295 X H-2000,
                                                        W-1618 X H-2500 )</div>
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        className="form-control"
                                                        type="file"
                                                        onChange={(e) => {
                                                            const selectedFile = e.target.files[0];
                                                            if (selectedFile && selectedFile.size > 10000000) {
                                                                alert('File size is too large. Maximum size allowed is 10MB.');
                                                                e.target.value = '';
                                                                return;
                                                            }
                                                            setMealCoverImage(selectedFile)
                                                        }}
                                                        id="example-text-input"
                                                    />
                                                    <div className="fileupload_img col-md-10 mt-3">
                                                        <img
                                                            type="image"
                                                            src={mealCoverImage ? URL.createObjectURL(mealCoverImage) : `${previewCoverImage}`}
                                                            alt="mealCoverImage image"
                                                            height={100}
                                                            width={100}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Gallary Images:
                                                    <div className="imageSize">(Recommended Resolution:
                                                        W-971 X H-1500,
                                                        W-1295 X H-2000,
                                                        W-1618 X H-2500 )</div>
                                                </label>
                                                <div className="col-md-10">
                                                    <div className="fileupload_block">
                                                        <input
                                                            type="file"
                                                            name="gallary_image"
                                                            className="form-control"
                                                            multiple
                                                            onChange={handleFileSelect}
                                                            id="example-text-input"
                                                        />
                                                    </div>
                                                    <div className="fileupload_img col-md-10 mt-3">
                                                        {previewGallaryImage.length <= 0 && (
                                                            <img
                                                                type="image"
                                                                src={defualtImage}
                                                                alt="meal image"
                                                                height={100}
                                                                width={100}
                                                            />
                                                        )}
                                                        {previewGallaryImage?.map((preview, index) => (
                                                            <img
                                                                key={index}
                                                                src={preview}
                                                                alt="Preview"
                                                                style={{ marginTop: "15px", marginLeft: "15px" }}
                                                                height={100}
                                                                width={100}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Customization Required:
                                                </label>
                                                <div className="col-md-10">
                                                    <select
                                                        required
                                                        className="form-select"
                                                        id="subcategory-select"
                                                        value={isCustimizeMandatory}
                                                        onChange={(e) => {
                                                            setIsCustimizeMandatory(e.target.value);
                                                        }}
                                                    >
                                                        {CustimizeMandatory.map((value) => (
                                                            <option key={value?.name} value={value?.value}>
                                                                {value?.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>


                                            <div className="mb-3 row">
                                                <div className="col-md-10 offset-md-2">
                                                    <div className="row mb-10">
                                                        <div className="col ms-auto">
                                                            <div className="d-flex flex-reverse flex-wrap gap-2">
                                                                <a
                                                                    className="btn btn-danger"
                                                                    onClick={() => Navigate("/admin/showMeal")}
                                                                >
                                                                    {" "}
                                                                    <i className="fas fa-window-close"></i> Cancel{" "}
                                                                </a>
                                                                <button
                                                                    className="btn btn-success"
                                                                    type="submit"
                                                                    disabled={buttonDisabled}
                                                                >
                                                                    {" "}
                                                                    <i className="fas fa-save"></i> Save{" "}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <AlertBox status={mealAddStatus} statusMessage={statusMessage} />
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

export default EditMeal;