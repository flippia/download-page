import styles from "./UploadFile.module.css";

import { useState, useEffect } from "react";

import { styled } from "@mui/material/styles";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";

const FileInput = styled("input")({
  display: "none",
});

const UploadFile = (props) => {
  const { buttonContent, FilesList, updateFileList, deleteFile } = props;

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      console.log(e.target.files[0].name);
      const reader = new FileReader();
      reader.readAsText(e.target.files[0], "UTF-8");
      reader.onload = (event) => {
        const jsonContent = JSON.parse(event.target.result);
        const newFile = {
          fileName: e.target.files[0].name,
          fileContent: jsonContent,
        };
        updateFileList(newFile);
        console.log("file content", jsonContent);
      };
    }
  };

  return (
    <div className={styles["upload-file"]}>
      <div className={styles["upload-button"]}>
        <label htmlFor="upload-datapointId-json-file">
          <FileInput
            accept="application/JSON"
            id="upload-datapointId-json-file"
            type="file"
            onChange={handleFileChange}
          />
          <Button
            variant="outlined"
            component="span"
            startIcon={<FileUploadIcon />}
          >
            {buttonContent}
          </Button>
        </label>
      </div>
      <div className={styles["upload-files-chips"]}>
        {FilesList.map((file, index) => (
          <div className={styles["upload-files-one-chip"]} key={index}>
            <Chip label={file.fileName} onDelete={() => deleteFile(file)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadFile;
