import express from 'express'
import { createServer } from 'http'
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { router } from "./routes/routes";
import setupSocketIoServer from "./socket/socket";

const app = express();
const httpsServer = createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(router)

setupSocketIoServer(httpsServer);

mongoose.connect('mongodb://localhost:27017/eltrello').then(() => {
    console.log('Connected to database');
    httpsServer.listen(4001, () => {
        console.log('listening on *:4001');
    });
});


