# 💸 Billetera Virtual — Proyecto Final UTN

Este proyecto es una **billetera virtual** desarrollada como trabajo final para la Universidad Tecnológica Nacional. Permite a los usuarios registrarse, iniciar sesión, y gestionar balances en distintas monedas.

## 🧱 Tecnologías Usadas

### 🖥️ Frontend
- **React** con **TypeScript**
- **React Router DOM** para rutas
- Estilos con **Tailwind CSS**

### 🛠️ Backend
- **Node.js** con **Express**
- **Sequelize** como ORM
- **PostgreSQL** como base de datos (antes SQLite)

### 🔐 Seguridad
- **JWT (JSON Web Tokens)** para autenticación segura
- **bcrypt** para hash de contraseñas

## 🚀 Funcionalidades

- Registro de usuario
- Inicio de sesión con JWT
- Visualización y edición de perfil
- Gestión de balance en múltiples monedas: ARS, USD, EUR, BTC, ETH, USDT
- Carga de saldo en moneda seleccionada
- Historial de movimientos
- Conversión entre monedas con tasas en tiempo real
- Transferencias entre usuarios
- Dashboard con métricas (en proceso)

## 📂 Estructura del Proyecto

```
proyecto/
├── Client/ # Frontend (React)
│ ├── src/
│ │ ├── App.tsx
│ │ ├── index.tsx
│ │ ├── components/
│ │ │ ├── Landing.tsx
│ │ │ ├── Home.tsx
│ │ │ ├── Login.tsx
│ │ │ ├── History.tsx
│ │ │ ├── Profile.tsx
│ │ │ ├── Navbar.tsx
│ │ │ ├── Register.tsx
│ │ │ └── LoadBalance.tsx
│ └── ...
│
└── Server/ # Backend (Node.js + Express)
├── src/
│ ├── Controllers/
│ ├── Models/
│ ├── Routes/
│ ├── db.ts
│ └── index.ts
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

   Por defecto corre en: [https://proyectofinalutn-production.up.railway.app](https://proyectofinalutn-production.up.railway.app)

> **Nota:** Se puede correr en local pero necesitas crear tu propia base de datos para que funcione. Recomiendo PosgresSQL con PGAdmin 4. 

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
   npm start
   ```

   Por defecto corre en: [http://localhost:3000](http://localhost:3000). Sin el backend corriendo no vas a poder pasar del Landing/Register/Login.

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
  isconfirmed?: boolean,
  admin: boolean,
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

| Método | Ruta           | Descripción                        |
| ------ | -------------- | ---------------------------------- |
| POST   | /auth/register | Crear nuevo usuario                |
| POST   | /auth/login    | Iniciar sesión y obtener token JWT |
| GET    | /auth/profile  | Obtener perfil del usuario         |
| PUT    | /auth/update   | Editar datos del perfil            |
| POST   | /auth/balance  | Cargar saldo en moneda específica  |
| GET    | /auth/history  | Ver historial de transacciones     |
| POST   | /auth/transfer | Transferir a otro usuario          |
| POST   | /auth/exchange | Convertir entre monedas            |


## 🧪 Estado Actual del Proyecto

- [x] Backend funcional con Sequelize y SQLite.
- [x] Autenticación JWT implementada.
- [ ] CRUD básico de usuario.
- [x] Sistema de carga de saldo por moneda.
- [x] Frontend básico con rutas: `Landing`, `Login`, `Register`, `Home`, `LoadBalance`.
- [x] Conexión entre frontend y backend vía fetch/axios.
- [ ] Cambio de divisas a tiempo real con el mercado.
- [ ] Actualización de datos del usuario en su propio perfil.
- [ ] Dashboard Admin.
- [ ] Conexión entre frontend y backend vía fetch/axios.
- [ ] Modularización del frontend.
- [ ] Transferencia de divisas entre usuarios.
- [ ] Métricas de la aplicación.
- [ ] Diseño profesional y minimalista.
- [ ] Alertas para guiar al usuario.


## 🧑‍🎓 Autor

Proyecto desarrollado por:

• Franco de Iriondo

• Jonas Mendelovich

• Mateo Zeballos

• Gaston Nuñez

🎓 Estudiantes de la Universidad Tecnológica Nacional — 2025.
