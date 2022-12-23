const fs = require("node:fs");

class ProductManager {
  products;
  constructor(path) {
    this.path = path;
    this.lastId = -1;
    this.products = [];
    this.loadFile();
  }

  loadFile() {
    try {
      console.log("Loading File, path: ", this.path);
      this.products = JSON.parse(fs.readFileSync(this.path, "utf-8"));
    } catch (err) {
      throw new Error(err);
    }
  }

  async deleteProduct(id) {
    this.products = this.products.filter((product) => product.id !== id);
    
    await this.saveInFile();
  }

  async updateProduct(product, id) {
    const productIndex = this.products.findIndex(
      (existingProduct) => existingProduct.id === id
    );
    if (productIndex > -1) {
      console.log("El producto fue encontrado");
      product.id = id;
      //this.deleteProduct(id);
      this.products[productIndex] = product;
      await this.saveInFile();
    }
  }
  verifyProduct(product) {
    if (!product) {
      console.log("El producto no existe, no se guardó.");
      return false;
    }
    if (
      !product.title ||
      !product.code ||
      !product.description ||
      !product.price ||
      product.stock < 0 ||
      product.stock == null ||
      !product.thumbnail
    ) {
      console.log(
        "El producto no tiene uno o mas campos obligatorios, no se guardó."
      );
      return false;
    }
    return true;
  }
  async addProduct(product) {
    if (!this.verifyProduct) {
      return;
    }
    if (
      this.products.find(
        (existingProduct) => existingProduct.code === product.code
      )
    ) {
      console.log("El producto a agregar tiene un codigo en uso.");
      return;
    }
    this.lastId++;
    product.id = this.lastId;
    this.products.push(product);
    await this.saveInFile();
  }
  getProducts() {
    return this.products;
  }
  getProductById(id) {
    return this.products.find((product) => product.id === id);
  }
  /* 
  saveInFile() {
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.products));
    } catch (err) {
      throw new Error(err);
    }
  } */

  async saveInFile() {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(this.products));
    } catch (err) {
      throw new Error(err);
    }
  }
}
async function main() {


  const MyPM = new ProductManager("./products.json");

  await MyPM.addProduct({
    title: "Smart TV Led",
    description: "Bgh 43 Full Hd Pne040253 Android 220v",
    price: 63.999,
    thumbnail:
      "https://http2.mlstatic.com/D_NQ_NP_689494-MLA51838855315_102022-O.webp",
    code: "1051",
    stock: 5,
  });
  await MyPM.addProduct({
    title: "Sommier",
    description: "La Cardeuse Native 400 King de 200cmx200cm gris",
    price: 150.92,
    thumbnail:
      "https://http2.mlstatic.com/D_NQ_NP_986182-MLA49472314801_032022-O.webp",
    code: "6541",
    stock: 4,
  });

  console.log("Todos los productos: ", MyPM.getProducts());
  console.log("Producto de id=1: ", MyPM.getProductById(1));
  await MyPM.deleteProduct(0);
  await MyPM.updateProduct(
    {
      title: "Sommier Updated",
      description: "La Cardeuse Native 400 King de 200cmx200cm gris",
      price: 150.92,
      thumbnail:
        "https://http2.mlstatic.com/D_NQ_NP_986182-MLA49472314801_032022-O.webp",
      code: "6541",
      stock: 4,
    },
    1
  );

  console.log("Todos los productos: ", MyPM.getProducts());
}

main().finally(() => console.log("Fin"));
