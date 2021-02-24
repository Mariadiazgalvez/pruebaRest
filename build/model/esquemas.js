"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vendidos = exports.Libros = void 0;
const mongoose_1 = require("mongoose");
// Definimos el Schema
const librosSchema = new mongoose_1.Schema({
    isbn: Number,
    titulo: String,
    autor: String,
    genero: String,
    editorial: String,
    numPag: Number,
    añoEdic: Number,
    precio: Number,
    stock: Boolean
});
const vendidosSchema = new mongoose_1.Schema({
    isbn: Number,
    idioma: String,
    copias: Number,
    ventaCop: Number,
    fRealizacion: Date
});
exports.Libros = mongoose_1.model('libros', librosSchema);
exports.Vendidos = mongoose_1.model('vendidos', vendidosSchema);
