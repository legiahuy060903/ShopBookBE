const express = require("express");
require("dotenv").config();

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload')
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;
const initRoutes = require('./routes');

// const corsOptions = {
//   origin: 'http://localhost:3000',
//   credentials: true,
// }


app.use(cors());
app.use((req, res, next) => {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "'Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token'",
  });
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(fileUpload({
//   useTempFiles: true
// }))
initRoutes(app);

app.listen(port, () => {
  console.log("Server running on the port: " + port);
});