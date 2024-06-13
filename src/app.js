const express = require ('express');
const morgan = require ('morgan');
const cors = require('cors');

const { Sequelize } = require('sequelize');

// Inicialización de servicio web
const app = express();
const port = 3000;

// Middlewares
app.use(cors());
app.use(morgan());
app.use(express.json());

// Conexión con la Base de Datos
const sequelize = new Sequelize(
    'productocrud',
    'root',
    '',{
        host: 'localhost',
        dialect: 'mysql'
    }
);

(async()=>{
    try{
        await sequelize.authenticate();
        console.log('Conexión a la BD establecida correctamente');
    } catch (error){
        console.log('Error al conectar a la BD',error)
    }
});


const { DataTypes } = require('sequelize');

// Definimos la estructura para el modelo de 'PRODUCTO'
const Producto = sequelize.define('producto', {
    idProducto: {
        type: DataTypes.INTEGER (10),
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING (10),
        allowNull: false
    },
    categoria: {
        type: DataTypes.STRING (20),
        allowNull: false
    },
    cantidad: {
        type: DataTypes.INTEGER (8),
        allowNull: false
    },
    precio: {
        type: DataTypes.NUMBER (10),
        allowNull: false
    }
},
{
    tableName: 'producto',
}
);

// Colección local para verificar funcionalidad
const listaProducto = [
    {
        idProducto: 2,
        nombre: "Jabon",
        categoria: "higiene",
        cantidad: 2,
        precio: 500
    },
    {
        idProducto: 3,
        nombre: "Maceta",
        categoria: "Decohogar",
        cantidad: 1,
        precio: 1600
    }
];

// Definimos la ruta de origen
app.get('/', (req, res) => {

    res.status(200).json({
        ok: true,
        msg: 'Se logró el acceso a la API'
    })
});

// Método para enlistar todos los productos de la colección
app.get('/producto', (req, res) => {

    res.json({
        ok: true,
        listaProducto
    })
});

// Método para buscar un producto por ID
app.get('/producto/find/idProducto', (req, res) => {
    const { query } = req;
    const { idProducto } = query;

    const resultado = listaProducto.find((productoBuscado) => {
        return productoBuscado.idProducto == idProducto;
    });

    if (resultado) {
        res.status(200).json({
            ok: true,
            resultado,
            msg: `Producto: ${idProducto} encontrado`
        })
    } else {
        res.status(404).json({
            ok: false,
            msg: 'Producto no encontrado :('
        })
    }
});

// Crear producto
app.post('/producto/create', (req, res) => {
    const { nombre, categoria, cantidad, precio } = req.body;

    const nuevoProducto = { nombre, categoria, cantidad, precio };

    listaProducto.push(nuevoProducto);

    if(nuevoProducto){
        res.status(201).json({
            ok: true,
            nuevoProducto,
            msg: `¡Producto ${nombre} agregado con éxito! :)`,
        })
    } else {
        res.status(404).json({
            ok: false,
            msg: 'No se pudo agregar el producto :('
        })
    }
});

// Editar producto
app.put('/producto/edit/', (req, res) => {
    const idProducto = req.query.idProducto;
    const productoActualizado = req.body;

    const posProducto = listaProducto.indexOf((productoActualizado) => productoActualizado.idProducto == idProducto);

    listaProducto[posProducto] = {... listaProducto[posProducto], ... productoActualizado}

    if (posProducto < 0) res.status(404).json({
        ok: false,
        msg: `No existe el producto número: ${idProducto}`
    })
    else{
        res.status(202).json({
            ok: true,
            productoActualizado: listaProducto[posProducto]
        })
    }
});

// Eliminar producto
app.delete('/producto/delete', (req, res) => {
    const { query } = req;
    const { idProducto } = query;

    const posProducto = listaProducto.indexOf((productoEliminado) => productoEliminado.idProducto == idProducto);

    res.status(203).json({
        ok: true,
        productoEliminado: listaProducto[posProducto],
        msg: `¡Producto: ${idProducto} eliminado con éxito!`
    })
});

// Ordenar productos
app.get('/producto/ordenados', (req, res) => {
    const { query } = req;
    const { listaProducto } = query;

    // const orderProducto = listaProducto.sort();

    const resultado = listaProducto.find((productoOrdenado) => {
        return productoOrdenado.nombre
    });

    res.status(204).json({
        ok: true,
        orderProducto: orderProducto
    })
});

app.get('/producto/filtrados', (req, res) => {
    const { query } = req;
    const { listaProducto } = query;

    const productoFiltro = listaProducto.length[productoFiltro];

    for(i = 0; i < listaProducto.length; i++){
        if(productoFiltro.precio > listaProducto[i]){
            res.status(205).json({
                ok: true,
                msg: `${productoFiltro.nombre} es menor a ${listaProducto[i]}`
            })
        }
    }
})

// Escuchamos en el puerto 3000
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});