class Product {
    constructor(title, description, price, thumbnail, code, stock) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
};


class ProductManager {
    #products;
    #productDirPath;
    #productFilePath;
    #fileSystem;

    constructor() {
        this.#products = new Array();
        this.#productDirPath = "./files";
        this.#productFilePath = this.#productDirPath + "/Products.json";
        this.#fileSystem = require("fs");
    }


    // METODOS con persistencia en archivo.json
    // Crear producto
    addProduct = async (title, description, price, thumbnail, code, stock) => {
        let newProduct = new Product(title, description, price, thumbnail, code, stock);
        console.log("Crear Producto: producto a registrar:");
        console.log(newProduct);

        try {
            //Creamos el directorio
            await this.#fileSystem.promises.mkdir(this.#productDirPath, { recursive: true });

            //Validamos que exista ya el archivo con usuarios sino se crea vacío para ingresar nuevos:
            if (!this.#fileSystem.existsSync(this.#productFilePath)) {
                //Se crea el archivo vacio.
                await this.#fileSystem.promises.writeFile(this.#productFilePath, "[]");
            }

            //leemos el archivo
            let productsFile = await this.#fileSystem.promises.readFile(this.#productFilePath, "utf-8"); // []

            //Cargamos los productos encontrados para agregar el nuevo:
            //Obtenemos el JSON String 
            console.info("Archivo JSON obtenido desde archivo: ");
            console.log(productsFile);
            this.#products = JSON.parse(productsFile);

            console.log("Productos encontrados: ");
            console.log(this.#products);
            this.#products.push(newProduct);
            console.log("Lista actualizada de productos: ");
            console.log(this.#products);

            //Se sobreescribe el archivos de productos para persistencia.
            await this.#fileSystem.promises.writeFile(this.#productFilePath, JSON.stringify(this.#products, null, 2, '\t'));
        } catch (error) {
            console.error(`Error creando producto nuevo: ${JSON.stringify(newProduct)}, detalle del error: ${error}`);
            throw Error(`Error creando producto nuevo: ${JSON.stringify(newProduct)}, detalle del error: ${error}`);
        
            

        }
    }



    // Leer productos 
    getProducts = async () => {
        try {

            //Creamos el directorio
            await this.#fileSystem.promises.mkdir(this.#productDirPath, { recursive: true });

            //Validamos que exista ya el archivo con productos si no se crea vacío para ingresar nuevos:
            if (!this.#fileSystem.existsSync(this.#productFilePath)) {
                //Se crea el archivo vacio.
                await this.#fileSystem.promises.writeFile(this.#productFilePath, "[]");
            }

            //leemos el archivo
            let productsFile = await this.#fileSystem.promises.readFile(this.#productFilePath, "utf-8");


            //Obtenemos el JSON String 
            console.info("Archivo JSON obtenido desde archivo: ");
            console.log(productsFile);
            this.#products = JSON.parse(productsFile);
            console.log("Productos encontrados: ");
            console.log(this.#products);
            return this.#products;

        } catch (error) {
            console.error(`Error consultando los usuarios por archivo, valide el archivo: ${this.#productDirPath}, 
                detalle del error: ${error}`);
            throw Error(`Error consultando los usuarios por archivo, valide el archivo: ${this.#productDirPath},
             detalle del error: ${error}`);


            }
            
    }
// Metodos 
   getProductById = async (id) => {
    try {
        const products = await this.getProducts();
        const product = products.find(p => p.id === id);
        if (product) {
            return product;
        } else {
            console.error('No se encontró el producto');
            return null;
        }
    } catch (error) {
        console.error(`Error al obtener el producto con ID ${id}: ${error}`);
        throw Error(`Error al obtener el producto con ID ${id}: ${error}`);
    }
}
// Metodo 
updateProduct = async (id, updatedFields) => {
    try {
        const products = await this.getProducts();
        const productIndex = products.findIndex(p => p.id === id);
        if (productIndex >= 0) {
            const updatedProduct = { ...products[productIndex], ...updatedFields };
            products[productIndex] = updatedProduct;
            this.#products = products;
            await this.saveProducts();
            console.log('El producto se actualizó con éxito');
        } else {
            console.error('No se encontró el producto');
        }
    } catch (error) {
        console.error(`Error al actualizar el producto con ID ${id}: ${error}`);
        throw new Error(`Error al actualizar el producto con ID ${id}: ${error}`);
    }
}

//Metodo Borrar
deleteProduct = async (id) => {
    try {
        const products = await this.getProducts();
        const productIndex = products.findIndex(p => p.id === id);
        if (productIndex >= 0) {
            products.splice(productIndex, 1);
            this.#products = products;
            await this.saveProducts();
            console.log('El producto se eliminó con éxito');
        } else {
            console.error('No se encontró el producto');
        }
    } catch (error) {
        console.error(`Error al eliminar el producto con ID ${id}: ${error}`);
        throw new Error(`Error al eliminar el producto con ID ${id}: ${error}`);
    }
}
}

module.exports = ProductManager;