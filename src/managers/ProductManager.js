import fs from "fs";
import { v4 as uuidv4 } from 'uuid';

const pathToData = './data/data.json';

class ProductManager {
  constructor() {
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.addProduct = this.addProduct.bind(this);
    this.updatedProduct = this.updatedProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
  }

  async getAll(req, res) {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const products = await this.readData();
    res.json(limit ? products.slice(0, limit) : products);
  }

  async getById(req, res) {
    const products = await this.readData();
    const product = products.find((item) => item.id === parseInt(req.params.pid));
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
  }

  async addProduct(req, res) {
    const { title, description, code, price } = req.body;
    const newProduct = {
      id: uuidv4(),
      title,
      description,
      code,
      price,
    };
    const product = await this.readData();
    product.push(newProduct);
    await this.overWrite(product);
    res.status(201).json(newProduct);
  }

  async updatedProduct(req, res) {
    const { title, description, code, price } = req.body;
    const products = await this.readData();
    const indexProduct = products.findIndex((item) => item.id === req.params.pid);
    if (indexProduct !== -1) {
      products[indexProduct] = {
        ...products[indexProduct],
        title,
        description,
        code,
        price,
      };
      await this.overWrite(products);
      res.json(products[indexProduct]);
    } else {
      res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
  }

  async deleteProduct(req, res) {
    const products = await this.readData();
    const filterProduct = products.filter((item) => item.id !== req.params.pid);
    if (filterProduct.length !== products.length) {
      await this.overWrite(filterProduct);
      res.json({ mensaje: 'Producto eliminado exitosamente' });
    } else {
      res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
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

export default ProductManager;
