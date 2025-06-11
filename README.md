# 📦 API de Movimientos Bancarios

Esta API permite consultar movimientos y detalles de cuentas de ahorro, corriente y tarjetas. Fue construida con Node.js y documentada con Swagger.

## 🚀 URL Pública

La API está desplegada en Render y disponible en:

🔗 **Base URL**:  
`https://openapi-09h0.onrender.com`

🔍 **Documentación Swagger**:  
`https://openapi-09h0.onrender.com/swagger`

## 📌 Endpoints Principales

### Obtener movimientos

| Método | Endpoint                             | Descripción                               |
|--------|--------------------------------------|-------------------------------------------|
| GET    | `/api/movimientos/ahorro`            | Movimientos de cuenta de ahorro           |
| GET    | `/api/movimientos/corriente`         | Movimientos de cuenta corriente           |
| GET    | `/api/movimientos/tarjetas`          | Movimientos de tarjeta de crédito         |

### Obtener detalle de movimiento

| Método | Endpoint                                   | Descripción                                        |
|--------|--------------------------------------------|----------------------------------------------------|
| GET    | `/api/movimientos/ahorro/detalle`          | Detalle de movimiento de cuenta de ahorro         |
| GET    | `/api/movimientos/corriente/detalle`       | Detalle de movimiento de cuenta corriente         |
| GET    | `/api/movimientos/tarjetas/detalle`        | Detalle de movimiento de tarjeta de crédito       |

---