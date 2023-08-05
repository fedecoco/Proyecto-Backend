import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

const pathToData = './data/cart.json';

class CartManager {
  async getAll(req, res) {
    const carts = await this.readData();
    res.json(carts);
  }

  async getById(req, res) {
    const carts = await this.readData();
    const cart = carts.find((item) => item.id == req.params.cid);

    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ mensaje: 'Carrito no encontrado' });
    }
  
  }

  async addProduct(req, res) {
    const { pid } = req.params;
    const carts = await this.readData();
    const indexCart = carts.findIndex((item) => item.id == req.params.cid);
    if (indexCart !== -1) {
      const indexProduct = carts[indexCart].products.findIndex((item) => item.id === pid);
      if (indexProduct !== -1) {
        carts[indexCart].products[indexProduct].quantity++;
      } else {
        carts[indexCart].products.push({ id: pid, quantity: 1 });
      }
      await this.overWrite(carts);
      res.json(carts[indexCart]);
    } else {
      const newCart = {
        id: uuidv4(),
        products: [{ id: pid, quantity: 1 }],
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

  async createCart(products) {
    let carts = await this.readData();
    if (carts.length == 0) {
      carts = [];
    }
    
    const newCart = {
      id: uuidv4(),
      products: products.map((product) => ({ id: product.id, quantity: product.quantity || 1 })),
    };
    
    carts.push(newCart);
    await this.overWrite(carts);
    return newCart;
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
}

export default CartManager;



