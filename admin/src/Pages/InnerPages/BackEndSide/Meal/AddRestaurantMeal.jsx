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
import AddCustomization from "../Customization/AddCustomization ";
// import "react-multi-date-picker/styles/clean.css";


let url = process.env.REACT_APP_API_URL

const AddRestaurantMeal = ({ role, id }) => {

    const adminToken = localStorage.getItem('token');
    const Navigate = useNavigate();

    // meal
    const [mealName, setMealName] = useState("");
    const [meals, setMeals] = useState(0)
    const [bite, setBite] = useState(0)

    const [mealCoverImage, setMealCoverImage] = useState("");
    const [gallaryImages, setGallaryImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    const [selectedRestaurant, setSelectedRestaurant] = useState("");
    const [restaurantOptions, setRestaurantOptions] = useState([]);
    const [selectedWarningLabels, setSelectedWarningLabels] = useState([]);
    const [warningLabelsOptions, setWarningLabelsOptions] = useState([])


    const [description, setDescription] = useState("");

    const [mealAddStatus, setMealAddStatus] = useState();
    const [statusMessage, setStatusMessage] = useState("");


    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const [isCustimizeMandatory, setIsCustimizeMandatory] = useState(false)

    // customization
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customizations, setCustomizations] = useState([]);

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
            if (customizations.length <= 0) {
                setMealAddStatus("warning")
                setStatusMessage("Please Add atleast one Customization")
                setLoading(false)
                setButtonDisabled(false)
            }
            else {
                const formData = new FormData();
                formData.append("name", mealName);
                formData.append("meals", meals);
                formData.append("bites", bite);

                formData.append("restaurant", id);

                formData.append("description", description);

                const SelectedWarningLabels = selectedWarningLabels.map(amenitie => amenitie.value);
                formData.append("warningLabels", SelectedWarningLabels);
                formData.append("isCustimizeMandatory", isCustimizeMandatory);

                formData.append("cover", mealCoverImage);
                gallaryImages?.forEach((image) => {
                    formData.append('gallary', image);
                });


                try {
                    let response = await axios.post(
                        `${url}/meal/add/byRestaurant`,
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

                        const mealId = response?.data?.mealId

                        try {
                            for (const customization of customizations) {
                                const customizationFormData = new FormData();
                                customizationFormData.append('name', customization?.name);
                                customizationFormData.append('type', customization?.type);
                                customizationFormData.append('isCustimizeMandatory', customization?.required);
                                customization?.segments?.forEach((segment) => {
                                    customizationFormData.append('segmentName', segment?.name);
                                    customizationFormData.append('bites', segment?.bite);
                                });

                                await axios.post(`${url}/meal/customization/add/${mealId}`, customizationFormData,
                                    {
                                        headers: {
                                            Authorization: `${adminToken}`,
                                        },
                                    });
                                setCustomizations("")
                            }

                        } catch (error) {
                            console.log(error)
                        }
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
                    setStatusMessage("Meal not Add !");
                }
                finally {
                    setLoading(false)
                    setButtonDisabled(false)
                }

            }
        }
    };

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        setGallaryImages((prevGallaryImages) =>
            prevGallaryImages.concat(files)
        );
        setImagePreviews(files.map((file) => URL.createObjectURL(file)));
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

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleDeleteCustomization = (index) => {
        const updatedCustomizations = [...customizations];
        updatedCustomizations.splice(index, 1);
        setCustomizations(updatedCustomizations);
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
            [{ segment: [] }],
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


    return (
        <>
            <div className="main-content dark">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="page-title-box d-flex align-items-center justify-content-between">
                                    <h4 className="mb-0">Add Meal</h4>
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

                                            {/* <div className="mb-3 row">
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
                                            </div> */}
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
                                                        required
                                                        className="form-control"
                                                        type="file"
                                                        onChange={(e) => {
                                                            const selectedFile = e.target.files[0];
                                                            if (selectedFile && selectedFile.segment > 10000000) {
                                                                alert('File segment is too large. Maximum segment allowed is 10MB.');
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
                                                            src={
                                                                mealCoverImage
                                                                    ? URL.createObjectURL(mealCoverImage)
                                                                    : defualtImage
                                                            }
                                                            alt="meal cover image"
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
                                                    Meal Gallary Images:
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
                                                            required
                                                        />
                                                    </div>
                                                    <div className="fileupload_img col-md-10 mt-3">
                                                        {imagePreviews.length <= 0 && (
                                                            <img
                                                                type="image"
                                                                src={defualtImage}
                                                                alt="product image"
                                                                height={100}
                                                                width={100}
                                                            />
                                                        )}
                                                        {imagePreviews?.map((preview, index) => (
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
                                            <div className="mb-3 mt-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Add Customization:
                                                </label>
                                                <div className="col-md-10">
                                                    <div className="d-flex flex-reverse flex-wrap gap-2">
                                                        <a
                                                            className="btn btn-primary"
                                                            onClick={handleOpenModal}
                                                        >
                                                            {" "}
                                                            <i className="fas fa-plus-circle"></i> Add{" "}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>

                                            <Modal
                                                className="main-content dark"
                                                isOpen={isModalOpen}
                                                onRequestClose={handleCloseModal}
                                            >
                                                <AddCustomization />
                                            </Modal>

                                            {!customizations.length <= 0 &&
                                                <div className="mb-3 row">
                                                    <label
                                                        htmlFor="example-text-input"
                                                        className="col-md-2 col-form-label"
                                                    >
                                                        Customization :
                                                    </label>
                                                    <table>
                                                        <tr>
                                                            <th>No.</th>
                                                            <th>Title</th>
                                                            <th>Segment Name</th>
                                                            <th>Type</th>
                                                            <th>Bites</th>
                                                            <th>Required</th>
                                                            <th>Action</th>
                                                        </tr>
                                                        {customizations?.map((customization, index) => {
                                                            const defaultName = customization?.segments?.[0]?.name;

                                                            return (
                                                                <>
                                                                    <tr key={index}>
                                                                        <td>{index + 1}</td>
                                                                        <td>{customization?.name}</td>
                                                                        <td>
                                                                            <select
                                                                                style={{ width: "50px" }}
                                                                                value={customization?.selectedName || defaultName}
                                                                                onChange={(e) => {
                                                                                    const selectedName = e.target.value;
                                                                                    const updatedCustomizations = customizations.map((v, i) => {
                                                                                        if (i === index) {
                                                                                            return {
                                                                                                ...v,
                                                                                                selectedName: selectedName,
                                                                                            };
                                                                                        }
                                                                                        return v;
                                                                                    });
                                                                                    setCustomizations(updatedCustomizations);
                                                                                }}
                                                                            >
                                                                                {customization?.segments?.map((vari, Index) => {
                                                                                    return (
                                                                                        <option key={Index} value={vari?.name}>
                                                                                            {vari?.name}
                                                                                        </option>
                                                                                    );

                                                                                })}
                                                                            </select>
                                                                        </td>
                                                                        <td>{customization?.type}</td>
                                                                        <td>
                                                                            {customization?.segments?.map((vari) => {
                                                                                if (vari?.name === (customization?.selectedName || defaultName)) {
                                                                                    return vari?.bite;
                                                                                }
                                                                                return null;
                                                                            })}
                                                                        </td>
                                                                        <td>{customization?.required === false ? 'No' : 'Yes'}</td>
                                                                        <td>
                                                                            <i class="fa fa-trash"
                                                                                onClick={() => handleDeleteCustomization(index)}
                                                                                aria-hidden="true"
                                                                                style={{ color: "red", cursor: "pointer" }}
                                                                            ></i>
                                                                        </td>
                                                                    </tr>
                                                                </>
                                                            );
                                                        })}
                                                    </table>
                                                </div>
                                            }

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
                <Modal
                    className="main-content dark"
                    isOpen={isModalOpen}
                    onRequestClose={handleCloseModal}
                >
                    <AddCustomization
                        customizations={customizations}
                        setCustomizations={setCustomizations}
                        handleCloseModal={handleCloseModal}
                    />
                </Modal>
            </div>
        </>
    );
};

export default AddRestaurantMeal;