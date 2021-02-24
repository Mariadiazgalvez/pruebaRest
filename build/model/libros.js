"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Libros = exports.libroSchema = exports.Libro = void 0;
const mongoose_1 = require("mongoose");
class Libro {
    constructor(id, titulo, autor, genero, editorial, numPag, añoEdic, precio, stock) {
        this._isbn = id;
        this._titulo = titulo;
        this._autor = autor;
        this._genero = genero;
        this._editorial = editorial;
        this._numPag = numPag;
        this._añoEdic = añoEdic;
        this._precio = precio;
        this._stock = false;
    }
    get id() {
        return this._isbn;
    }
    get titulo() {
        return this._titulo;
    }
    get autor() {
        return this._autor;
    }
    get genero() {
        return this._genero;
    }
    get editorial() {
        return this._editorial;
    }
    get numPag() {
        return this._numPag;
    }
    get añoEdic() {
        return this._añoEdic;
    }
    get precio() {
        return this._precio;
    }
    get stock() {
        return this._stock;
    }
    set titulo(titulo) {
        this._titulo = titulo;
    }
    set autor(autor) {
        this._autor = autor;
    }
    set genero(genero) {
        this._genero = genero;
    }
    set editorial(editorial) {
        this._editorial = editorial;
    }
    set numPag(numPag) {
        if (numPag < 100) {
            throw "No puede haber ningun libro con menos de 100 paginas";
        }
        this._numPag = numPag;
    }
    set precio(precio) {
        if (precio > 40) {
            throw "El precio maximo de un libro es menor a 40 euros";
        }
        this._precio = precio;
    }
    set stock(stock) {
        this._stock = stock;
    }
    vender() {
        if (!this._stock) {
            this._stock = true;
            return "Dicho libro estaba agotado pero ya hay en el almacen";
        }
        else {
            return "Este libro puede ser vendido";
        }
    }
}
exports.Libro = Libro;
// Definimos el Schema
exports.libroSchema = new mongoose_1.Schema({
    isbn: {
        type: Number,
        unique: true // useCreateIndex: true en la conexión para que se cree el índice único
    },
    titulo: String,
    autor: String,
    genero: [String],
    editorial: String,
    numPag: Number,
    añoEdic: Number,
    precio: Number,
    stock: Boolean
});
// La colección de la BD: vehiculos (Plural siempre)
exports.Libros = mongoose_1.model('libros', exports.libroSchema);
