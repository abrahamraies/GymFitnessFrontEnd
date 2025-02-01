# Gym & Fitness Guide - Frontend

## 📌 Descripción
Este es el frontend del proyecto **Gym & Fitness Guide**, desarrollado en **React 19** con TypeScript. La aplicación permite a los usuarios realizar un test para conocer su mejor categoría de entrenamiento y obtener recomendaciones personalizadas.

## 🚀 Tecnologías utilizadas
- ⚛ **React 19** (Vite + TypeScript)
- 🌍 **react-i18next** (Internacionalización en inglés y español)
- 🌗 **Modo oscuro** (Alternancia entre temas claro y oscuro)
- 🔗 **React Router** (Manejo de rutas y navegación)
- 🔥 **Axios** (Conexión con el backend)

## 📂 Estructura del proyecto
```
frontend/
│── src/
│   ├── api/                # Peticiones a la API
│   ├── components/         # Componentes reutilizables
│   │   ├── layouts/        # Diseños base (navbar, footer)
│   ├── i18n/               # Configuracion de idiomas
│   ├── interfaces/         # Configuracion de interfaces
│   ├── pages/              # Páginas principales
│   ├── routes/             # Configuración de rutas
│   ├── utils/              # Utilidades para toda la app.
│   │   ├── Context/        # Contexto global (Theme)
│   ├── App.tsx             # Componente principal
│   ├── App.css             # Estilos globales de la aplicación
│   ├── main.tsx            # Punto de entrada principal de la aplicación
│   ├── index.css           # Estilos base y globales
│── public/                 # Archivos estáticos
│── package.json            # Dependencias y scripts
│── vite.config.ts          # Configuración de Vite
```

## 🔧 Instalación y configuración
### 1️⃣ Clonar el repositorio
```sh
git clone https://github.com/abrahamraies/GymFitnessFrontEnd.git
cd GymFitnessFrontEnd/gymfitnessfrontend
```

### 2️⃣ Instalar dependencias
```sh
yarn install
# o
npm install
```

### 3️⃣ Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto con la URL del backend:
```
VITE_API_URL=http://localhost:5000/api
```

### 4️⃣ Ejecutar el proyecto
```sh
yarn dev
# o
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## 📌 Funcionalidades principales
✅ Test interactivo con 10 preguntas para definir la categoría de entrenamiento.
✅ Posibilidad de ver categorías y recomendaciones sin realizar el test.
✅ Modo oscuro y accesibilidad mejorada.
✅ Persistencia de datos del usuario en **LocalStorage**.
✅ Cambio de idioma entre **inglés y español**.
✅ Navegación fluida con React Router.

## 📄 Licencia
Este proyecto está bajo la licencia **MIT**. ¡Siéntete libre de contribuir! 🎉
