const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "API de Movimientos Bancarios",
      version: "1.0.0",
      description: "API para consultar movimientos de cuentas y tarjetas",
    },
    servers: [
      {
        url: "https://openapi-09h0.onrender.com", 
        description: "Servidor Produccion",
      },
    ],
  },
  apis: ["./src/controllers/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec,
};
