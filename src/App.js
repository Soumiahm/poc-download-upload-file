import { useState } from "react";
import axios from "axios";
// import jsFileDownload from "js-file-download";
import fileDownload from "js-file-download";
import "./App.css";
function App() {
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState("");

  // ------------- Upload -----------------------------------
  const upload = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("clientpdf", file);

    try {
      // Use fetch to send the POST request with FormData
      const response = await axios.post(
        "http://localhost:5000/parse-pdf",
        formData
      );

      if (response.status === 200) {
        // Handle the data received from the server
        console.log("Server response:", response.data);
        setFileContent(response.data.textContent);
      } else {
        console.error("Failed to parse PDF:", response.statusText);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
  // ------------- Download -----------------------------------

  const download = (e) => {
    e.preventDefault();
    axios({
      url: "http://localhost:5000/download",
      method: "Get",
      responseType: "blob",
    }).then((res) => {
      console.log(res);
      fileDownload(res.data, "downloaded.pdf");
    });
  };
  // ------------- JSX -----------------------------------
  return (
    <div>
      <button className="download" onClick={(e) => download(e)}>
        Download File
      </button>

      <form className="uploadContainer">
        <input
          // className="uploadInput"
          type="file"
          name="clientpdf"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button className="uploadBtn" onClick={(e) => upload(e)}>
          Submit
        </button>
      </form>
      <div className="content">{fileContent}</div>
    </div>
  );
}

export default App;
