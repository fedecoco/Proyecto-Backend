import express from 'express';

import routerP from './routes/Products.js';
import routerC from './routes/Cart.mjs';
import routerV from './routes/view.router.js';

import { __dirname } from "./utils.js"
import handlebars from "express-handlebars"

import { Server } from "socket.io"
import socketProducts from "./listeners/socketProducts.js"
import socketChat from './listeners/socketChat.js';

import connectToDB from "./config/configServer.js"

const app = express();
const PORT = 8080;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"))

app.engine("handlebars", handlebars.engine())
app.set("view engine", "handlebars")
app.set("views", __dirname + "/views")



app.use('/api/products', routerP);
app.use('/api/cart', routerC);
app.use('/', routerV)

connectToDB()

const httpServer = app.listen(PORT, () => {
  try {
      console.log(`Listening to the port ${PORT}\nAcceder a:`);
      console.log(`\t1). http://localhost:${PORT}/api/products`)
      console.log(`\t2). http://localhost:${PORT}/api/carts`);
  }
  catch (err) {
      console.log(err);
  }
});

const socketServer = new Server(httpServer)
socketProducts(socketServer)
socketChat(socketServer)