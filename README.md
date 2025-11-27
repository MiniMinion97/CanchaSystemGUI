# CanchaSystemGUI
Esta es la interfaz para CAncha systema una SPA (single page application) que busca brindar un servicio para facilitar reservas y señados de canchas de fútbol, con el uso de un sistema virtual y seguro dirigido a distintos dueños y sus clientes. De esta manera y con la conexión digital entre múltiples establecimientos de fútbol en un mismo sitio, se promueve la competitividad sana entre distintos dueños, mejorando en consecuencia la calidad del servicio brindado.

# Funcionalidades clave
```txt
-Gestión de usuarios con autenticación y perfiles propios.
-Página explorar para ver todos los establecimientos y aplicar filtros personalizados
-Gestión de reservas
-Gestión de reseñas
-Gestión de todas las entidades como administrador
```

# Estructura del proyecto
```txt
src/
├── app/
│   ├── AdminComponents/
│   ├── auth/
│   │   ├── login/
│   │   ├── register/
│   │   ├── services/
│   ├── canchas/
│   │   ├── models/
│   │   ├── pages/
│   │   ├── services/
│   ├── core/
│   │   ├── guards/
│   ├── layout/
│   │   ├── auth-tab/
│   │   ├── footer/
│   │   ├── header/
│   │   ├── star-rating/
│   ├── profile/
│   │   ├── admin/
│   │   ├── client/
│   │   ├── my-data/
│   │   ├── owner/
│   │   ├── view/
│   ├── reservation/
│   │   ├── models/
│   │   ├── pages/
│   │   ├── services/
│   ├── reviews/
│   │   ├── form/
│   │   ├── models/
│   │   ├── review-item/
│   │   ├── review-list/
│   │   ├── services/
│   ├── app.config.ts
│   ├── app.css
│   ├── app.routes.ts
│   ├── app.spec.ts
│   ├── app.ts
├── index.html
├── main.ts
└── styles.css
```

# Flujo de uso (Cliente)
```txt
1. Registro
   └── El cliente completa el formulario de registro
       └── Se crea su cuenta y queda habilitado para entrar

2. Inicio de Sesión
   └── El cliente ingresa con nombre de usuario y contraseña
       └── Accede a la pantalla "Explorar"

3. Crear una reserva
   └── Explorar → + "Ver más" de X establecimiento
       ├── Selecciona tipo de cancha
       ├── Selecciona día
       ├── Selecciona horario disponible
       └── Hace click en "Hacer reserva"
           └── Se muestra la nueva reserva en Mi perfil  → + Mis reservas    

4. Crear una reseña
  └── Explorar → + "Ver más" de X establecimiento
       ├── Selecciona valoración
       ├── Escribe un mensaje (opcional)
       └── Hace click en "Hacer reseña"
           └── Se muestra la nueva reserva en Mi perfil  → + Mis reseñas
```

# Flujo de uso (Dueño)
```txt
1. Inicio de Sesión
   └── El dueño ingresa con nombre de usuario y contraseña (Las credenciales serán proporcionadas por nosotros luego de que se contacten y cumplan con las validaciones)

2. Crear una marca
   └── Mi perfil → + Mis marcas → + Crear Marca
       ├── Completa el formulario de manera acorde
           └── Se muestra la nueva marca en Mi perfil  → + Mis marcas    

3. Crear un establecimiento/sucursal
   └── Mi perfil → + Mis marcas → + Tu marca → + Crear Establecimiento
       ├── Completa el formulario de manera acorde
           └── Se muestra el neuvo establecimiento en Mi perfil  → + Mis establecimientos

4. Crear un cancha
  └── Mi perfil → + Mis establecimientos → + Tu establecimiento → + Crear cancha
       ├── Completa el formulario de manera acorde
           └── Se muestra la nueva cancha en Mi perfil  → + Mis canchas
```

# Instalación
Este proyecto requiere el backend de CanchaSystem para funcionar

# Tech Stack

    Angular 20
    TypeScript
    RxJS
    Angular Signals / Stores
    HTML + CSS
    REST API integration con HttpClient

# Equipo
```txt
Federico de la Fuente
Ian Huth
Facundo Baldezari
Lautaro Lorenzani
```

# Licencia
Este proyecto es de código abierto y fue desarrollado como parte de la materia Programación IV de la Universidad Tecnológica Nacional – Facultad Regional Mar del Plata (UTN-FRMDP).
