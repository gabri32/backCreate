const express = require('express');
const getDatabaseConnection = require('./database');
const createUserModel = require('./models/User');
const generateReactProject = require('./reactGenerator');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Ruta para registrar usuarios
app.post('/register', async (req, res) => {
  const { name, email, tenantId } = req.body;

  if (!tenantId) {
    return res.status(400).json({ message: 'Se requiere tenantId para crear una base de datos.' });
  }

  try {
    // 1. Registrar usuario en MongoDB
    const connection = await getDatabaseConnection(tenantId);
    const User = createUserModel(connection);
    const newUser = await User.create({ name, email });

    // 2. Crear un proyecto React para este usuario
    const dbUri = `mongodb://localhost:27017/${tenantId}`;
    const reactResult = await generateReactProject(tenantId, dbUri);

    res.status(201).json({
      message: 'Usuario registrado y proyecto React generado exitosamente.',
      user: newUser,
      reactProject: reactResult,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error al registrar usuario y generar proyecto React', error });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
