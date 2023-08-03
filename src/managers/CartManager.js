import fs from "fs";
import { v4 as uuidv4 } from 'uuid';

const pathToData = './data/cart.json';

class CartManager {
  async getAll(req, res) {
    const carts = await this.readData();
    res.json(carts);
  }

  async getById(req, res) {
    const carts = await this.readData();
    const cart = carts.find((item) => item.id === parseInt(req.params.cid));
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ mensaje: 'Carrito no encontrado' });
    }
  }

  async addProduct(req, res) {
    const { productId } = req.body;
    const carts = await this.readData();
    const indexCart = carts.findIndex((item) => item.id === req.params.cid);
    if (indexCart !== -1) {
      if (carts[indexCart].products.find((item) => item.id === productId)) {
        res.status(400).json({ mensaje: 'El producto ya se encuentra en el carrito' });
      } else {
        carts[indexCart].products.push({ id: productId });
        await this.overWrite(carts);
        res.json(carts[indexCart]);
      }
    } else {
      const newCart = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        products: [{ id: productId }],
      };
      carts.push(newCart);
      await this.overWrite(carts);
      res.status(201).json(newCart);
    }
  }

  async deleteProduct(req, res) {
    const { productId } = req.body;
    const carts = await this.readData();
    const indexCart = carts.findIndex((item) => item.id === req.params.cid);
    if (indexCart !== -1) {
      const indexProduct = carts[indexCart].products.findIndex((item) => item.id === productId);
      if (indexProduct !== -1) {
        carts[indexCart].products.splice(indexProduct, 1);
        await this.overWrite(carts);
        res.json(carts[indexCart]);
      } else {
        res.status(404).json({ mensaje: 'El producto no se encuentra en el carrito' });
      }
    } else {
      res.status(404).json({ mensaje: 'Carrito no encontrado' });
    }
  }

  async deleteCart(req, res) {
    const carts = await this.readData();
    const filterCarts = carts.filter((item) => item.id !== req.params.cid);
    if (filterCarts.length !== carts.length) {
      await this.overWrite(filterCarts);
      res.json({ mensaje: 'Carrito eliminado exitosamente' });
    } else {
      res.status(404).json({ mensaje: 'Carrito no encontrado' });
    }
  }

  async createCart(req, res) {
    const { productId } = req.body;
    const newCart = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      products: [{ id: productId }],
    };
    const carts = await this.readData();
    carts.push(newCart);
    await this.overWrite(carts);
    res.status(201).json(newCart);
  }

  async readData() {
    try {
      const data = await fs.promises.readFile(pathToData, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async overWrite(data) {
    try {
      await fs.promises.writeFile(pathToData, JSON.stringify(data, null, 2));
    } catch (error) {
      throw new Error('Error al escribir en el archivo');
    }
  }
  async getProductsByCartId(req, res) {
    const carts = await this.readData();
    const cart = carts.find((item) => item.id === req.params.cid);
    if (cart) {
      res.json(cart.products);
    } else {
      res.status(404).json({ mensaje: 'Carrito no encontrado' });
    }
  }
  async updateProductInCart(cartId, productId, quantity) {
    const carts = await this.readData();
    const cartIndex = carts.findIndex((item) => item.id === cartId);
    if (cartIndex !== -1) {
      const productIndex = carts[cartIndex].products.findIndex((item) => item.id === productId);
      if (productIndex !== -1) {
        carts[cartIndex].products[productIndex].quantity = quantity;
        await this.overWrite(carts);
        return carts[cartIndex];
      } else {
        throw new Error('Producto no encontrado');
      }
    } else {
      throw new Error('Carrito no encontrado');
    }
  }
}

export default CartManager;




