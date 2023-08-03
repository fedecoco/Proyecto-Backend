import express from 'express';
import ProductManager from '../managers/ProductManager.js';

const productsRouter = express.Router();
const productService = new ProductManager();

productsRouter.get('/', productService.getAll);
productsRouter.get('/:pid', productService.getById);
productsRouter.post('/', productService.addProduct);
productsRouter.put('/:pid', productService.updatedProduct);
productsRouter.delete('/:pid', productService.deleteProduct);

export default productsRouter;
