import styles from "./DownloadPage.module.css";

import React, { useState, useEffect, useReducer } from "react";

import moment from "moment";

import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import SendIcon from "@mui/icons-material/Send";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
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

/** download reducer actions */
const DownloadActions = {
  SETSTART: "setStartTime",
  SETEND: "setEndTime",
  RESETSHHMM: "resetStartHHmm",
  RESETEHHMM: "resetEndHHmm",
  SETSELECTFIELD: "setSelectField",
  SETCITYID: "setCityId",
  SETDEVICEID: "setDeviceId",
  SETDATAPOINTIDINPUT: "setDatapointIdInput",
  SETDATAPOINTIDLIST: "setDatapointIdList",
  DELETEDATAPOINTCHIP: "deleteDatapointChip",
  SETDATAPOINTIDFILELIST: "setDatapointIdFileList",
  DELETEDATAPOINTIDFILE: "deleteDatapointIdFile",
  SETWITHLABEL: "setWithLabel",
  SETEMAILANDVERIFY: "setEmailAndVerify",
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
        end: new Date(new Date().setHours(23, 59, 59, 0)),
      };

    // update the select field with radio select
    case DownloadActions.SETSELECTFIELD:
      switch (action.payload) {
        case "Cities":
          return {
            ...downloadState,
            selectField: action.payload,
            deviceID: [],
            datapointIdList: [],
            datapointIdFilesList: [],
          };
        case "Devices":
          return {
            ...downloadState,
            selectField: action.payload,
            cityID: [],
            datapointIdList: [],
            datapointIdFilesList: [],
          };
        case "Datapoint ID":
          return {
            ...downloadState,
            selectField: action.payload,
            cityID: [],
            deviceID: [],
          };
        default:
          return { ...downloadState, selectField: action.payload };
      }
    // update city id
    case DownloadActions.SETCITYID:
      return {
        ...downloadState,
        cityID:
          typeof action.payload === "string"
            ? action.payload.split(",")
            : action.payload,
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
    // update the input email and verify
    case DownloadActions.SETEMAILANDVERIFY:
      /** regex to match the string ends with "@irisradgroup.com" */
      const emailPattern = /\S+(?=@irisradgroup.com)/g;
      if (action.payload.match(emailPattern) !== null) {
        return {
          ...downloadState,
          inputEmail: action.payload,
          emailVerified: true,
        };
      } else {
        return {
          ...downloadState,
          inputEmail: action.payload,
          emailVerified: false,
        };
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
    selectField: "Cities",
    cityID: [],
    deviceID: [],
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

  /** time input fields, including both start and end */
  const timeInputFields = {
    start_from: {
      time: downloadState.start,
      update: (input) =>
        dispatch({ type: DownloadActions.SETSTART, payload: input }),
      resetTime: () => dispatch({ type: DownloadActions.RESETSHHMM }),
      dateLabel: "start date",
      timeLabel: "start time",
      tipsInfo: "The start time selected is",
    },
    end_before: {
      time: downloadState.end,
      update: (input) =>
        dispatch({ type: DownloadActions.SETEND, payload: input }),
      resetTime: () => dispatch({ type: DownloadActions.RESETEHHMM }),
      dateLabel: "end date",
      timeLabel: "end time",
      tipsInfo: "The end time selected is",
    },
  };

  /** input fields accepting multiple select input */
  const multipleSelectInputFields = {
    "city id": {
      label: "Cities",
      value: downloadState.cityID,
      update: (e) =>
        dispatch({ type: DownloadActions.SETCITYID, payload: e.target.value }),
      options: cityIdList,
    },
    "device id": {
      label: "Devices",
      value: downloadState.deviceID,
      update: (e) =>
        dispatch({
          type: DownloadActions.SETDEVICEID,
          payload: e.target.value,
        }),
      options: deviceIdList,
    },
  };

  /** input fields accepting multiple manual input */
  const multiInputWithChipsFields = {
    "datapoint id": {
      label: "Datapoint ID",
      type: "number",
      helperText: "Press enter when finishing input one ID.",
      inputValue: downloadState.inputDatapointId,
      chipsArray: downloadState.datapointIdList,
      // onInput method to restrict the input value to number only
      onInput: (e) => (e.target.value = e.target.value.replace(/[^0-9]/g, "")),
      updateInput: (e) =>
        dispatch({
          type: DownloadActions.SETDATAPOINTIDINPUT,
          payload: e.target.value,
        }),
      handleKeyDown: handleDatapointIdKeyDown,
      handleDeleteChip: (chip) =>
        dispatch({ type: DownloadActions.DELETEDATAPOINTCHIP, payload: chip }),
    },
  };

  /** upload field, including upload button and upload files chips */
  const uploadFileFields = {
    "datapoint id": {
      label: "Datapoint ID",
      buttonContent: "upload datapoint id file",
      FilesList: downloadState.datapointIdFilesList,
      updateFileList: (file) =>
        dispatch({
          type: DownloadActions.SETDATAPOINTIDFILELIST,
          payload: file,
        }),
      deleteFile: (file) =>
        dispatch({
          type: DownloadActions.DELETEDATAPOINTIDFILE,
          payload: file,
        }),
    },
  };

  /** input fields accepting single input */
  const singleSelectInputFields = {
    "with label": {
      label: "With Label",
      value: downloadState.withLabel,
      update: (e) =>
        dispatch({
          type: DownloadActions.SETWITHLABEL,
          payload: e.target.value,
        }),
      selection: {
        Yes: true,
        No: false,
        "N/A": "N/A",
      },
    },
  };

  // get dynamic helper text for email input field
  const emailHelperText = () => {
    return (
      <span className={styles["email-to-verify-iput-helper-text"]}>
        <span>
          Input email to verify. Data downloaded will be sent to this email.
        </span>
        {downloadState.inputEmail !== "" && (
          <span style={{ color: downloadState.emailVerified ? "" : "#c1151f" }}>
            must have "irisradgroup.com" domain
          </span>
        )}
      </span>
    );
  };

  // the download data info
  const handleDownload = (e) => {
    e.preventDefault();

    const downloadContent = {
      start_time: moment.utc(downloadState.start).format("YYYY-MM-DDTHH:mm"),
      end_time: moment
        .utc(downloadState.end)
        // .subtract(1, "milliseconds") // subtract 1 milli second
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
      <div className={styles["email-to-verify"]}>
        <div className={styles["email-to-verify-input-textfield"]}>
          <TextField
            id="email"
            label="email"
            variant="outlined"
            helperText={emailHelperText()}
            // error={
            //   downloadState.inputEmail === ""
            //     ? false
            //     : !downloadState.emailVerified
            // }
            type="email"
            onChange={(e) =>
              dispatch({
                type: DownloadActions.SETEMAILANDVERIFY,
                payload: e.target.value,
              })
            }
            required
            // onKeyDown={}
            value={downloadState.inputEmail}
          />
        </div>
      </div>

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
      <div className={styles["radio-group-1"]}>
        <RadioGroup defaultValue="Cities" name="radio-buttons-group">
          {Object.values(multipleSelectInputFields).map((field) => (
            <div className={styles["multi-select"]} key={field["label"]}>
              <FormControlLabel
                value={field["label"]}
                control={<Radio />}
                onChange={(e) =>
                  dispatch({
                    type: DownloadActions.SETSELECTFIELD,
                    payload: e.target.value,
                  })
                }
                // sx={{ margin: 0 }}
              />
              <FormControl sx={{ width: "100%" }}>
                <InputLabel id={field["label"]}>{field["label"]}</InputLabel>
                <Select
                  labelId={field["label"]}
                  id={field["label"]}
                  disabled={downloadState.selectField !== field["label"]}
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
              <FormControlLabel
                value={field["label"]}
                control={<Radio />}
                onChange={(e) =>
                  dispatch({
                    type: DownloadActions.SETSELECTFIELD,
                    payload: e.target.value,
                  })
                }
              />
              <div className={styles["multi-input-textfield"]}>
                <TextField
                  id={field["label"]}
                  // type={field["type"]}
                  label={field["label"]}
                  variant="outlined"
                  disabled={downloadState.selectField !== field["label"]}
                  helperText={field["helperText"]}
                  onChange={field["updateInput"]}
                  onInput={field["onInput"]}
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
              isDisabled={downloadState.selectField !== field["label"]}
              buttonContent={field["buttonContent"]}
              FilesList={field["FilesList"]}
              updateFileList={field["updateFileList"]}
              deleteFile={field["deleteFile"]}
            />
          ))}
        </RadioGroup>
      </div>
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
      <div className={styles["button-area"]}>
        <div>
          <Button
            variant="outlined"
            startIcon={<SendIcon />}
            onClick={handleDownload}
            disabled={!downloadState.emailVerified}
          >
            send request
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;
