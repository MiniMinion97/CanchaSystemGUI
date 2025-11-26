# CanchaSystem

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.5.

src/
├── app/
│   ├── AdminComponents/              # Gestión de Actividades
│   ├── auth/               # Layout principal (header, contenedor, nav)
│   │   ├──login/
│   │   ├──register/
│   │   ├──services/
│   ├── canchas/               # Gestión de Checklists personalizadas
│   │   ├──models/
│   │   ├──pages/
│   │   ├──services/
│   ├── core/               # Gestión de empresas
│   │   ├──guards/
│   ├── layout/                # Gestión de gastos + métricas
│   │   ├──auth-tab/
│   │   ├──footer/
│   │   ├──header/
│   │   ├──star-rating/
│   ├── profile/                  # Footer
│   │   ├──admin/
│   │   ├──client/
│   │   ├──my-data/
│   │   ├──owner/
│   │   ├──view/
│   ├── reservation/                  # Rutas protegidas (auth, guest)
│   ├── reviews/                 # Helpers de paginación y navegación HATEOAS
│   ├── header/                  # Header + menú de usuario
│   ├── home/                    # Página de inicio
│   ├── itineraries/             # Gestión de itinerarios
│   ├── not-found/               # Página 404
│   ├── reservations/            # Gestión de Reservas de actividades (flows y UI)
│   ├── security/                # Login, registro, sesión y stores de usuario
│   ├── trips/                   # Gestión de viajes (CRUD + detalle)
│   ├── users/                   # Perfil del usuario
│   ├── app.config.ts            # Configuración global de Angular
│   ├── app.css                  # Estilos globales del app component
│   ├── app.routes.ts            # Rutas principales de la aplicación
│   ├── app.spec.ts              # Tests base del componente raíz
│   ├── app.ts                   # Componente raíz
│   ├── BaseService.ts           # Servicio base para peticiones HTTP
│   └── BaseStore.ts             # Clase base para stores con señales
├── index.html                   # HTML principal
├── main.ts                      # Punto de entrada de Angular
└── styles.css                   # Estilos globales y variables CSS
