const mongoose = require('mongoose');

// Objeto para guardar conexiones activas
const connections = {};

// Función para obtener o crear una conexión a una base de datos específica
const getDatabaseConnection = async (tenantId) => {
  if (connections[tenantId]) {
    // Si ya existe la conexión, la reutilizamos
    return connections[tenantId];
  }

  // Si no existe, creamos una nueva conexión
  const uri = `mongodb://localhost:27017/${tenantId}`;
  const connection = await mongoose.createConnection(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Guardamos la conexión en el objeto
  connections[tenantId] = connection;
  return connection;
};

module.exports = getDatabaseConnection;
