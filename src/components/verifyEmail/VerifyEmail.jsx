import styles from "./VerifyEmail.module.css";

import { useState } from "react";

import Button from "@mui/material/Button";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Backdrop from "@mui/material/Backdrop";
import TextField from "@mui/material/TextField";

const VerifyEmail = (props) => {
  const { verified, input, updateEmail, verifyEmail } = props;

  const [modalOpen, setModalOpen] = useState(false);
  //   const [verified, setVerified] = useState(false);
  const handleClose = (e) => {
    if (e.target.className.includes("backdrop")) {
      setModalOpen(false);
    }
  };
  const handleToggle = () => {
    setModalOpen((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    verifyEmail();
    setModalOpen(false);
    // console.log("email input", input);
  };

  return (
    <div>
      <Button
        variant="outlined"
        startIcon={verified ? <CheckCircleOutlineIcon /> : <HelpOutlineIcon />}
        onClick={handleToggle}
      >
        verify email
      </Button>
      <Backdrop
        className={styles["backdrop"]}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={modalOpen}
        onClick={handleClose}
      >
        <form className={styles["verify-modal"]} onSubmit={handleSubmit}>
          <div className={styles["email-input"]}>
            <TextField
              id="email"
              label="email"
              variant="outlined"
              value={input}
              onChange={updateEmail}
            />
          </div>
          <div className={styles["verify-submit-button"]}>
            <Button variant="outlined" onClick={handleSubmit}>
              verify
            </Button>
          </div>
        </form>
      </Backdrop>
    </div>
  );
};

export default VerifyEmail;
