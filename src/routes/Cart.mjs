import express from 'express';
import CartManager from '../managers/CartManager.js';

const cartsRouter = express.Router();
const cartService = new CartManager();

cartsRouter.post('/', async (req, res) => {
  try {
    const cart = await cartService.createCart(req.body.productId);
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear el carrito' });
  }
});

cartsRouter.get('/:cid', (req, res) => cartService.getById(req, res));

cartsRouter.post('/:cid/product/:pid', (req, res) => cartService.addProduct(req, res));

cartsRouter.delete('/:cid/product/:pid', (req, res) => cartService.deleteProduct(req, res));

cartsRouter.put('/:cid/product/:pid', async (req, res) => {
  try {
    const cart = await cartService.updateProductInCart(req.params.cid, req.params.pid, req.body.quantity);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar producto en el carrito' });
  }
});

export default cartsRouter;




