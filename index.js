const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const BASE_products  = "/api/v1/products";  
app.use(express.json());
const Product = require ('./src/models/productsModel');
const User = require ('./src/models/userModel');
const Invoice = require ('./src/models/invoceModel');
const { ObjectId } = require("mongodb");
const Joi = require('joi');

const PORT = 3001

//console.log("Mongo", process.env.mon.MONGODB_CONECTION);
//app.use("/", require("./src/routes/routes"));

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION, {
         useNewUrlParser:true,
         //useUnifiedTopology: true,
     });
    app.listen(PORT, () => {
      console.log(`Aplicacion corriendo en el puerto:${PORT} `);
    });
  } catch (e) {
    console.error(e);
    process.exit(1); // Forzar el cierre 
  }
};

start();
app.get(BASE_products, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json('Error al obtener los productos');
  }
});

app.post(BASE_products, async(req, res) => { 
  try {
    const newProduct = new Product(req.body)
    newProduct.save()
      .then(user => res.json(user))
      .catch(err => res.status(400).json("Error! " + err))
  } catch (error) {
    console.log(error)
    res.status(500).json('Product cant be saved, try again');
  }
});
app.patch(`${BASE_products}/:id`, async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedProduct = req.body;

    const product = await Product.findByIdAndUpdate(productId, updatedProduct, { new: true });

    if (!product) {
      return res.status(404).json('Producto no encontrado');
    }

    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json('Error al actualizar el producto');
  }
});
app.delete(`${BASE_products}/:id`, async (req, res) => {
  try {
    const productId = req.params.id;

    const deletedProduct = await Product.findByIdAndDelete(productId);
    res.send("el producto fue eliminado")

    if (!deletedProduct) {
      return res.status(404).json('Producto no encontrado');
    }

    res.json(deletedProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json('Error al eliminar el producto');
  }
});



app.post('/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    newUser.save()
      .then(user => {
        const userId = user._id; // Obtener el ID generado
        res.json({ userId, user });
      })
      .catch(err => res.status(400).json("Error! " + err));
  } catch (error) {
    console.log(error);
    res.status(500).json('User cannot be saved, try again');
  }
});


app.post('/invoices', async (req, res) => {
  try {
    const { createdAt, userId, items } = req.body;
    if (createdAt && userId && items) {
      let canSell = true; // Variable para controlar si se puede vender todos los productos

      for (const item of items) {
        const product = await Product.findById(item.productId);

        if (!product || item.quantity > product.quantity) {
          // Si el producto no existe o la cantidad solicitada es mayor al inventario
          canSell = false;
          break; // Sale del bucle y evita verificar el resto de los productos
        } else {
          // Restar la cantidad solicitada del inventario
          product.quantity -= item.quantity;
          await product.save(); // Guardar el producto actualizado en la base de datos
        }
      }

      if (canSell) {
        // Todos los productos tienen suficiente cantidad en el inventario
        // Procede a crear la factura y guardarla en la base de datos

        const newInvoice = new Invoice(req.body);
        newInvoice.save()
          .then(user => res.json(user))
          .catch(err => res.status(400).json("Error! " + err));
        //  console.log(p.quantity) //cantidad  en el inventario 

      } else {
        res.status(400).json(" no hay suficiente cantidad en el inventario");
      }
    } else {
      res.status(400).json("no hay suficiente cantidad en el inventario");
    
    }
  } catch (error) {
    console.log(error);
    res.status(500).json('Error al guardar la factura');
  }
});
