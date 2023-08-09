import express from 'express';
import viewRouter from "./routes/view.router.js"
import productsRouter from './routes/Products.mjs';
import cartsRouter from './routes/Cart.mjs';
import { __dirname } from "./utils.js"
import handlebars from "express-handlebars"
import { Server } from "socket.io"
import ProductManager from "./managers/productManager.js"

const app = express();
const PORT = 8080;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"))

app.engine("handlebars", handlebars.engine())
app.set("view engine", "handlebars")
app.set("views", __dirname + "/views")



app.use('/api/products', productsRouter);
app.use('/api/cart', cartsRouter);
app.use('/', viewRouter)

const httpServer = app.listen(PORT, () => {
  console.log("server is working")
})

const socketServer = new Server(httpServer)
const pmanagersocket = new ProductManager(__dirname + "/data/data.json")

socketServer.on("connection", async (socket) => {
  console.log("client connected con ID:", socket.id)
  const listadeproductos = await pmanagersocket.getAll({}) 
  socketServer.emit("enviodeproducts", listadeproductos)

  socket.on("addProduct", async (obj) => {
    await pmanagersocket.addProduct(obj)
    const listadeproductos = await pmanagersocket.getAll({}) 
    socketServer.emit("enviodeproducts", listadeproductos)
  })

  socket.on("deleteProduct", async (id) => {
    console.log(id)
    await pmanagersocket.deleteProduct(id)
    const listadeproductos = await pmanagersocket.getAll({}) 
    socketServer.emit("enviodeproducts", listadeproductos)
  })
})