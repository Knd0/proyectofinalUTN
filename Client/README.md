# Creación de una Aplicación en React con TypeScript

## 1. Configuración del Proyecto

Para comenzar con React y TypeScript, seguimos estos pasos:

1. **Crear la carpeta del proyecto y generar la aplicación**
   ```bash
   npx create-react-app my-app --template typescript
   ```
   Esto crea una aplicación React preconfigurada con TypeScript.

2. **Iniciar la aplicación**
   ```bash
   npm start
   ```
   Esto inicia un servidor de desarrollo que permite ver la aplicación en el navegador.

---

## 2. Primer Componente en React

Dentro del archivo `App.tsx`, dejamos el siguiente código:

```typescript
// App.tsx
import './App.css';

function App() {
  return (
    <div className="App">
    </div>
  );
}

export default App;
```

### Concepto de Componente

Un **componente** en React es similar a una función de JavaScript. Acepta entradas (llamadas `props`) y retorna elementos de React que describen la interfaz gráfica.

### Creación de un Componente Simple

Creamos un nuevo archivo `Persona.tsx` dentro de la carpeta `src` con el siguiente código:

```typescript
export const Persona = () => {
    return (<div>Hola Mundo</div>);
}
```

Luego, modificamos `App.tsx` para incluir el nuevo componente:

```typescript
import './App.css';
import { Persona } from './Persona';

function App() {
  return (
    <div className='App'>
      <Persona />
    </div>
  );
}

export default App;
```

---

## 3. Pasando Parámetros con Props

Para personalizar el componente `Persona`, podemos pasarle **props**.

### Modificamos `App.tsx`:

```typescript
<div className='App'><Persona nombre={"Juan"}/></div>
```

### Modificamos `Persona.tsx`:

```typescript
export const Persona = (props: any) => {
    return (
    <div>
        <p>Hola Mundo {props.nombre}</p>
    </div> );
}
```

También podemos agregar múltiples componentes con diferentes valores de `props`:

```typescript
function App() {
  return (
    <div className='App'>
      <Persona nombre={"Juan"}/>
      <Persona nombre={"Pedro"}/>
    </div>
  );
}
```

---

## 4. Uso de Interfaces en TypeScript

Las **interfaces** permiten definir la estructura de los objetos en TypeScript, lo que ayuda a evitar errores de tipo.

### Modificamos `Persona.tsx` para definir una interfaz:

```typescript
export interface iPersona {
    nombre: string;
    edad: number | null;
}

export const Persona = (props: iPersona) => {
    return (
        <p>Hola Mundo {props.nombre} de {props.edad} años</p>
    );
}
```

Ahora `Persona` espera recibir un nombre y una edad.

---

## 5. Uso del Hook `useState`

`useState` permite manejar estados en los componentes funcionales.

### Modificamos `Persona.tsx` para incluir un botón que muestre u oculte el texto:

```typescript
import { useState } from "react";

interface iPersona {
    nombre: string;
    edad: number | null;
}

export const Persona = (props: iPersona) => {
    const [visible, setVisible] = useState<boolean>(true);

    function toggleVisible() {
        setVisible(!visible);
    }

    return (
        <div>
            <p hidden={!visible}>Hola Mundo {props.nombre} de {props.edad} años</p>
            <button onClick={toggleVisible}>{visible ? "Ocultar" : "Mostrar"}</button>
        </div>
    );
}
```

Este código permite alternar la visibilidad del texto con un botón.

---

Aquí tienes tres ejercicios prácticos para reforzar lo aprendido sobre React con TypeScript:  

### **Ejercicio 1: Agregar un Nuevo Prop al Componente Persona**  
**Objetivo:**  
- Ampliar el componente `Persona` para aceptar un nuevo `prop` llamado `ocupacion`.  
- Mostrarlo en pantalla junto con el `nombre` y la `edad`.  

**Instrucciones:**  
1. Modifica la **interfaz `iPersona`** en `Persona.tsx` para incluir `ocupacion` como un `string`.  
2. Asegúrate de que el componente muestre el nombre, la edad y la ocupación correctamente.  
3. En `App.tsx`, usa el componente `Persona` para mostrar diferentes personas con su respectiva ocupación.  

---

### **Ejercicio 2: Agregar un Contador de Edad**  
**Objetivo:**  
- Implementar un botón en `Persona.tsx` que aumente la edad de la persona al hacer clic.  

**Instrucciones:**  
1. Usa el hook `useState` para manejar la edad dentro del componente.  
2. Agrega un botón con el texto **"Cumplir años"**.  
3. Cada vez que el botón sea presionado, la edad debe incrementarse en 1.  

---

### **Ejercicio 3: Lista de Personas Dinámica**  
**Objetivo:**  
- Crear una lista de objetos `Persona` y renderizarla dinámicamente.  

**Instrucciones:**  
1. En `App.tsx`, crea un **array** de personas con `nombre`, `edad` y `ocupacion`.  
2. Usa la función `map()` para recorrer la lista y renderizar múltiples componentes `Persona`.  
3. Asegúrate de que cada persona tenga un `key` único en el renderizado.  

---





- Aprendimos a crear una aplicación en React con TypeScript.
- Vimos cómo funcionan los **componentes** y el **paso de props**.
- Implementamos **interfaces** para tipar las propiedades.
- Usamos el **hook useState** para manejar estado dentro del componente.

