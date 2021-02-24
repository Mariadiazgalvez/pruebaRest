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
exports.libroRoutes = void 0;
const express_1 = require("express");
const esquemas_1 = require("../model/esquemas");
const database_1 = require("../database/database");
class LibroosRoutes {
    constructor() {
        this.crearL = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
                stock: Boolean(stock)
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
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { titulo } = req.params;
            yield database_1.db.conectarBD();
            yield esquemas_1.Libros.findOneAndDelete({ titulo: titulo })
                .then((doc) => {
                console.log(doc);
            });
            database_1.db.desconectarBD();
        });
        this.get = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.conectarBD()
                .then((mensaje) => __awaiter(this, void 0, void 0, function* () {
                console.log(mensaje);
                console.log('Haciendo el query');
                const query = yield esquemas_1.Libros.find();
                console.log('Después del query');
                console.log(query);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
                console.log(mensaje);
            });
            database_1.db.desconectarBD();
        });
        this._router = express_1.Router();
    }
    get router() {
        return this._router;
    }
    misRutas() {
        this._router.get('/', this.get);
        this._router.delete('/borrar/titulo', this.delete);
        this._router.post('/nuevo', this.crearL);
    }
}
const obj = new LibroosRoutes();
obj.misRutas();
exports.libroRoutes = obj.router;
