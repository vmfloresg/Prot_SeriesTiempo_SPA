# Proyecto Integrado SPA

Se integraron:

- Proyecto 1 como aplicación principal.
- Proyecto 2 como módulo `Panel Web - Carga y Administración`.
- La navegación principal permanece en el Proyecto 1.
- El módulo de Proyecto 2 conserva sus tres secciones:
  - Carga de archivos
  - Editor de páginas web
  - Administración de usuarios
- El JavaScript de Proyecto 2 quedó encapsulado como `initPanelWeb()` para evitar conflictos con el JavaScript del Proyecto 1.
- El CSS de Proyecto 2 quedó aislado bajo `#panel-web`.

## Estructura

```text
Proyecto_Integrado_SPA/
├── Index.html
├── css/
│   ├── styles.css
│   └── modules/
│       └── panel-web.css
├── js/
│   ├── app.js
│   └── modules/
│       └── panel-web.js
├── views/
│   └── panel-web/
│       └── principal.html
└── assets/
    ├── img/
    └── icons/
```

## Ejecución

Por utilizar `fetch` en futuras ampliaciones y para evitar restricciones del navegador con archivos `file://`, se recomienda abrir el proyecto mediante un servidor local, por ejemplo Live Server de VS Code.

## Nota

La aplicación conserva el mecanismo SPA existente del Proyecto 1 basado en vistas (`.app-view`), por lo que no se requiere un segundo `index.html` ni un `iframe`.
# Prot_SeriesTiempo_SPA
