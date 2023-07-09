import express from 'express'
import { createServer } from 'http'
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { router } from "./routes/routes";
import setupSocketIoServer from "./socket/socket";
import cors from 'cors';

const app = express();
const httpsServer = createServer(app);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
mongoose.set('toJSON', {
    virtuals: true,
    transform: function (_, converted) {
        delete converted._id;
    }
});
app.use(router)

setupSocketIoServer(httpsServer);

mongoose.connect('mongodb://localhost:27017/eltrello').then(() => {
    console.log('Connected to database');
    httpsServer.listen(4001, () => {
        console.log('listening on *:4001');
    });
});


