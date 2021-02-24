import {Request, Response, Router } from 'express'
import { Libros, Vendidos } from '../model/esquemas'
import { db } from '../database/database'

class Routes {
    private _router: Router

    constructor() {
        this._router = Router()
    }
    get router(){
        return this._router
    }

    private getLibros = async (req:Request, res: Response) => {
        await db.conectarBD()
        .then( async ()=> {
            const query = await Libros.aggregate([
                {
                     $lookup:
                        {
                             from: "vendidos",
                             localField: "isbn",
                             foreignField: "isbn",
                             as: "copias"
                         }
                }
            ])
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }

    private getVendidos = async (req: Request, res: Response) => {
        await db.conectarBD()
        .then( async (mensaje) => {
            const query = await Vendidos.find()
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })

        await db.desconectarBD()
    }

   private deleteVendidos = async (req: Request, res: Response) => {
        const { isbn, idioma } = req.params
        await db.conectarBD()
        await Vendidos.findOneAndDelete(
            { isbn: isbn,
              idioma: idioma},
              (err: any, doc) => {
                if(err){
                    console.log(err)
                }else{
                    if(doc == null){
                        console.log('No existe el documento')
                        res.send('No existe el documento')
                    }else{
                        console.log(doc)
                        res.send('El documento ha sido borrado'+ doc)
                    }
                }
            })
        db.desconectarBD()
    }

    private modificar = async (req: Request, res: Response) => {
        const {id} =req.params
        const {  isbn, titulo, autor, genero, editorial, numPag, añoEdic, precio, stock } = req.body
        await db.conectarBD()
        await Libros.findOneAndUpdate({
            isbn: isbn
        },{
            isbn:isbn,
            titulo:titulo,
            autor:autor,
            genero:genero,
            editorial:editorial,
            numPag:numPag,
            añoEdic:añoEdic,
            precio:precio,
            stock:stock
        },{
            new:true,
            runValidators:true
        }
        )
            .then( (doc) => res.send(doc))
            .catch( (err: any) => res.send('Error: '+ err)) 
        await db.desconectarBD()
    }

    private nuevoLibro = async (req: Request, res: Response) => {
        const {isbn, titulo, autor, genero, editorial, numPag, añoEdic, precio, stock} = req.body
        const schema = {
            isbn:parseInt(isbn),
            titulo:titulo,
            autor:autor,
            genero:genero,
            editorial:editorial,
            numPag:parseInt(numPag),
            añoEdic:parseInt(añoEdic),
            precio:parseInt(precio),
            stock:stock
        }
        const nSchema = new Libros(schema)
        await db.conectarBD()
        await nSchema.save()
        .then((doc) => {
            console.log(doc)
            res.json(doc)
        })
        .catch((err: any) => {
            console.log(err)
            res.json(err)
        })    
        await db.desconectarBD()
    }

    
  
    Rutas(){
        this._router.get('/libros', this.getLibros),
        this._router.get('/copias', this.getVendidos),
        this._router.get('/deleteVendidos/:isbn&:idioma', this.deleteVendidos),
        this._router.post('/libros/:isbn', this.modificar)
        this._router.post('/nuevo', this.nuevoLibro)
        
    }
}

const obj = new Routes()
obj.Rutas()
export const routes = obj.router