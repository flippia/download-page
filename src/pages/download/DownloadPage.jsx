import styles from "./DownloadPage.module.css";

import { useState, useEffect, useReducer } from "react";

import moment from "moment";

import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import DownloadIcon from "@mui/icons-material/Download";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import ListItemText from "@mui/material/ListItemText";

import { deviceIdList } from "../../data/deviceIDList";
import { cityIdList } from "../../data/cityIDList";

import TimeInput from "../../components/timeInput/TimeInput";
import UploadFile from "../../components/uploadFile/UploadFile";
import VerifyEmail from "../../components/verifyEmail/VerifyEmail";

/** download reducer actions */
const DownloadActions = {
  SETSTART: "setStartTime",
  SETEND: "setEndTime",
  RESETSHHMM: "resetStartHHmm",
  RESETEHHMM: "resetEndHHmm",
  SETDEVICEID: "setDeviceId",
  SETCITYID: "setCityId",
  SETDATAPOINTIDINPUT: "setDatapointIdInput",
  SETDATAPOINTIDLIST: "setDatapointIdList",
  DELETEDATAPOINTCHIP: "deleteDatapointChip",
  SETDATAPOINTIDFILELIST: "setDatapointIdFileList",
  DELETEDATAPOINTIDFILE: "deleteDatapointIdFile",
  SETWITHLABEL: "setWithLabel",
  SETEMAILINPUT: "setEmailInput",
  VERIFYEMAIL: "verifyEmail",
};

/**
 *
 * @param {object} time state
 * @param {object} action action including type and payload
 * @returns state after operation
 */
const downloadReducer = (downloadState, action) => {
  // console.log("action type", action.type, downloadState);
  switch (action.type) {
    // update start time
    case DownloadActions.SETSTART:
      return { ...downloadState, start: action.payload };
    // update end time
    case DownloadActions.SETEND:
      return { ...downloadState, end: action.payload };
    // reset start time to default hour, mimute, second and millisecond
    case DownloadActions.RESETSHHMM:
      return {
        ...downloadState,
        start: new Date(downloadState.start.setHours(0, 0, 0, 0)),
      };
    // reset end time to default hour, mimute, second and millisecond
    case DownloadActions.RESETEHHMM:
      return {
        ...downloadState,
        end: new Date(downloadState.end.setHours(0, 0, 0, 0)),
      };
    // update device id
    case DownloadActions.SETDEVICEID:
      return {
        ...downloadState,
        deviceID:
          typeof action.payload === "string"
            ? action.payload.split(",")
            : action.payload,
      };
    // update city id
    case DownloadActions.SETCITYID:
      return {
        ...downloadState,
        cityID:
          typeof action.payload === "string"
            ? action.payload.split(",")
            : action.payload,
      };
    // update input of data point id
    case DownloadActions.SETDATAPOINTIDINPUT:
      return { ...downloadState, inputDatapointId: action.payload };
    // update list of data point id
    case DownloadActions.SETDATAPOINTIDLIST:
      return {
        ...downloadState,
        datapointIdList: [...downloadState.datapointIdList, action.payload],
      };
    // delete data point chip
    case DownloadActions.DELETEDATAPOINTCHIP:
      return {
        ...downloadState,
        datapointIdList: downloadState.datapointIdList.filter(
          (chip) => chip !== action.payload
        ),
      };
    // update list of data point id files
    case DownloadActions.SETDATAPOINTIDFILELIST:
      return {
        ...downloadState,
        datapointIdFilesList: [
          ...downloadState.datapointIdFilesList,
          action.payload,
        ],
      };
    // delete data point id file
    case DownloadActions.DELETEDATAPOINTIDFILE:
      return {
        ...downloadState,
        datapointIdFilesList: downloadState.datapointIdFilesList.filter(
          (file) => file.fileName !== action.payload.fileName
        ),
      };
    // upadte with label
    case DownloadActions.SETWITHLABEL:
      return { ...downloadState, withLabel: action.payload };
    // update the input email
    case DownloadActions.SETEMAILINPUT:
      return { ...downloadState, inputEmail: action.payload };
    // verify the input email address
    case DownloadActions.VERIFYEMAIL:
      /** regex to match the string ends with "@irisradgroup.com" */
      const pattern = /\S+(?=@irisradgroup.com)/gm;
      if (downloadState.inputEmail.match(pattern) !== null) {
        return { ...downloadState, emailVerified: true, inputEmail: "" };
      } else {
        return { ...downloadState, emailVerified: false };
      }
    // return the current state
    default:
      return downloadState;
  }
};

const DownloadPage = () => {
  /** intial state of download, including start time, end time, device id and city id */
  const initDownloadState = {
    start: new Date(new Date().setHours(0, 0, 0, 0)),
    end: new Date(),
    deviceID: [],
    cityID: [],
    inputDatapointId: "",
    datapointIdList: [],
    datapointIdFilesList: [],
    withLabel: "N/A",
    emailVerified: false,
    inputEmail: "",
  };

  // reducer constructor
  const [downloadState, dispatch] = useReducer(
    downloadReducer,
    initDownloadState
  );

  // console.log(time.start);

  /**
   *
   * @param {object} input time, to update the start time of the reducer state
   */
  const handleStartChange = (input) => {
    dispatch({ type: DownloadActions.SETSTART, payload: input });
  };
  /**
   *
   * @param {object} input time, to update the end time of the reducer state
   */
  const handleEndChange = (input) => {
    dispatch({ type: DownloadActions.SETEND, payload: input });
  };

  /** function to reset start time to default hour, mimute, second and millisecond */
  const resetStartTime = () => {
    dispatch({ type: DownloadActions.RESETSHHMM });
  };
  /** function to reset end time to default hour, mimute, second and millisecond */
  const resetEndTime = () => {
    dispatch({ type: DownloadActions.RESETEHHMM });
  };

  // function to update the state of device id
  const upDateDeviceId = (event) => {
    dispatch({
      type: DownloadActions.SETDEVICEID,
      payload: event.target.value,
    });
  };
  // function to update the state of city id
  const upDateCityId = (event) => {
    dispatch({ type: DownloadActions.SETCITYID, payload: event.target.value });
  };
  // function to update the state of data point id input
  const updateDatapointInput = (event) => {
    dispatch({
      type: DownloadActions.SETDATAPOINTIDINPUT,
      payload: event.target.value,
    });
  };
  // when pressing enter, add the input content to data point id list
  const handleDatapointIdKeyDown = (event) => {
    // when presssing enter
    if (event.keyCode === 13) {
      // when the input field is not empty
      if (downloadState.inputDatapointId.trim() !== "") {
        dispatch({
          type: DownloadActions.SETDATAPOINTIDLIST,
          payload: downloadState.inputDatapointId.trim(),
        });
        dispatch({
          type: DownloadActions.SETDATAPOINTIDINPUT,
          payload: "",
        });
      }
    }
  };
  // function to delete chip of data point id
  const handleDeleteDatapointId = (chip) => {
    dispatch({ type: DownloadActions.DELETEDATAPOINTCHIP, payload: chip });
  };
  // function to delete file from data point id file list
  const handleDeleteDatapointIdFile = (file) => {
    dispatch({ type: DownloadActions.DELETEDATAPOINTIDFILE, payload: file });
  };
  // function to update datapoint id file list
  const updateDatapointIdFileList = (file) => {
    // console.log("use reducer called", file);
    dispatch({
      type: DownloadActions.SETDATAPOINTIDFILELIST,
      payload: file,
    });
  };

  // function to update the state of with label
  const updateWithLabel = (event) => {
    dispatch({
      type: DownloadActions.SETWITHLABEL,
      payload: event.target.value,
    });
  };

  // function to update the state of input email address
  const updateEmailInput = (event) => {
    dispatch({
      type: DownloadActions.SETEMAILINPUT,
      payload: event.target.value,
    });
  };
  // function to verify the input email
  const verifyInputEmail = () => {
    dispatch({ type: DownloadActions.VERIFYEMAIL });
  };

  /** time input fields, including both start and end */
  const timeInputFields = {
    start_from: {
      time: downloadState.start,
      update: handleStartChange,
      resetTime: resetStartTime,
      dateLabel: "start date",
      timeLabel: "start time",
      tipsInfo: "The start time selected is",
    },
    end_before: {
      time: downloadState.end,
      update: handleEndChange,
      resetTime: resetEndTime,
      dateLabel: "end date",
      timeLabel: "end time",
      tipsInfo: "The end time selected is",
    },
  };

  /** input fields accepting multiple select input */
  const multipleSelectInputFields = {
    "device id": {
      label: "Devices",
      value: downloadState.deviceID,
      update: upDateDeviceId,
      options: deviceIdList,
    },
    "city id": {
      label: "Cities",
      value: downloadState.cityID,
      update: upDateCityId,
      options: cityIdList,
    },
  };

  /** input fields accepting multiple manual input */
  const multiInputWithChipsFields = {
    "datapoint id": {
      label: "Datapoint ID",
      helperText: "Press enter when finishing input one ID",
      inputValue: downloadState.inputDatapointId,
      chipsArray: downloadState.datapointIdList,
      updateInput: updateDatapointInput,
      handleKeyDown: handleDatapointIdKeyDown,
      handleDeleteChip: handleDeleteDatapointId,
    },
  };

  /** upload field, including upload button and upload files chips */
  const uploadFileFields = {
    "datapoint id": {
      buttonContent: "upload datapoint id file",
      FilesList: downloadState.datapointIdFilesList,
      updateFileList: updateDatapointIdFileList,
      deleteFile: handleDeleteDatapointIdFile,
    },
  };

  /** input fields accepting single input */
  const singleSelectInputFields = {
    "with label": {
      label: "With Label",
      value: downloadState.withLabel,
      update: updateWithLabel,
      selection: {
        Yes: true,
        No: false,
        "N/A": "N/A",
      },
    },
  };

  // the download data info
  const handleDownload = () => {
    const downloadContent = {
      start_time: moment.utc(downloadState.start).format("YYYY-MM-DDTHH:mm"),
      end_time: moment
        .utc(downloadState.end)
        .subtract(1, "milliseconds") // subtract 1 milli second
        .format("YYYY-MM-DDTHH:mm"),
      device_id: downloadState.deviceID,
      city_id: downloadState.cityID,
      datapoint_id: downloadState.datapointIdList,
      with_label: downloadState.withLabel,
      datapointIdFilesList: downloadState.datapointIdFilesList,
    };

    console.log("download query", downloadContent);
  };

  return (
    <div className={styles["download-page"]}>
      {Object.values(timeInputFields).map((field, index) => (
        <TimeInput
          key={index}
          time={field["time"]}
          handleChange={field["update"]}
          resetTime={field["resetTime"]}
          dateLabel={field["dateLabel"]}
          timeLabel={field["timeLabel"]}
          tipsInfo={field["tipsInfo"]}
        />
      ))}
      <div className={styles["optional-input"]}>
        {Object.values(multipleSelectInputFields).map((field) => (
          <div className={styles["multi-select"]} key={field["label"]}>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel id={field["label"]}>{field["label"]}</InputLabel>
              <Select
                labelId={field["label"]}
                id={field["label"]}
                multiple
                value={field["value"]}
                onChange={field["update"]}
                input={<OutlinedInput label={field["label"]} />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: "14rem",
                      // width: 250,
                    },
                  },
                }}
              >
                {field.options.map((option) => (
                  <MenuItem key={option["title"]} value={option["title"]}>
                    <Checkbox
                      checked={field.value.indexOf(option["title"]) > -1}
                    />
                    <ListItemText primary={option["title"]} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        ))}

        {Object.values(multiInputWithChipsFields).map((field) => (
          <div className={styles["multi-input"]} key={field["label"]}>
            <div className={styles["multi-input-textfield"]}>
              <TextField
                id={field["label"]}
                label={field["label"]}
                variant="outlined"
                helperText={field["helperText"]}
                onChange={field["updateInput"]}
                onKeyDown={field["handleKeyDown"]}
                value={field["inputValue"]}
              />
            </div>
            <div className={styles["multi-input-chips"]}>
              {field["chipsArray"].map((chip, index) => (
                <div className={styles["multi-input-one-chip"]} key={index}>
                  <Chip
                    label={chip}
                    onDelete={() => field["handleDeleteChip"](chip)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {Object.values(uploadFileFields).map((field, index) => (
          <UploadFile
            key={index}
            buttonContent={field["buttonContent"]}
            FilesList={field["FilesList"]}
            updateFileList={field["updateFileList"]}
            deleteFile={field["deleteFile"]}
          />
        ))}

        <div className={styles["single-select"]}>
          {Object.values(singleSelectInputFields).map((field) => (
            <div className={styles["with-label"]} key={field["label"]}>
              <FormControl fullWidth>
                <InputLabel id={field["label"]}>With Label</InputLabel>
                <Select
                  labelId={field["label"]}
                  id={field["label"]}
                  value={field["value"]}
                  label={field["label"]}
                  onChange={field["update"]}
                >
                  {Object.keys(field["selection"]).map((option) => (
                    <MenuItem key={option} value={field["selection"][option]}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          ))}
        </div>
      </div>
      <div className={styles["button-area"]}>
        <div>
          <VerifyEmail
            verified={downloadState.emailVerified}
            input={downloadState.inputEmail}
            updateEmail={updateEmailInput}
            verifyEmail={verifyInputEmail}
          />
        </div>
        <div>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            disabled={!downloadState.emailVerified}
          >
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;
