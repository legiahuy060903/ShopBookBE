const express = require("express");
require("dotenv").config();

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;
const initRoutes = require('./routes');

const corsOptions = {
  origin: process.env.PORT_CLIENT,
  credentials: true,
}


app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
initRoutes(app);

app.listen(port, () => {
  console.log("Server running on the port: " + port);
});
