# Componentes Computadoras (quasar-project)

Frontend en Quasar + Vue 3 + TypeScript + Pinia + Axios que consume la API `ComponentesComputadoras.WebApi`.
Sigue la misma estructura que el proyecto de ejemplo de la cátedra (EDI3 FrontEnd).

## Estructura

```
src/
├── boot/axios.ts          # instancia de axios + interceptores (token JWT, 401)
├── components/<Entidad>/  # formulario de alta de cada entidad (<Entidad>Create.vue)
├── layouts/MainLayout.vue
├── models/<Entidad>/      # DTOs de la API (<Entidad>RequestDto / <Entidad>ResponseDto)
├── pages/<Entidad>/       # grilla (q-table) de cada entidad
├── router/                # rutas y guard de sesión
├── stores/                # un store de Pinia por entidad (llaman a la API con axios)
└── utils/                 # notificar, formato, errores
```

## Cómo levantarlo

1. **API** (`ComponentesComputadora.sln`): ejecutá el perfil **https** (queda en `https://localhost:7136`).
2. **Frontend** (Windows: doble clic en `iniciar.bat`, que verifica Node.js, instala las dependencias la primera vez y levanta el servidor). A mano:
   ```bash
   npm install
   npm run dev
   ```
   Se abre en `http://localhost:9000`.
3. Ingresá con el usuario que crea la API al iniciar: **admin@email.com / Admin123!**

> `iniciar.bat` detecta solo si la API está en `https://localhost:7136` o `http://localhost:5106`. Quasar no levanta la API: tiene que estar corriendo antes (Visual Studio, perfil https).

> Si levantás la API en otro puerto, cambiá `API_URL` al principio de `quasar.config.ts`
> (o definí la variable de entorno `API_URL`). El devServer reenvía `/api` a esa URL, por eso
> no hay problemas de CORS ni de certificado en desarrollo.

## Install the dependencies
```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```

### Lint the files
```bash
yarn lint
# or
npm run lint
```

### Format the files
```bash
yarn format
# or
npm run format
```

### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).
