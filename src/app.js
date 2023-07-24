import express from 'express';
import ProductManager from "../ProductManager.js";

const app = express();
const PORT = 8080;

// Api
app.get('/products', async (req, res) => {
    const productManager = new ProductManager('./files/Products.json');
    
    const limit = req.query.limit;
    const products = await productManager.getProducts();
    
    if (limit) {
      res.send(products.slice(0, limit));
    } else {
      res.send(products);
    }
});

// Otro Get
app.get('/products/:pid', async (req, res) => {
  const productManager = new ProductManager('./files/Products.json');
  
  const pid = parseInt(req.params.pid);
  
  const product = await productManager.getProductById(pid);
  
  if (product) {
    res.send(product);
  } else {
    res.status(404).send(`Product with id ${pid} not found`);
  }
});
//Confirmo puerto de escucha
app.listen(PORT, () => {
    console.log(`Server run on port : ${PORT}`);
})

