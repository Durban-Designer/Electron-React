const express = require("express");
const bodyParser = require("body-parser");
const port = 3000;
const compression = require('compression');
const app = express();
const router = express.Router();
const path = require('path');
const dir = path.join(__dirname, "../../build/");

app.use(compression());
app.use(bodyParser.json());
app.use(express.static(dir));
app.use("/", router);

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS')
  next()
})

router.get("*", (req,res) => {
  res.sendFile(dir + "index.html");
})

router.use( (req,res,next) => {
  console.log("/" + req.method);
  next();
})


app.listen(port, () => {
  console.log("Live at Port " + port);
});
