import express from "express";
import cors from "cors";

const port = 8080;
const server = express();
const router = express.Router();

server.use (express.json());
server.use (express.urlencoded({extended:true}));
server.use (cors());

server.use ("/api", router);

server.listen(port, function startServer(){
    console.log(`Start server on port ${port}`);
});

export {router, server};