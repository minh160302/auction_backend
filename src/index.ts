import cors from 'cors';
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import UserRoutes from "@controllers/rest/UsersController";
import CategoryRoutes from "@controllers/rest/CategoryController";
import ProductRoutes from "@controllers/rest/ProductController";
import AuctionRoutes from "@controllers/rest/AuctionController";
import BidRoutes from "@controllers/rest/BidController";
import { errorMiddleware, successMiddleware } from "@utils/wrapper"
import { Action, PlaceBidRequest, ViewAuctionBidsRequest } from "@models/ws";
import WsRoutes from "@controllers/ws/WsController";
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents } from './typings';
import { instrument } from '@socket.io/admin-ui';

dotenv.config();

const app: Express = express();


// Middleware
app.use(express.json());
app.use(cors());
app.use(successMiddleware);

// Routes
app.get("/ping", (req: Request, res: Response) => {
    res.send("Ping successfully");
});

app.use("/users", UserRoutes);
app.use("/categories", CategoryRoutes);
app.use("/products", ProductRoutes);
app.use("/auctions", AuctionRoutes);
app.use("/bids", BidRoutes);


// Error Middleware must be defined after routes
app.use(errorMiddleware);


// REST endpoint
const port = process.env.PORT || 3000;

const server = createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
    cors: {
        origin: ["http://localhost:3000", "https://admin.socket.io"],
        methods: ["GET", "POST"],
        credentials: true,
    },
});

instrument(io, {
    auth: false,
    mode: "development",
});

io.on("connection", (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
    socket.on("clientMsg", (data) => {
        console.log(data);
        if (data.room === "") {
            io.sockets.emit("server_common", { success: true, data: data });
        } else {
            socket.join(data.room);
            io.to(data.room).emit("server_common", { success: true, data: data });
        }
    });


    /**
    Request
        action: @/models/ws.ts/Action; 
        room: auction_id;
        body: @/models/ws.ts/ViewAuctionBidsRequest;
    
    
    Response:
        room & event depends on action being sent
        always send back to correct socket id
     */
    socket.on("auction", async (data) => {
        let room: string = '';
        try {
            const action = data.action;
            let response;
            switch (action) {
                case Action.VIEW_AUCTION_BIDS:
                    room = `auction_${(<ViewAuctionBidsRequest>data.body).auction_id}`;
                    response = await WsRoutes.viewBidsByAuction(data.body);
                    break;
                case Action.PLACE_BID:
                    const t = (<PlaceBidRequest>data.body);
                    room = `auction_${t.auction_id}`;
                    response = await WsRoutes.placeBid(data.body);
                    break;

                default:
                    room = 'server_error';
                    throw new Error("Invalid WebSocket action.");
            }

            socket.join(room);
            io.to(room).emit(data.action, {
                success: true,
                data: response
            });
        } catch (error) {
            room += `_socketId_${socket.id}`;
            socket.join(room);
            io.to(room).emit("server_common", {
                success: false,
                data: {
                    message: "Websocket event error: " + error,
                }
            });
        }
    })
}
);

server.listen(port, () => {
    console.log(`Server running ${port}`);
});

// app.listen(port, () => {
//     console.log(`[server]: Server is running at http://localhost:${port}`);
// });


// // WebSocket endpoint
// const wsPort = parseInt(process.env.WS_PORT || "3001");
// const wss = new WebSocket.Server({ port: wsPort });

// // WebSocket event handling
// wss.on('connection', (ws) => {
//     console.log('A new client connected.');

//     ws.on('open', () => {
//         console.log('Connected to server');
//         ws.send('Hello, server!');
//     });

//     // Event listener for incoming messages
//     ws.on('message', (message) => {
//         // console.log('Received message:', message.toString());
//         // Broadcast the message to all connected clients
//         wss.clients.forEach(async (client) => {
//             if (client.readyState === WebSocket.OPEN) {
//                 try {
//                     const data: WsAction<any> = JSON.parse(message.toString());
//                     const action = data.action;
//                     let response;
//                     switch (action) {
//                         case Action.VIEW_AUCTION_BIDS:
//                             response = await WsRoutes.viewBidsByAuction(data);
//                             break;
//                         case Action.PLACE_BID:
//                             response = await WsRoutes.placeBid(data);
//                             break;

//                         default:
//                             throw new Error("Invalid WebSocket action.");
//                     }
//                     client.send(JSON.stringify({
//                         success: true,
//                         data: response
//                     }));
//                 } catch (error) {
//                     console.error("Websocket onmessage error: " + error);
//                     client.send(JSON.stringify({
//                         success: false,
// error: {
//     message: "Websocket onmessage error: " + error,
// }
//                     }));
//                 }
//             }
//         });
//     });

//     ws.on('error', () => {
//         ws.close();
//     })

//     // Event listener for client disconnection
//     ws.on('close', () => {
//         console.log('A client disconnected.');
//     });
// });