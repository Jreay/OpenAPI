const express = require('express');
const app = express();

app.use(express.json());

const { swaggerUi, swaggerSpec } = require('./swagger');
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/movimientos', require('./controllers/movimientosController'));
app.use('/api/movimientos', require('./controllers/detallesController'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    codigo: "500",
    mensaje: "Error interno del servidor",
    detalles: err.message
  });
});

module.exports = app;