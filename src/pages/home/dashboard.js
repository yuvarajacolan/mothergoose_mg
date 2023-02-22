import React, { lazy, Suspense, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Head from "next/head";
import Stack from "@mui/material/Stack";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BadgeIcon from "@mui/icons-material/Badge";
import Navbar from "@/components/Navbar";
import dynamic from "next/dynamic";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import DownloadIcon from "@mui/icons-material/Download";
import { patientBarAction } from "redux/slice/userSlice";
import { errorToast, successToast, warnToast } from "@/Components/helper";
import {
    postPatientBarChatApi,
    postPatientEnrolledBarChatApi,
    postPatientAlcoholUsedPieChartApi,
    postPatientPieChartApi,
    postPatientSmokeUsedPieChartApi,
    postPatientAgeDeliveryBarChartApi,
    postPatientAgeGroupDeliveryPieChartApi,
    postPatientHealthInsurancePieChartApi,
    postPatientStressedPieChartApi,
    postPatientLackOfTransportationsPieChartApi,
    postexportUserDetailsApi,
    postExportTimeSpentOnArticleActionApi,
    getStateAction,
    postZipCodeListApi,
    getrisksurveyAction,
} from "redux/action/userAction";
import LoaderState from "@/Components/Loader";
import LogoutHandlerModal from "@/Components/logOutModal";
import { router } from "next/router";
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
// import Nodata from "../../assets/images/nodata.png"

const Bargraph = dynamic(() => import("../../components/Bargraph"), {
    ssr: false,
});
const PieChart = dynamic(() => import("../../components/PieChart"), {
    ssr: false,
});

const Dashboard = (props) => {
    const dispatch = useDispatch();
    const patientBarResponse = useSelector(
        (state) => state.user.patientBarChartinfo
    );
    const patientEnrolledBarResponse = useSelector(
        (state) => state.user.patientEnrolledBarChartinfo
    );
    const patientAgeDeliveryResponse = useSelector(
        (state) => state.user.patientAgeDeliveryBarChartinfo
    );
    const patientLackOfTransportationsPieResponse = useSelector(
        (state) => state.user.patientLackOfTransportationsPieChartinfo
    );
    const patientLackOfTransportationsPieChartisLoading = useSelector(
        (state) => state.user.patientLackOfTransportationsPieChartisLoading
    );
    const patientAlcoholUsedPieResponse = useSelector(
        (state) => state.user.patientAlcoholUsedPieChartinfo
    );
    const PatientPieResponse = useSelector(
        (state) => state.user.patientEnrolledPieChartinfo
    );
    const PatientSmokeUsedPieResponse = useSelector(
        (state) => state.user.patientSmokeUsedPieChartinfo
    );
    const PatientAgeGroupDeliveryPieResponse = useSelector(
        (state) => state.user.patientAgeGroupDeliveryPieChartinfo
    );
    const PatientHealthInsurancePieResponse = useSelector(
        (state) => state.user.patientHealthInsurancePieChartinfo
    );
    const PatientStressedPieResponse = useSelector(
        (state) => state.user.patientStressedPieChartinfo
    );
    const PatientexportUserDetailsResponse = useSelector(
        (state) => state.user.patientExportUserDetailsinfo
    );
    const PatientexportTimeSpentOnArticleResponse = useSelector(
        (state) => state.user.patientExportTimeSpentOnArticleinfo
    );
    const stateinfoResponse = useSelector(
        (state) => state.user.stateinfo
    );
    const stateisLoadingResponse = useSelector(
        (state) => state.user.stateisLoading
    );
    const patientZipCodeResponse = useSelector(
        (state) => state.user.patientZipCodeListinfo
    );
    const patientZipCodeListisLoading = useSelector(
        (state) => state.user.patientZipCodeListisLoading
    );
    const riskSurveyResponse = useSelector(
        (state) => state.user.riskSurveyinfo
    );

    const [startdate, setStartDate] = React.useState("");
    const [enddate, setEndDate] = React.useState("");
    const [PatientBarChat, setPatientBarChat] = useState([]);
    const [patientEnrolledBarChat, setpatientEnrolledBarChat] = useState([]);
    const [PatientAgeDelivertBarChat, setPatientAgeDelivertBarChat] = useState([]);
    const [isSearchClick, setisSearchClick] = useState(false);
    const [patientLackOfTransportationsPieChart, setpatientLackOfTransportationsPieChart] = useState([]);
    const [patientAlcoholUsedPieChart, setpatientAlcoholUsedPieChart] = useState([]);
    const [patientPieChart, setpatientPieChart] = useState([]);
    const [patientSmokePieChart, setPatientSmokePieChart] = useState([]);
    const [patientAgeGroupDeliveryPieChart, setPatientAgeGroupDeliveryPieChart] = useState([]);
    const [patientHealthInsurancePieChart, setpatientHealthInsurancePieChart] = useState([]);
    const [patientStressedPieChart, setPatientStressedPieResponse] = useState([]);
    const [ExportUserDetail, setExportUserDetail] = useState([]);
    const [ExportTimeSpentArticle, setExportTimeSpentArticle] = useState([]);
    const [filter, setFilter] = React.useState(1);
    const [RiskSurveyURL, setRiskSurveyURL] = useState('')
    // const [patientEnrolledUrl, setRiskSurveyURL] = useState('')

    const [DownloadUrl, setDowlaodUrl] = useState('')
    const [isLoading, setisLoading] = useState(false)

    let group = [
        {
            "id": 0,
            "key": "Select",
            "value": "Select"
        },
        {
            "id": 1,
            "key": "patient",
            "value": "Patient"
        },
        {
            "id": 2,
            "key": "age",
            "value": "Age"
        },
        {
            "id": 3,
            "key": "icd",
            "value": "ICD Code"
        },
    ]

    const handleChange = (event) => {
        setisLoading(true)
        setFilter(event.target.value);
        setTimeout(() => {
            setisLoading(false)
        }, 1000);
        if (event.target.value == 1) {
            setDowlaodUrl(ExportUserDetail)
        } else if (event.target.value == 11) {
            setDowlaodUrl(ExportTimeSpentArticle)
        } else if (event.target.value == 12) {
            setDowlaodUrl(RiskSurveyURL)
        }
        else if (event.target.value == 2) {
            setDowlaodUrl(ExportUserDetail)
        }
        else if (event.target.value == 3) {
            setDowlaodUrl(ExportUserDetail)
        }
         else {
            setDowlaodUrl('')
        }
    };

    useEffect(() => {
        checkingForLogin();
        const date = new Date();
        let day = String(date.getDate()).padStart(2, "0");
        let month = String(date.getMonth() + 1).padStart(2, "0");
        let year = date.getFullYear();
        var priorDate = new Date(new Date().setDate(date.getDate() - 30));
        let Pday = String(priorDate.getDate()).padStart(2, "0");
        let Pmonth = String(priorDate.getMonth() + 1).padStart(2, "0");
        let Pyear = priorDate.getFullYear();
        let currentDate = `${year}-${month}-${day}`;
        let PriorDatevalue = `${Pyear}-${Pmonth}-${Pday}`;
        // setStartDate(PriorDatevalue);
        setEndDate(currentDate);
        setStartDate("2021-01-01");
        dispatch(getStateAction());
        getZipcode(37)
    }, []);

    const getZipcode = (value) => {
        console.log('value', value)
        let params = {
            "stateId": value
        }
        dispatch(postZipCodeListApi(params));
    }

    const checkingForLogin = () => {
        const accessToken =
            typeof window !== "undefined"
                ? sessionStorage.getItem("accessToken")
                : "";
        console.log("checkingForLogin", accessToken);
        if (accessToken === null) {
            router.push("/auth/Login");
        }
    };

    const _onFindPress = (stateId, zipCode, groupby) => {
        const reqBody = {
            fromDate: startdate,
            toDate: enddate,
            stateId: "",
            zipCode: "",
        };
        setisSearchClick(true);
        const reqBodywithfalsestate = {
            fromDate: startdate,
            toDate: enddate,
            stateId: stateId,
            zipCode: zipCode === 0 ? '' : zipCode,
            groupBy: groupby === "Select" ? "" : groupby,
            isRegistered: "false"
        };
        dispatch(postPatientBarChatApi(reqBodywithfalsestate));
        const reqBodywithTruestate = {
            fromDate: startdate,
            toDate: enddate,
            stateId: stateId,
            zipCode: zipCode === 0 ? '' : zipCode,
            groupBy: groupby === "Select" ? "" : groupby,
            isRegistered: "true"
        };
        
        dispatch(postPatientEnrolledBarChatApi(reqBodywithTruestate));
        dispatch(postPatientAlcoholUsedPieChartApi(reqBody));
        dispatch(postPatientPieChartApi(reqBodywithfalsestate));
        dispatch(postPatientSmokeUsedPieChartApi(reqBody));
        dispatch(postPatientAgeDeliveryBarChartApi(reqBody));
        dispatch(postPatientAgeGroupDeliveryPieChartApi(reqBody));
        dispatch(postPatientHealthInsurancePieChartApi(reqBody));
        dispatch(postPatientStressedPieChartApi(reqBody));
        dispatch(postPatientLackOfTransportationsPieChartApi(reqBody));
        const reqBodywithstate = {
            fromDate: startdate,
            toDate: enddate,
            stateId: stateId,
            zipCode: zipCode === 0 ? '' : zipCode,
            groupBy: groupby === "Select" ? "" : groupby,
            isRegistered:"false",
        };
        const reqBodywithnewstate = {
            fromDate: startdate,
            toDate: enddate,
            stateId: stateId,
            zipCode: zipCode === 0 ? '' : zipCode,
            groupBy: groupby === "Select" ? "" : groupby,
            resType:"file"
        }
        const reqBodywitholdstate = {
            fromDate: startdate,
            toDate: enddate,
            stateId: stateId,
            zipCode: zipCode === 0 ? '' : zipCode,
            groupBy: groupby === "Select" ? "" : groupby,
            resType:"data"
        }
        
        dispatch(postexportUserDetailsApi(reqBodywithstate));
        dispatch(postExportTimeSpentOnArticleActionApi(reqBodywithnewstate));
        dispatch(getrisksurveyAction(reqBodywithnewstate));
    };

    useEffect(() => {
        let dataPoints = [];
        if (patientBarResponse?.data) {
            patientBarResponse?.data.labels?.map((item, i) => {
                dataPoints.push({
                    label: item,
                    y: patientBarResponse?.data?.datasets[0]?.data[i],
                });
            });
            setPatientBarChat(dataPoints);
        }
    }, [patientBarResponse]);

    useEffect(() => {
        let dataPoints = [];
        if (patientEnrolledBarResponse?.data) {
            patientEnrolledBarResponse?.data.labels?.map((item, i) => {
                dataPoints.push({
                    label: item,
                    y: patientEnrolledBarResponse?.data?.datasets[0]?.data[i],
                });
            });
            setpatientEnrolledBarChat(dataPoints);
        }
    }, [patientEnrolledBarResponse]);

    useEffect(() => {
        let dataPoints = [];
        if (patientAgeDeliveryResponse?.data) {
            patientAgeDeliveryResponse?.data.labels?.map((item, i) => {
                dataPoints.push({
                    label: item,
                    y: patientAgeDeliveryResponse?.data?.datasets[0]?.data[i],
                });
            });
            setPatientAgeDelivertBarChat(dataPoints);
        }
    }, [patientAgeDeliveryResponse]);

    useEffect(() => {
        let dataPoints = [];
        if (patientLackOfTransportationsPieResponse?.data) {
            patientLackOfTransportationsPieResponse?.data.labels?.map((item, i) => {
                dataPoints.push({
                    name: item,
                    y: patientLackOfTransportationsPieResponse?.data?.datasets[0]?.data[
                        i
                    ],
                });
            });

            setpatientLackOfTransportationsPieChart(dataPoints);
        }
    }, [patientLackOfTransportationsPieResponse]);

    useEffect(() => {
        let dataPoints = [];
        if (patientAlcoholUsedPieResponse?.data) {
            patientAlcoholUsedPieResponse?.data.labels?.map((item, i) => {
                dataPoints.push({
                    name: item,
                    y: patientAlcoholUsedPieResponse?.data?.datasets[0]?.data[i],
                });
            });

            setpatientAlcoholUsedPieChart(dataPoints);
        }
    }, [patientAlcoholUsedPieResponse]);

    useEffect(() => {
        let dataPoints = [];
        if (PatientPieResponse?.data) {
            PatientPieResponse?.data.labels?.map((item, i) => {
                dataPoints.push({
                    name: item,
                    y: PatientPieResponse?.data?.datasets[0]?.data[i],
                });
            });

            setpatientPieChart(dataPoints);
        }
    }, [PatientPieResponse]);

    useEffect(() => {
        let dataPoints = [];
        if (PatientSmokeUsedPieResponse?.data) {
            PatientSmokeUsedPieResponse?.data.labels?.map((item, i) => {
                dataPoints.push({
                    name: item,
                    y: PatientSmokeUsedPieResponse?.data?.datasets[0]?.data[i],
                });
            });

            setPatientSmokePieChart(dataPoints);
        }
    }, [PatientSmokeUsedPieResponse]);

    useEffect(() => {
        let dataPoints = [];
        if (PatientAgeGroupDeliveryPieResponse?.data) {
            PatientAgeGroupDeliveryPieResponse?.data.labels?.map((item, i) => {
                dataPoints.push({
                    name: item,
                    y: PatientAgeGroupDeliveryPieResponse?.data?.datasets[0]?.data[i],
                });
            });
            setPatientAgeGroupDeliveryPieChart(dataPoints);
        }
    }, [PatientAgeGroupDeliveryPieResponse]);

    useEffect(() => {
        let dataPoints = [];
        if (PatientHealthInsurancePieResponse?.data) {
            PatientHealthInsurancePieResponse?.data.labels?.map((item, i) => {
                dataPoints.push({
                    name: item,
                    y: PatientHealthInsurancePieResponse?.data?.datasets[0]?.data[i],
                });
            });

            setpatientHealthInsurancePieChart(dataPoints);
        }
    }, [PatientHealthInsurancePieResponse]);

    useEffect(() => {
        let dataPoints = [];
        if (PatientStressedPieResponse?.data) {
            PatientStressedPieResponse?.data.labels?.map((item, i) => {
                dataPoints.push({
                    name: item,
                    y: PatientStressedPieResponse?.data?.datasets[0]?.data[i],
                });
            });
            setPatientStressedPieResponse(dataPoints);
        }
    }, [PatientStressedPieResponse]);

    useEffect(() => {
        if (PatientexportUserDetailsResponse?.msg == "success") {
            console.log(
                "PatientexportUserDetailsResponse",
                PatientexportUserDetailsResponse.url
            );
            setDowlaodUrl(PatientexportUserDetailsResponse.url)
            setExportUserDetail(PatientexportUserDetailsResponse.url);
        } else {
            setExportUserDetail('');

        }
    }, [PatientexportUserDetailsResponse]);

    useEffect(() => {
        if (PatientexportTimeSpentOnArticleResponse?.msg == "success") {
            console.log(
                "PatientexportTimeSpentOnArticleResponse",
                PatientexportTimeSpentOnArticleResponse.url
            );
            setExportTimeSpentArticle(PatientexportTimeSpentOnArticleResponse.url);
        } else {
            setExportTimeSpentArticle('');
        }
    }, [PatientexportTimeSpentOnArticleResponse]);

    useEffect(() => {
        if (riskSurveyResponse?.msg == "success") {
            console.log(
                "riskSurveyResponse",
                riskSurveyResponse.url
            );
            setRiskSurveyURL(riskSurveyResponse.url);
        } else {
            setRiskSurveyURL('');
        }
    }, [riskSurveyResponse]);

    const formik = useFormik({
        // enableReinitialize: true,

        initialValues: {
            startdate: "",
            enddate: "",
            patientID: "",
            provider: "",
            zipcode: 0,
            insurancepayer: "",
            state: 0,
            groupby: 'Select',
        },

        validateOnChange: (values) => {
            console.log('value', values)
            getZipcode(values.target.value === 0 ? 1 : values.target.value)
            formik.handleChange(values)
        },

        onSubmit: (values) => {
            console.log('value', values)
            _onFindPress(values.state, values.zipcode, values.groupby);
        },
    });

    return (
        <>
            <Head>
                <title>Mother Goose</title>
            </Head>
            <Navbar />
            <div>
                <div className="bg-img">
                    <div className="col-lg-5 col-md-8 col-xs-12 divcenter ">
                        <Card
                            sx={{
                                minWidth: 275,
                                borderRadius: "10px",
                                boxShadow: "rgb(0 0 0 / 24%) 0px 3px 8px",
                                alignSelf: "left",
                                backgroundColor: "#fffdff",
                            }}
                        >
                            <h2
                                style={{
                                    fontWeight: "600",
                                    fontSize: "2rem",
                                    textAlign: "center",
                                    margin: "0.5rem 1rem",
                                    color: "#46adef",
                                }}
                            >
                                Mother Goose{" "}
                            </h2>
                            <h4
                                style={{
                                    textAlign: "center",
                                    color: "grey",
                                    fontSize: "16px",
                                    margin: "0.5rem 1rem",
                                }}
                            >
                                Please fill the details to find your report{" "}
                            </h4>
                            <CardContent>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Stack direction="row" spacing={4}>
                                        <TextField
                                            id="date"
                                            label="From Date"
                                            type="date"
                                            value={startdate}
                                            fullWidth
                                            defaultValue={startdate}
                                            onChange={(newValue) => {
                                                console.log("sss", newValue.target.value);
                                                setStartDate(newValue.target.value);
                                            }}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                        <TextField
                                            id="date"
                                            label="To Date"
                                            type="date"
                                            value={enddate}
                                            defaultValue={enddate}
                                            fullWidth
                                            onChange={(newValue) => {
                                                console.log("sss", newValue.target.value);
                                                setEndDate(newValue.target.value);
                                            }}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </Stack>
                                    <Stack
                                        direction={{ xs: "column", sm: "row" }}
                                        spacing={{ xs: 1, sm: 2, md: 6 }}
                                        sx={{ marginTop: "20px", width: "100%" }}
                                    >
                                        <TextField
                                            fullWidth
                                            name="state"
                                            onBlur={formik.handleBlur}
                                            onChange={(e) => formik.validateOnChange(e)}
                                            //   onChange={(e)=>{
                                            //   formik.handleChange
                                            //   getZipcode(e.target.value)
                                            //   }}
                                            //   type="select"
                                            value={formik.values.state + ''}
                                            id="outlined-basic"
                                            label="State"
                                            variant="outlined"
                                            // InputProps={{
                                            //     endAdornment: <LocationOnIcon />,
                                            // }}
                                            sx={{ width: "100%" }}
                                            select
                                        >
                                            <MenuItem key={0} value={0}>
                                                {'Select'}
                                            </MenuItem>
                                            {stateinfoResponse?.data?.map((option) => (
                                                <MenuItem key={option.id} value={option.id}>
                                                    {option.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>

                                        <TextField
                                            fullWidth
                                            name="zipcode"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.zipcode}
                                            id="outlined-basic"
                                            label="ZIP code"
                                            variant="outlined"
                                            //   InputProps={{
                                            //     endAdornment: <LocationOnIcon />,
                                            //   }}
                                            sx={{ width: "100%" }}
                                            select
                                        >
                                            <MenuItem key={0} value={0}>
                                                {'Select'}
                                            </MenuItem>
                                            {patientZipCodeResponse?.zip_codes?.map((option) => (
                                                <MenuItem key={option} value={option}>
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Stack>
                                    <Stack
                                        direction={{ xs: "column", sm: "row" }}
                                        spacing={{ xs: 1, sm: 2, md: 6 }}
                                        sx={{ marginTop: "20px", width: "100%", justifyContent: "center", display: "flex" }}
                                    >
                                        {/* <TextField
                                            fullWidth
                                            id="outlined-basic"
                                            label="Patient Id"
                                            variant="outlined"
                                            InputProps={{
                                                endAdornment: <BadgeIcon />,
                                            }}
                                            sx={{ width: "100%" }}
                                            name="patientID"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            type="text"
                                            value={formik.values.patientID}
                                        />
                                        <TextField
                                            fullWidth
                                            name="insurancepayer"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            type="text"
                                            value={formik.values.insurancepayer}
                                            id="outlined-basic"
                                            label="Insurance Payer"
                                            variant="outlined"
                                            InputProps={{
                                                endAdornment: <PersonIcon />,
                                            }}
                                            sx={{ width: "100%" }}
                                        />
                                        <TextField
                                            fullWidth
                                            name="provider"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            type="text"
                                            value={formik.values.provider}
                                            id="outlined-basic"
                                            label="Provider"
                                            variant="outlined"
                                            InputProps={{
                                                endAdornment: <PersonIcon />,
                                            }}
                                            sx={{ width: "100%" }}
                                        /> */}

                                        <TextField
                                            fullWidth
                                            name="groupby"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.groupby}
                                            id="outlined-basic"
                                            label="Group by"
                                            variant="outlined"
                                            //   InputProps={{
                                            //     endAdornment: <LocationOnIcon />,
                                            //   }}
                                            sx={{ width: "50%" }}
                                            select
                                        >
                                            {/* <MenuItem key={0} value={0}>
                                                {''}
                                            </MenuItem> */}
                                            {group?.map((option) => (
                                                <MenuItem key={option.id} value={option.key}>
                                                    {option.value}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Stack>
                                    <div className="col-sm-4 col-md-4" style={{ margin: "auto" }}>
                                        <a
                                            className="dedcription-btn"
                                            href="#"
                                            onClick={formik.handleSubmit}
                                        >
                                            <span className="name-descripeion">Find</span>
                                            <div className="btn-icon">
                                                <i className="fa-solid fa-magnifying-glass-arrow-right"></i>{" "}
                                            </div>
                                        </a>
                                    </div>
                                </LocalizationProvider>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            {PatientAgeDelivertBarChat.length === 0 ? (
                <div style={{ textAlign: "center" }}>
                    {isSearchClick && !patientLackOfTransportationsPieChartisLoading ? (
                        <>
                            <img
                                src="/assets/images/nodata.png"
                                alt="No data found"
                                style={{ width: "30%" }}
                            />
                            <h2>No data found</h2>
                        </>
                    ) : (
                        <div></div>
                    )}
                </div>
            ) : (
                <div className="bar">
                    <br />

                    {/* <div className="row" style={{ width: "100%" }}>
                        <div className="col-sm-4 col-md-4" style={{ margin: "auto" }}>
                            <a className="dedcription-btn" onClick={() => { ExportUserDetail === '' ? warnToast('Report not available') : '' }} href={ExportUserDetail} download={ExportUserDetail === '' ? false : true}>
                                <span className="name-descripeion">
                                    {" "}
                                    <DownloadIcon /> User report
                                </span>
                                <div className="btn-icon">
                                    <i className="fa-solid fa-magnifying-glass-arrow-right"></i>{" "}
                                </div>
                            </a>
                        </div>
                        <div className="col-sm-4 col-md-4" style={{ margin: "auto" }}>
                            <a
                                className="dedcription-btn"
                                onClick={() => ExportTimeSpentArticle === '' ? warnToast('Report not available') : ''}
                                href={ExportTimeSpentArticle}
                                download={ExportTimeSpentArticle === '' ? false : true}
                            >
                                <span className="name-descripeion">
                                    <DownloadIcon /> Time spent on articles report
                                </span>
                                <div className="btn-icon">
                                    <i className="fa-solid fa-magnifying-glass-arrow-right"></i>{" "}
                                </div>
                            </a>
                        </div>
                        <div className="col-sm-4 col-md-4" style={{ margin: "auto" }}>
                            <a className="dedcription-btn" onClick={() => { RiskSurveyURL === '' ? warnToast('Report not available') : '' }} href={RiskSurveyURL} download={RiskSurveyURL === '' ? false : true}>
                                <span className="name-descripeion">
                                    {" "}
                                    <DownloadIcon /> Risk Survey Report
                                </span>
                                <div className="btn-icon">
                                    <i className="fa-solid fa-magnifying-glass-arrow-right"></i>{" "}
                                </div>
                            </a>
                        </div>
                    </div> */}

                    <div className="gridcenter" style={{ marginBottom: "1rem", display: "flex", justifyContent: "center", width: "100%", alignItems: 'center' }}>
                        <Box sx={{ minWidth: 120, display: 'flex', justifyContent: "center" }}>
                            <FormControl sx={{ m: 1, minWidth: 250 }}>
                                <InputLabel id="demo-simple-select-helper-label">Filter</InputLabel>
                                <Select
                                    labelId="demo-simple-select-helper-label"
                                    id="demo-simple-select-helper"
                                    value={filter}
                                    label="Age"
                                    onChange={(e) => { handleChange(e) }}
                                >
                                    {/* <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem> */}
                                    <MenuItem value={1}>Patient Invited</MenuItem>
                                    <MenuItem value={2}>Patient Enrolled</MenuItem>
                                    <MenuItem value={3}>Patient Enrolled vs Invited</MenuItem>
                                    <MenuItem value={4}>Patient Alcohol Use</MenuItem>
                                    <MenuItem value={5}>Patient Smoke Use</MenuItem>
                                    <MenuItem value={6}>Patient age at delivery</MenuItem>
                                    <MenuItem value={7}>Patient age group at delivery</MenuItem>
                                    <MenuItem value={8}>Patient Health Insurance</MenuItem>
                                    <MenuItem value={9}>How Patient Stressed</MenuItem>
                                    <MenuItem value={10}>Patient Lack of transportations</MenuItem>
                                    <MenuItem value={11}>Time spent on articles report</MenuItem>
                                    <MenuItem value={12}>Risk Survey Report</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        {filter == 1 || filter == 11 || filter == 12 || filter == 2|| filter == 3 ?
                            <div className="last">
                                <a className="dedcription-btn exp-btn" onClick={() => { DownloadUrl === '' ? warnToast('Report not available') : '' }} href={DownloadUrl} download={DownloadUrl === '' ? false : true}>
                                    <span className="name-descripeion">
                                        {" "}
                                        <DownloadIcon /> Export
                                    </span>
                                    <div className="btn-icon">
                                        <i className="fa-solid fa-magnifying-glass-arrow-right"></i>{" "}
                                    </div>
                                </a>
                            </div>
                            : <div className="last"></div>}
                    </div>

                    <div style={{ marginBottom: "3rem" }}>

                        <div className="row" style={{ width: "100%", }}>

                            {filter === 1 && <div className="col-lg-12">
                                <div className="card" style={{ width: "80%", margin: "auto" }}>
                                    <Bargraph
                                        {...props}
                                        title={patientBarResponse?.title}
                                        datasets={PatientBarChat}
                                    />
                                </div>
                            </div>}

                            {filter === 2 && <div className="col-lg-12">
                                <div className="card" style={{ width: "80%", margin: "auto" }}>
                                    <Bargraph
                                        {...props}
                                        title={patientEnrolledBarResponse?.title}
                                        datasets={patientEnrolledBarChat}
                                    />
                                </div>
                            </div>}
                        </div>

                        <div className="row" style={{ width: "100%", }}>
                            {filter === 3 && <div className="col-lg-12">
                                <div className="card" style={{ width: "80%", margin: "auto" }}>
                                    <PieChart
                                        {...props}
                                        title={PatientPieResponse?.title}
                                        datasets={patientPieChart}
                                    />
                                </div>
                            </div>}
                            {filter === 4 && <div className="col-lg-12">
                                <div className="card" style={{ width: "80%", margin: "auto" }}>
                                    <PieChart
                                        {...props}
                                        title={patientAlcoholUsedPieResponse?.title}
                                        datasets={patientAlcoholUsedPieChart}
                                    />
                                </div>
                            </div>}
                        </div>

                        <div className="row" style={{ width: "100%", }}>
                            {filter === 5 && <div className="col-lg-12">
                                <div className="card" style={{ width: "80%", margin: "auto" }}>
                                    <PieChart
                                        {...props}
                                        title={PatientSmokeUsedPieResponse?.title}
                                        datasets={patientSmokePieChart}
                                    />
                                </div>
                            </div>}
                            {filter === 6 && <div className="col-lg-12">
                                <div className="card" style={{ width: "80%", margin: "auto" }}>
                                    <Bargraph
                                        {...props}
                                        title={patientAgeDeliveryResponse?.title}
                                        datasets={PatientAgeDelivertBarChat}
                                    />
                                </div>
                            </div>}
                        </div>

                        <div className="row" style={{ width: "100%", }}>
                            {filter === 7 && <div className="col-lg-12">
                                <div className="card" style={{ width: "80%", margin: "auto" }}>
                                    <PieChart
                                        {...props}
                                        title={PatientAgeGroupDeliveryPieResponse?.title}
                                        datasets={patientAgeGroupDeliveryPieChart}
                                    />
                                </div>
                            </div>}
                            {filter === 8 && <div className="col-lg-12">
                                <div className="card" style={{ width: "80%", margin: "auto" }}>
                                    <PieChart
                                        {...props}
                                        title={PatientHealthInsurancePieResponse?.title}
                                        datasets={patientHealthInsurancePieChart}
                                    />
                                </div>
                            </div>}
                        </div>

                        <div className="row" style={{ width: "100%", }}>
                            {filter === 9 && <div className="col-lg-12">
                                <div className="card" style={{ width: "80%", margin: "auto" }}>
                                    <PieChart
                                        {...props}
                                        title={PatientStressedPieResponse?.title}
                                        datasets={patientStressedPieChart}
                                    />
                                </div>
                            </div>}
                            {filter === 10 && <div className="col-lg-12">
                                <div className="card" style={{ width: "80%", margin: "auto" }}>
                                    <PieChart
                                        {...props}
                                        title={patientLackOfTransportationsPieResponse?.title}
                                        datasets={patientLackOfTransportationsPieChart}
                                    />
                                </div>
                            </div>}
                            {patientLackOfTransportationsPieChartisLoading ||
                                stateisLoadingResponse || patientZipCodeListisLoading || isLoading ? (
                                <LoaderState />
                            ) : (
                                ""
                            )}
                        </div>

                    </div>

                </div>
            )}
        </>
    );
};

export default Dashboard;
