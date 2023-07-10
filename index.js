 /*/ class ProductManager {
    constructor() {
      this.patch = 
      this.products = [];
      this.idCounter = 1;
    }
 
// Metodos

//Agregar Productos
    addProduct(title, description, price, thumbnail, code, stock) {
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        console.error('All fields are required');
        return;
      }
      for (let i = 0; i < this.products.length; i++) {
        if (this.products[i].code === code) {
          console.error('El codigo ya existe');
          return;
        }
      }

      const product = {
        id: this.idCounter++,
        title: title,
        description: description,
        price: price,
        thumbnail: thumbnail,
        code: code,
        stock: stock
      };
      this.products.push(product);
      console.log('El producto se agrego con exito!');
    }
  
// Lista de Productos
    getProducts() {
      return this.products;
    }
// Buscador de Productos  
    getProductById(id) {
      for (let i = 0; i < this.products.length; i++) {
        if (this.products[i].id === id) {
          return this.products[i];
        }
      }
      console.error('No se encontro el producto');
      return null;
    }
  }

  const productManager = new ProductManager();
  productManager.addProduct('Botines de futbol', 'Para pasto', 30.0, 'Imagen', 'CODE1', 100);
  const product = productManager.getProductById(1);
  console.log(product);
  
  */
  const ProductManager = require("./ProductManager.js");
  let productManager = new ProductManager();
  console.log(productManager);
  
  let persistirProduct = async () => {
      let product = await productManager.addProduct('Botines de futbol', 'Para pasto', 30.0, 'Imagen', 'CODE1', 100);
  
  
      let products = await productManager.getProducts();
      console.log(`Productos encontrados en Product Manager: ${products.length}`);
      console.log(products);

      // Obtener un producto por su ID
      let productById = await productManager.getProductById(product.id);
      console.log(`Producto encontrado por ID: ${productById.title}`);

      // Actualizar un producto
      let updatedFields = { title: 'Botines de futbol Nike', description: 'Para pasto', price: 40.0 };
      await productManager.updateProduct(product.id, updatedFields);

      // Eliminar un producto
      await productManager.deleteProduct(product.id);
  };
  persistirProduct();
