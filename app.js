const express = require('express');
const sequelize = require('./database/db');
const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");
const createRelations = require("./database/dbRelations");
const app = express();

app.use(express.json());
app.use("/users", userRoutes);
app.use("/books", bookRoutes);

(async () =>{
    try {
      await sequelize.sync(
        {force: false}
      )
      await createRelations();
      console.log("database sync complete");
      app.listen(process.env.EXTERNAL_PORT || 3000);
      console.log("Server listening on port " + process.env.EXTERNAL_PORT);
    } catch (error) {
      console.error(error);
    }
  })()

