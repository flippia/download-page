import styles from "./TimeInput.module.css";

import { useState, useEffect } from "react";

import moment from "moment";

import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import MobileDatePicker from "@mui/lab/MobileDatePicker";
import MobileTimePicker from "@mui/lab/MobileTimePicker";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

const TimeInput = (props) => {
  const { time, handleChange, resetTime, dateLabel, timeLabel, tipsInfo } =
    props;

  return (
    <div className={styles["time-input"]}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <div className={styles["date-pickers"]}>
          <MobileDatePicker
            label={dateLabel}
            value={time}
            onChange={handleChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </div>
        <div className={styles["time-pickers"]}>
          <MobileTimePicker
            label={timeLabel}
            showToolbar
            value={time}
            onChange={handleChange}
            renderInput={(params) => <TextField {...params} />}
          />
          <Tooltip title="reset time to default" placement="top">
            <IconButton onClick={resetTime}>
              <RestartAltIcon />
            </IconButton>
          </Tooltip>
        </div>
      </LocalizationProvider>
      <div className={styles["tips-info"]}>
        {tipsInfo}
        <div className={styles["tips-info-time"]}>
          Local {moment(time).format("MM/DD/YYYY HH:mm")}
        </div>
        <div className={styles["tips-info-time"]}>
          UTC {moment.utc(time).format("MM/DD/YYYY HH:mm")}
        </div>
      </div>
    </div>
  );
};

export default TimeInput;
