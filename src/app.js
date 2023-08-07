import express from 'express';
import productsRouter from './routes/Products.mjs';
import cartsRouter from './routes/Cart.mjs';

const app = express();
const PORT = 8080;



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('¡Bienvenido a la página principal!');
});

app.use('/api/products',productsRouter);
app.use('/api/cart', cartsRouter);

app.get('*', function (req, res) {
  res.send({
    status: 'error',
    description: `ruta ${req.url} método ${req.method} no implementada`,
  });
});

// puerto de escucha
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});