import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from "./connectDB";


export const createServer = () => {
    try {

        const app = express();
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(cookieParser())

        // app.use(cors({
        //     origin:'http://localhost:5173',
        //     methods:'GET,HEAD,PUT,PATCH,POST,DELETE',
        //     credentials:true
        // }))
        // app.use('/',userRoute);
        // app.use('/volunteer',volunteerRoute);
        // app.use('/admin',communityRoute);
        // app.use('/admin',adminRoute);


        return app
    } catch (error: any) {
        console.log(error.message);
    }
}

export const startServer = () => {
    try {
        connectDB();

        const app = createServer();

        app?.listen(3001, () => {
            console.log("server is running");
        });
    } catch (error) {
        console.log(error);
    }
};
