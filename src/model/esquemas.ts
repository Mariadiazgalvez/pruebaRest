import {Schema, model } from 'mongoose'


// Definimos el Schema
const librosSchema = new Schema({
    isbn:Number,
    titulo:String,
    autor:String,
    genero:String,
    editorial:String,
    numPag:Number,
    añoEdic:Number,
    precio:Number,
    stock:Boolean
})

const vendidosSchema = new Schema({
	isbn:Number,
	idioma:String,
	copias:Number,
	ventaCop:Number,
	fRealizacion:Date
})

export const Libros = model('libros', librosSchema)
export const Vendidos = model('vendidos', vendidosSchema)