"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = exports.createServer = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const connectDB_1 = __importDefault(require("./connectDB"));
const userRoutes_1 = __importDefault(require("../routes/userRoutes"));
const communityRoutes_1 = __importDefault(require("../routes/communityRoutes"));
const volunteerRoutes_1 = __importDefault(require("../routes/volunteerRoutes"));
const adminRoutes_1 = __importDefault(require("../routes/adminRoutes"));
const socket_1 = __importDefault(require("./socket"));
const http_1 = __importDefault(require("http"));
const createServer = () => {
    try {
        const app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use((0, cookie_parser_1.default)());
        app.use((0, cors_1.default)({
            origin: 'http://localhost:5173',
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            credentials: true
        }));
        app.use('/', userRoutes_1.default);
        app.use('/volunteer', volunteerRoutes_1.default);
        app.use('/community', communityRoutes_1.default);
        app.use('/admin', adminRoutes_1.default);
        const server = http_1.default.createServer(app);
        (0, socket_1.default)(server);
        return server;
    }
    catch (error) {
        console.log(error.message);
    }
};
exports.createServer = createServer;
const startServer = () => {
    try {
        (0, connectDB_1.default)();
        const app = (0, exports.createServer)();
        app === null || app === void 0 ? void 0 : app.listen(3001, () => {
            console.log("server is running @ 3001");
        });
    }
    catch (error) {
        console.log(error);
    }
};
exports.startServer = startServer;
