const fs = require("fs");

class Product {
  constructor(title, description, price, thumbnail, code, stock) {
    this.id = null;
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
  }
}

class ProductManager {
  #products;
  #productFilePath;

  constructor(filePath) {
    this.#products = [];
    this.#productFilePath = filePath;
  }

  // METODOS con persistencia en archivo.json

  // Crear producto
  addProduct = async (title, description, price, thumbnail, code, stock) => {
    let newProduct = new Product(title, description, price, thumbnail, code, stock);
    console.log("Crear Producto: producto a registrar:");
    console.log(newProduct);

    try {
      // Leer los productos actuales
      let products = await this.getProducts();

      // Generar el ID del nuevo producto
      let newId = 1;
      if (products.length > 0) {
        newId = products[products.length - 1].id + 1;
      }
      newProduct.id = newId;

      // Agregar el nuevo producto a la lista y guardarla en el archivo
      products.push(newProduct);
      await this.saveProducts(products);

      console.log("Lista actualizada de productos: ");
      console.log(products);

      return newProduct;
    } catch (error) {
      console.error(`Error creando producto nuevo: ${JSON.stringify(newProduct)}, detalle del error: ${error}`);
      throw Error(`Error creando producto nuevo: ${JSON.stringify(newProduct)}, detalle del error: ${error}`);
    }
  };

  // Leer productos
  getProducts = async () => {
    try {
      //Validamos que exista ya el archivo con productos si no se crea vacío para ingresar nuevos:
      if (!fs.existsSync(this.#productFilePath)) {
        //Se crea el archivo vacio.
        await this.saveProducts([]);
      }

      //leemos el archivo
      let productsFile = await fs.promises.readFile(this.#productFilePath, "utf-8");

      //Obtenemos el JSON String
      console.info("Archivo JSON obtenido desde archivo: ");
      console.log(productsFile);
      let products = JSON.parse(productsFile);
      console.log("Productos encontrados: ");
      console.log(products);

      return products;
    } catch (error) {
      console.error(
        `Error consultando los usuarios por archivo, valide el archivo: ${this.#productFilePath}, detalle del error: ${error}`
      );
      throw Error(
        `Error consultando los usuarios por archivo, valide el archivo: ${this.#productFilePath}, detalle del error: ${error}`
      );
    }
  };

  // Leer un producto por su ID
  getProductById = async (id) => {
    try {
      const products = await this.getProducts();
      const product = products.find((p) => p.id === id);
      if (product) {
        return product;
      } else {
        console.error("No se encontró el producto");
        return null;
      }
    } catch (error) {
      console.error(`Error al obtener el producto con ID ${id}: ${error}`);
      throw Error(`Error al obtener el producto con ID ${id}: ${error}`);
    }
  };

  // Actualizar un producto por su ID
  updateProduct = async (id, updatedFields) => {
    try {
      const products =await this.getProducts();
      const productIndex = products.findIndex((p) => p.id === id);
      if (productIndex !== -1) {
        // Actualizamos los campos que se hayan especificado en updatedFields
        for (const [key, value] of Object.entries(updatedFields)) {
          products[productIndex][key] = value;
        }
        // Guardamos los cambios en el archivo
        await this.saveProducts(products);
        console.log(`Producto con ID ${id} actualizado correctamente`);
      } else {
        console.error(`No se encontró el producto con ID ${id}`);
      }
    } catch (error) {
      console.error(`Error al actualizar el producto con ID ${id}: ${error}`);
      throw Error(`Error al actualizar el producto con ID ${id}: ${error}`);
    }
  };

  // Eliminar un producto por su ID
  deleteProduct = async (id) => {
    try {
      const products = await this.getProducts();
      const filteredProducts = products.filter((p) => p.id !== id);
      if (filteredProducts.length === products.length) {
        console.error(`No se encontró el producto con ID ${id}`);
      } else {
        // Guardamos los cambios en el archivo
        await this.saveProducts(filteredProducts);
        console.log(`Producto con ID ${id} eliminado correctamente`);
      }
    } catch (error) {
      console.error(`Error al eliminar el producto con ID ${id}: ${error}`);
      throw Error(`Error al eliminar el producto con ID ${id}: ${error}`);
    }
  };

  // Guardar lista de productos en archivo
  saveProducts = async (products) => {
    try {
      console.log(`Guardando productos en archivo: ${this.#productFilePath}`);
      await fs.promises.writeFile(this.#productFilePath, JSON.stringify(products, null, 2));
      console.log("Lista de productos guardada correctamente");
    } catch (error) {
      console.error(`Error guardando la lista de productos en archivo: ${error}`);
      throw Error(`Error guardando la lista de productos en archivo: ${error}`);
    }
  };
}

module.exports = ProductManager;