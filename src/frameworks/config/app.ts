import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from "./connectDB";
import userRoute from '../routes/userRoutes';
import CommunityRoutes from '../routes/communityRoutes';
import VolunteerRoutes from '../routes/volunteerRoutes';
import adminRoute from '../routes/adminRoutes';
import socketServer from './socket';
import http from 'http';

export const createServer = () => {
    try {
        const app = express();
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(cookieParser());

        app.use(cors({
            origin: 'https://helpinghandsindia.vercel.app',
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            credentials: true
        }));
        app.use('/', userRoute);
        app.use('/volunteer', VolunteerRoutes);
        app.use('/community', CommunityRoutes);
        app.use('/admin', adminRoute);

        const server = http.createServer(app);
        socketServer(server);

        return server;
    } catch (error: any) {
        console.log(error.message);
    }
};

export const startServer = () => {
    try {
        connectDB();

        const app = createServer();

        app?.listen(3000, () => {
            console.log("server is running @ 3000");
        });
    } catch (error) {
        console.log(error);
    }
};