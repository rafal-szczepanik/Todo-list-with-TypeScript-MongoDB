import express from 'express'
import {join} from 'path'
import {taskRouter} from "./routers/tasks"
import {notFound} from './middleware/not-found'
import {connectDB} from './db/db'
import {handleError} from './middleware/error-handler';
import * as dotenv from "dotenv";

dotenv.config();

const app = express();

//Middlewares
app.use(express.static(join(__dirname, './public')));
app.use(express.json());

//Routes
app.use('/api/v1/tasks', taskRouter);
app.use(notFound);
app.use(handleError);

const port = process.env.PORT || 3000;
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`App is working on http://localhost:${port}`);
        });
    } catch (err) {
        console.log(err);
    }
};

start();
