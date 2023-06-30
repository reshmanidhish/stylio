// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");
hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

hbs.registerHelper('jsonParse', function (string) {
    return JSON.parse(string);
});


const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);
require("./config/session")(app)

const capitalize = require("./utils/capitalize");
const projectName = "stylio";

app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`;



// -----------------Registering Category Partial Start -----------------------//
const fs = require('fs')
const Category = require("./models/Category.model")

// Register the partials directory
hbs.registerPartials(__dirname);

// Read the layout template file
const layoutTemplate = fs.readFileSync('./views/layout.hbs', 'utf8'); // uncompiled layoutTemplate.hbs

// Compile the layout template
const compiledLayout = hbs.compile(layoutTemplate); // compiled layoutTemplate.hbs

// Read the partial template file
const partialTemplate = fs.readFileSync('./views/partials/categorypartials.hbs', 'utf8'); // uncompiled categorypartials.hbs

// Compile the partial template
const compiledPartial = hbs.compile(partialTemplate); // compiled categorypartials.hbs


// Render the partial with the catgeoryList data
Category.find().then(categoryList => { // get all categories from db
   // id: new Object("649613e8099ec2537626664f")
    const modifiedCategoryList = categoryList.map(category => ({
        id: category._id.valueOf(), // id: "649613e8099ec2537626664f"
        name: category.name,
    }));

    // Compile the partial template with categoryList data
    const renderedPartial = compiledPartial({categoryList: modifiedCategoryList});
    
    // Register the rendered partial template
    // categoryPartial - A  partial key to be replaced
    hbs.registerPartial("categoryPartial", renderedPartial);
  });


// -----------------Registering Category Partial Finished -----------------------//



// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);


const productRoutes = require("./routes/product.routes");
app.use("/product", productRoutes);

// const orderRoutes = require("./routes/order.routes");
// app.use("/order", orderRoutes);

const categoryRoutes = require("./routes/category.routes");
app.use("/category", categoryRoutes);




// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
