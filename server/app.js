const express = require("express");
const pdfparser = require("pdf-parse");

const fileUpload = require("express-fileupload");
var cors = require("cors");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(fileUpload()); // Use express-fileupload middleware

const port = 5000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Parse file
app.post("/parse-pdf", async (req, res) => {
  try {
    const filename = Date.now() + "_" + req.files.clientpdf.name;
    const file = req.files.clientpdf;

    // Save file in the uploads folder
    const uploadPath = __dirname + "/uploads/" + filename;
    file.mv(uploadPath, (err) => {
      if (err) {
        return res.status(500).send(err);
      }
    });

    // Parse the PDF file content
    const data = await pdfparser(file);
    // Send parsed text content to the client
    res.json({ textContent: data.text });
  } catch (error) {
    console.error("Error parsing PDF:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/download", (req, res) => {
  res.download("file-to-download.pdf");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
