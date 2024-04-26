const mongoose = require("mongoose");
mongoose
  .connect("mongodb://127.0.0.1:27017/find_me_safe", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });
