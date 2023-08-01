import express from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = express.Router();
const ProductService = new ProductManager();

router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || undefined;
    const products = await ProductService.getAll(limit);
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send({ error: 'Error al obtener los productos' });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const product = await ProductService.getById(id);
    if (product) {
      res.status(200).send(product);
    } else {
      res.status(404).send({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).send({ error: 'Error al obtener el producto' });
  }
});

router.post('/', async (req, res) => {
  try {
    const product = req.body;
    const newProduct = await ProductService.add(product);
    res.status(201).send(newProduct);
  } catch (error) {
    res.status(500).send({ error: 'Error al agregar el producto' });
  }
});

router.put('/:pid', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const product = req.body;
    const updatedProduct = await ProductService.update(id, product);
    if (updatedProduct) {
      res.status(200).send(updatedProduct);
    } else {
      res.status(404).send({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).send({ error: 'Error al actualizar el producto' });
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deletedProduct = await ProductService.deleteById(id);
    if (deletedProduct) {
      res.status(200).send(deletedProduct);
    } else {
      res.status(404).send({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).send({ error: 'Error al eliminar el producto' });
  }
});

export default router;