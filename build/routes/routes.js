"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const esquemas_1 = require("../model/esquemas");
const database_1 = require("../database/database");
class Routes {
    constructor() {
        this.getLibros = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield esquemas_1.Libros.aggregate([
                    {
                        $lookup: {
                            from: "vendidos",
                            localField: "isbn",
                            foreignField: "isbn",
                            as: "copias"
                        }
                    }
                ]);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.getVendidos = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.conectarBD()
                .then((mensaje) => __awaiter(this, void 0, void 0, function* () {
                const query = yield esquemas_1.Vendidos.find();
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.deleteVendidos = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { isbn, idioma } = req.params;
            yield database_1.db.conectarBD();
            yield esquemas_1.Vendidos.findOneAndDelete({ isbn: isbn,
                idioma: idioma }, (err, doc) => {
                if (err) {
                    console.log(err);
                }
                else {
                    if (doc == null) {
                        console.log('No existe el documento');
                        res.send('No existe el documento');
                    }
                    else {
                        console.log(doc);
                        res.send('El documento ha sido borrado' + doc);
                    }
                }
            });
            database_1.db.desconectarBD();
        });
        this.modificar = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { isbn, titulo, autor, genero, editorial, numPag, añoEdic, precio, stock } = req.body;
            yield database_1.db.conectarBD();
            yield esquemas_1.Libros.findOneAndUpdate({
                isbn: isbn
            }, {
                isbn: isbn,
                titulo: titulo,
                autor: autor,
                genero: genero,
                editorial: editorial,
                numPag: numPag,
                añoEdic: añoEdic,
                precio: precio,
                stock: stock
            }, {
                new: true,
                runValidators: true
            })
                .then((doc) => res.send(doc))
                .catch((err) => res.send('Error: ' + err));
            yield database_1.db.desconectarBD();
        });
        this.nuevoLibro = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { isbn, titulo, autor, genero, editorial, numPag, añoEdic, precio, stock } = req.body;
            const schema = {
                isbn: parseInt(isbn),
                titulo: titulo,
                autor: autor,
                genero: genero,
                editorial: editorial,
                numPag: parseInt(numPag),
                añoEdic: parseInt(añoEdic),
                precio: parseInt(precio),
                stock: stock
            };
            const nSchema = new esquemas_1.Libros(schema);
            yield database_1.db.conectarBD();
            yield nSchema.save()
                .then((doc) => {
                console.log(doc);
                res.json(doc);
            })
                .catch((err) => {
                console.log(err);
                res.json(err);
            });
            yield database_1.db.desconectarBD();
        });
        this._router = express_1.Router();
    }
    get router() {
        return this._router;
    }
    Rutas() {
        this._router.get('/libros', this.getLibros),
            this._router.get('/copias', this.getVendidos),
            this._router.get('/deleteVendidos/:isbn&:idioma', this.deleteVendidos),
            this._router.post('/libros/:isbn', this.modificar);
        this._router.post('/nuevo', this.nuevoLibro);
    }
}
const obj = new Routes();
obj.Rutas();
exports.routes = obj.router;
