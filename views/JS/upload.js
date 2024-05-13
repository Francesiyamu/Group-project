const express = require("express"); //imports express
const fileUpload = require("express-fileupload"); //imports express file middleware
const path = require("path"); //imports path module from node

const PORT = process.env.PORT || 3000; //port

const app = express();


//Upload route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "fact_lev_toe.html"))
});

//upload middleware

app.post('/upload',
  fileUpload({ createParentPath: true}),
  (req, res) =>{
    const files = req.files
    console.log(files)
    return res.json({ status:'logged', message: 'logged'})
  }

)



app.listen(PORT, () => console.log(`server is running on port ${PORT}`));

