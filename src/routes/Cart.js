import express from "express";
import CartManager from "../managers/CartManager.js";
import ProductManager from "../managers/ProductManager.js";

const router = express.Router();
const CartService = new CartManager();
const ProductService = new ProductManager();

router.post("/", async (req, res) => {
  try {
    const cart = await CartService.create();
    res.status(201).send(cart);
  } catch (error) {
    res.status(500).send({ error: "Error al crear el carrito" });
  }
});

router.get("/", async (req, res) => {
  try {
    const carts = await CartService.getAll();
    res.status(200).send(carts);
  } catch (error) {
    res.status(500).send({ error: "Error al obtener los carritos" });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const cart = await CartService.getById(id);
    if (cart) {
      const products = await ProductService.getByIds(cart.products);
      res.status(200).send(products);
    } else {
      res.status(404).send({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    res.status(500).send({ error: "Error al obtener los productos del carrito" });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const quantity = parseInt(req.body.quantity) || 1;
    const cart = await CartService.getById(cartId);
    if (!cart) {
      res.status(404).send({ error: "Carrito no encontrado" });
    } else {
      const product = await ProductService.getById(productId);
      if (!product) {
        res.status(404).send({ error: "Producto no encontrado" });
      } else {
        const existingProductIndex = cart.products.findIndex((p) => p.product === productId);
        if (existingProductIndex === -1) {
          cart.products.push({ product: productId, quantity });
        } else {
          cart.products[existingProductIndex].quantity += quantity;
        }
        const updatedCart = await CartService.update(cartId, cart);
        res.status(200).send(updatedCart);
      }
    }
  } catch (error) {
    res.status(500).send({ error: "Error al agregar el producto al carrito" });
  }
});

export default router;
