const validateHeaders = (requiredHeaders) => {
  return (req, res, next) => {
    const missingHeaders = [];
    
    requiredHeaders.forEach(header => {
      console.log(header);
      const formattedHeader = header.toLowerCase();
      console.log(formattedHeader);

      if (!req.headers[formattedHeader]) {
        missingHeaders.push(header);
      }
    });

    if (missingHeaders.length > 0) {
      return res.status(400).json({
        codigo: "400",
        mensaje: "Headers requeridos faltantes",
        detalles: `Faltan los siguientes headers: ${missingHeaders.join(", ")}`,
        timestamp: new Date().toISOString()
      });
    }

    next();
  };
};

module.exports = {
  validateHeaders
};