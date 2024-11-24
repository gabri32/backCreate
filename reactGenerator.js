const { exec } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

const generateReactProject = async (tenantId, dbUri) => {
  try {
    const reactAppName = `react-app-${tenantId}`;
    const reactAppPath = path.join(__dirname, 'react-projects', reactAppName);

    // Crear directorio para los proyectos si no existe
    if (!fs.existsSync(path.join(__dirname, 'react-projects'))) {
      fs.mkdirSync(path.join(__dirname, 'react-projects'));
    }

    console.log(`Generando proyecto React para el tenantId: ${tenantId}...`);

    // Comando para crear un nuevo proyecto React
    await executeCommand(`npx create-react-app ${reactAppName}`, path.join(__dirname, 'react-projects'));

    console.log(`Proyecto React creado en: ${reactAppPath}`);

    // Configurar variables de entorno
    const envFilePath = path.join(reactAppPath, '.env');
    const envContent = `REACT_APP_DATABASE_URI=${dbUri}\n`;
    await fs.writeFile(envFilePath, envContent);

    console.log(`Archivo .env creado para conectar con la base de datos: ${dbUri}`);

    // Generar build del proyecto React
    console.log('Generando build del proyecto React...');
    await executeCommand('npm run build', reactAppPath);

    console.log(`Build generado para ${reactAppName} en: ${path.join(reactAppPath, 'build')}`);

    return {
      message: `Proyecto React para ${tenantId} creado y build generado.`,
      buildPath: path.join(reactAppPath, 'build'),
    };
  } catch (error) {
    console.error('Error al generar el proyecto React:', error);
    throw error;
  }
};

// Función para ejecutar comandos de sistema
const executeCommand = (command, workingDir) => {
  return new Promise((resolve, reject) => {
    exec(command, { cwd: workingDir }, (error, stdout, stderr) => {
      if (error) {
        console.error(stderr);
        return reject(error);
      }
      console.log(stdout);
      resolve(stdout);
    });
  });
};

module.exports = generateReactProject;
