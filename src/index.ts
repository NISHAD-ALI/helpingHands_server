import {startServer} from './frameworks/config/app'
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env") });

startServer();
