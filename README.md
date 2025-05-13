# 💸 Billetera Virtual — Proyecto Final UTN

Este proyecto es una **billetera virtual** desarrollada como trabajo final para la Universidad Tecnológica Nacional. Permite a los usuarios registrarse, iniciar sesión, y gestionar balances en distintas monedas.

## 🧱 Tecnologías Usadas

### 🖥️ Frontend
- **React** con **TypeScript**
- **React Router DOM** para rutas
- Estilos con CSS y framework a elección

### 🛠️ Backend
- **Node.js** con **Express**
- **Sequelize** como ORM
- **SQLite** como base de datos

### 🔐 Seguridad
- **JWT (JSON Web Tokens)** para autenticación segura
- **bcrypt** para hash de contraseñas

## 🚀 Funcionalidades

- Registro de usuario
- Inicio de sesión con JWT
- Visualización de perfil
- Gestión de balance en múltiples monedas: ARS, USD, EUR, BTC, ETH, USDT
- Carga de saldo en moneda seleccionada

## 📂 Estructura del Proyecto

```
proyecto/
├── Client/                 # Frontend (React)
│   ├── src/
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   ├── components/
│   │   │      │ 
│   │   │      ├── Landing.tsx
│   │   │      ├── Home.tsx
│   │   │      ├── Login.tsx
│   │   │      ├── History.tsx
│   │   │      ├── Profile.tsx
│   │   │      ├── Navbar.tsx
│   │   │      ├── Register.tsx
│   │   │      └── LoadBalance.tsx
│   │   └── ...
│
└── Server/                # Backend (Node.js + Express)
    ├── src/
    │   ├── Controllers/
    │   │   └── authController.ts
    │   ├── Models/
    │   │   └── Usuario.ts
    │   ├── Routes/
    │   │   └── authRoutes.ts
    │   ├── db.ts
    │   └── index.ts
```

## ⚙️ Cómo correr el proyecto

### 🔧 Backend

1. Navegá al directorio del servidor:

   ```bash
   cd Server
   ```

2. Instalá las dependencias:

   ```bash
   npm install
   ```

3. Ejecutá el servidor:

   ```bash
   npm run dev
   ```

   Por defecto corre en: [http://localhost:5000](http://localhost:5000)

> **Nota:** el servidor genera la base de datos SQLite automáticamente en `Server/database.sqlite` si no existe.

### 💻 Frontend

1. Navegá al directorio del cliente:

   ```bash
   cd Client
   ```

2. Instalá las dependencias:

   ```bash
   npm install
   ```

3. Ejecutá la aplicación:

   ```bash
   npm run dev
   ```

   Por defecto corre en: [http://localhost:3000](http://localhost:3000)

## 🔐 Autenticación con JWT

Este proyecto utiliza **JWT** para proteger rutas privadas. Cuando el usuario inicia sesión correctamente, se le genera un token que debe incluir en el header de futuras peticiones autenticadas:

```http
Authorization: Bearer <token>
```

## 🛠️ Modelos de Datos

### Usuario (`Usuario.ts`)

```ts
{
  id: number,
  nombre: string,
  email: string,
  password: string,
  cvu: string,
  imagen?: string,
  descripcion?: string,
  nacionalidad?: string,
  dni?: string,
  COD: {
    ARS: number,
    USD: number,
    EUR: number,
    BTC: number,
    ETH: number,
    USDT: number
  }
}
```

## 📥 Rutas del Backend (Resumen)

| Método | Ruta               | Descripción                         |
|--------|--------------------|-------------------------------------|
| POST   | /auth/register     | Crear nuevo usuario                 |
| POST   | /auth/login        | Iniciar sesión y obtener token JWT |
| GET    | /auth/profile      | Obtener perfil del usuario         |
| POST   | /auth/balance      | Cargar saldo en moneda específica  |

## 🧪 Estado Actual del Proyecto

- [x] Backend funcional con Sequelize y SQLite
- [x] Autenticación JWT implementada
- [ ] CRUD básico de usuario
- [x] Sistema de carga de saldo por moneda
- [x] Frontend básico con rutas: `Landing`, `Login`, `Register`, `Home`, `LoadBalance`
- [x] Conexión entre frontend y backend vía fetch/axios
- [ ] Cambio de divisas a tiempo real con el mercado
- [ ] Actualización de datos del usuario en su propio perfil
- [ ] Dashboard Admin
- [ ] Conexión entre frontend y backend vía fetch/axios
- [ ] Modularización del frontend
- [ ] Transferencia de divisas entre usuarios
- [ ] Métricas de la aplicación
- [ ] Diseño profesional y minimalista
- [ ] Alertas para guiar al usuario


## 🧑‍🎓 Autor

Proyecto realizado por Jonas Mendelovich, Mateo Zeballos, Franco de Iriondo y Gaston Nuñez, estudiantes de la UTN.
