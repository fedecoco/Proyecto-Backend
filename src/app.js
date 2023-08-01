import express from 'express';
import productRouter from './routes/Products.js';
import cartRouter from './routes/Cart.js';

const app = express();
const PORT = 8080;

// puerto de escucha
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);

app.get('*', function (req, res) {
  res.send({
    status: 'error',
    description: `ruta ${req.url} método ${req.method} no implementada`,
  });
});