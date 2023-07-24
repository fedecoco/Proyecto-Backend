import fs from "fs";

class ProductManager {
  #products;
  #productFilePath;

  constructor(filePath) {
    this.#products = [];
    this.#productFilePath = filePath;
  }

  // Métodos con persistencia en archivo.json

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
      // Validamos que exista el archivo con productos; si no existe, lo creamos vacío
      if (!fs.existsSync(this.#productFilePath)) {
        await this.saveProducts([]);
      }

      // Leemos el archivo
      let productsFile = await fs.promises.readFile(this.#productFilePath, "utf-8");

      // Obtenemos el JSON String
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
        console.error("No se encontró elproducto con el ID especificado");
        return null;
      }
    } catch (error) {
      console.error(`Error consultando producto por ID ${id}, detalle del error: ${error}`);
      throw Error(`Error consultando producto por ID ${id}, detalle del error: ${error}`);
    }
  };

  // Actualizar un producto
  updateProduct = async (id, updatedFields) => {
    try {
      let products = await this.getProducts();
      let productIndex = products.findIndex((p) => p.id === id);
      if (productIndex !== -1) {
        products[productIndex] = { ...products[productIndex], ...updatedFields };
        await this.saveProducts(products);
        console.log(`Producto con ID ${id} actualizado: `, products[productIndex]);
      } else {
        console.error(`No se encontró el producto con ID ${id}`);
      }
    } catch (error) {
      console.error(`Error actualizando producto con ID ${id}, detalle del error: ${error}`);
      throw Error(`Error actualizando producto con ID ${id}, detalle del error: ${error}`);
    }
  };

  // Eliminar un producto
  deleteProduct = async (id) => {
    try {
      let products = await this.getProducts();
      let productIndex = products.findIndex((p) => p.id === id);
      if (productIndex !== -1) {
        products.splice(productIndex, 1);
        await this.saveProducts(products);
        console.log(`Producto con ID ${id} eliminado`);
      } else {
        console.error(`No se encontró el producto con ID ${id}`);
      }
    } catch (error) {
      console.error(`Error eliminando producto con ID ${id}, detalle del error: ${error}`);
      throw Error(`Error eliminando producto con ID ${id}, detalle del error: ${error}`);
    }
  };

  // Guardar productos en archivo
  saveProducts = async (products) => {
    try {
      // Convertir la lista de productos a JSON String
      let productsJson = JSON.stringify(products, null, 2);

      // Guardar el JSON String en el archivo
      await fs.promises.writeFile(this.#productFilePath, productsJson, "utf-8");
      console.log(`Productos guardados en ${this.#productFilePath}`);
    } catch (error) {
      console.error(`Error guardando productos en archivo, detalle del error: ${error}`);
      throw Error(`Error guardando productos en archivo, detalle del error: ${error}`);
    }
  };
}

export default ProductManager;