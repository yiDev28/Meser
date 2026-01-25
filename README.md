# meser

Aplicación de escritorio (Electron + Vite + React + TypeScript) para la gestión de pedidos, facturación y operaciones en restaurantes con soporte offline.

---

## Resumen

Este repositorio contiene la aplicación "meser" dividida en dos procesos principales:

- Proceso principal (Electron): `src/main/` — inicialización de la aplicación, IPC, base de datos local y servicios.
- Renderer (UI): `src/renderer/` — aplicación React + Vite que contiene componentes, layouts, rutas y contextos.

También hay archivos de configuración (por ejemplo `vite.config.ts`, `tsconfig.json`, `electron-builder.json5`) y activos en `public/`.

## Estado del proyecto

La rama activa en este workspace es `yidev`. Usa Node.js, Vite y Electron; está preparada para desarrollo local y empaquetado con electron-builder (ver `electron-builder.json5`).

## Tecnologías

- Electron
- Vite
- React
- TypeScript
- Node.js

## Requisitos

- Node.js 16+ (recomendado)
- npm (o pnpm/yarn)

## Instalación (desarrollo)

1. Clona el repositorio y entra al directorio del proyecto:

   git clone <repo-url>
   cd meser-app

2. Instala dependencias:

   npm install

3. Levanta el entorno de desarrollo (renderer y main según scripts):

   npm run dev

Revisa `package.json` para scripts concretos (por ejemplo `dev`, `build`, `electron:build`).

## Comandos útiles

- Desarrollo (Vite + Electron):

  npm run dev

- Construir el renderer (Vite):

  npm run build

- Empaquetar la app (electron-builder):

  npm run electron:build

Los nombres exactos de los scripts pueden variar; consulta `package.json`.

## Estructura importante

- `src/main/` — código del proceso principal (inicio, IPC, DB, servicios, ventanas)
- `src/renderer/` — aplicación React (componentes, contextos, layouts, páginas)
- `public/` — activos estáticos
- `dist-electron/` — artefactos compilados para distribución
- `electron-builder.json5` — configuración de empaquetado

## Notas de desarrollo

- Tipos y definiciones globales están en `src/vite-env.d.ts` y `src/main/electron-env.d.ts`.
- La lógica de base de datos local y asociaciones se encuentra en `src/main/db/`.
- Los canales y manejadores de IPC están en `src/main/ipc/`.

## Contribuciones

1. Crea una rama con prefijo `feature/` o `fix/`.
2. Abre un pull request contra la rama `yidev` (o la rama principal del repo).
3. Añade pruebas y documentación cuando cambies lógica crítica.

## Licencia

Consulta el archivo `LICENSE` en el repositorio para información sobre la licencia.

## Contacto

Para preguntas, abre un issue en el repositorio o revisa los metadatos del autor en `package.json`.

---

_Archivo README generado y adaptado al proyecto con nombre "meser"._
