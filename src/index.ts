import cors from 'cors';
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import WebSocket from "ws";
import UserRoutes from "@controllers/rest/UsersController";
import CategoryRoutes from "@controllers/rest/CategoryController";
import ProductRoutes from "@controllers/rest/ProductController";
import AuctionRoutes from "@controllers/rest/AuctionController";
import BidRoutes from "@controllers/rest/BidController";
import { errorMiddleware, successMiddleware } from "@utils/wrapper"
import { Action, WsAction } from "@models/ws";
import WsRoutes from "@controllers/ws/WsController";

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
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});


// WebSocket endpoint
const wsPort = parseInt(process.env.WS_PORT || "3001");
const wss = new WebSocket.Server({ port: wsPort });

// WebSocket event handling
wss.on('connection', (ws) => {
    console.log('A new client connected.');

    ws.on('open', () => {
        console.log('Connected to server');
        ws.send('Hello, server!');
    });

    // Event listener for incoming messages
    ws.on('message', (message) => {
        // console.log('Received message:', message.toString());
        // Broadcast the message to all connected clients
        wss.clients.forEach(async (client) => {
            if (client.readyState === WebSocket.OPEN) {
                try {
                    const data: WsAction<any> = JSON.parse(message.toString());
                    const action = data.action;
                    let response;
                    switch (action) {
                        case Action.VIEW_AUCTION_BIDS:
                            response = await WsRoutes.viewBidsByAuction(data);
                            break;
                        case Action.PLACE_BID:
                            response = await WsRoutes.placeBid(data);
                            break;

                        default:
                            throw new Error("Invalid WebSocket action.");
                    }
                    client.send(JSON.stringify({
                        success: true,
                        data: response
                    }));
                } catch (error) {
                    console.error("Websocket onmessage error: " + error);
                    client.send(JSON.stringify({
                        success: false,
                        error: {
                            message: "Websocket onmessage error: " + error,
                        }
                    }));
                }
            }
        });
    });

    ws.on('error', () => {
        ws.close();
    })

    // Event listener for client disconnection
    ws.on('close', () => {
        console.log('A client disconnected.');
    });
});