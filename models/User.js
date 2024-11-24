const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

// Exportamos una función para crear el modelo en cualquier conexión
module.exports = (connection) => connection.model('User', UserSchema);
