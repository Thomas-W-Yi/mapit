//routes
const apiRoutes = require("./apiRoutes");
const userRoutes = require("./userRoutes");
const db = require("./database");

// Web server config
const PORT = process.env.PORT || 8080;
// const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const path = require("path");
const cookieSession = require("cookie-session");
const morgan = require("morgan");
const app = express();

app.use(
  cookieSession({
    name: "session",
    keys: ["key1"],
  })
);

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  "/styles",
  sass({
    src: __dirname + "/styles",
    dest: __dirname + "/public/styles",
    debug: true,
    outputStyle: "expanded",
  })
);

//Middleware method override
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "../public")));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own

// /api/endpoints
const apiRouter = express.Router();
apiRoutes(apiRouter, db);
app.use("/api", apiRouter);

// /user/endpoints
const userRouter = express.Router();
userRoutes(userRouter, db);
app.use("/users", userRouter);

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
