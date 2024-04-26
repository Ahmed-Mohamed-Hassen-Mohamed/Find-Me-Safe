const express = require("express");
const app = express();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: { origin: "*" },
});

const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();
const port = 10000;
require("./db/mongoose");
app.use(express.json());
app.use(cors());
app.use(helmet());

const socket = require("./socket");
socket(io);

const usersRouter = require("./routers/users");
const addressesRouter = require("./routers/addresses");
const childernRouter = require("./routers/childern");
const contactParticipantsRouter = require("./routers/contactParticipants");
const emergencyContactsRouter = require("./routers/emergencyContacts");
const medicalPrescriptionsRouter = require("./routers/medicalPrescriptions");
const medicalRecordsRouter = require("./routers/medicalRecords");
const chatsRouter = require("./routers/chats");
const messagesRouter = require("./routers/messages");
const notificationsRouter = require("./routers/notifications");
const embeddingRouter = require("./routers/embedding");

app.use(usersRouter);
app.use(addressesRouter);
app.use(childernRouter);
app.use(contactParticipantsRouter);
app.use(emergencyContactsRouter);
app.use(medicalPrescriptionsRouter);
app.use(medicalRecordsRouter);
app.use(chatsRouter);
app.use(messagesRouter);
app.use(notificationsRouter);
app.use(embeddingRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.all("*", (req, res, next) => {
  next(new Error(`Con't find this route: ${req.originalUrl}`));
});

httpServer.listen(port, () => console.log(`listening on port ${port}`));
