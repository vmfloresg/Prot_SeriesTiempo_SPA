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


## Corrección adicional
Se corrigió el botón de detalle de errores de Cuadros estadísticos: el HTML genera `.btn-detalle-cuadro-carga`, mientras que el JavaScript buscaba `.btn-ver-tabla`. Ahora ambos selectores son compatibles y el modal `modalVerTablaErrores` usa `getOrCreateInstance`.


## Módulo integrado: Creación de cuadros y series

Se integró `prot_3` como el módulo de **Creación de cuadros y series**. El encabezado y estilo global del Proyecto 1 permanecen como marco principal; los estilos específicos del constructor están aislados bajo `#tables` para evitar afectar el resto de la SPA. El JavaScript fue encapsulado mediante prefijos `ts_` para evitar colisiones con los otros módulos. También se incorporaron Chart.js, SheetJS y jsPDF como dependencias del módulo.

## Ajuste Series de datos - 21/08/2026
- Se corrigió el selector de AFORE dentro de la SPA para que la lista de opciones siempre sea visible.
- El selector permite selección múltiple y mantiene abierta la lista mientras se marcan AFORE.
- Se ajustó la previsualización de series para respetar la jerarquía Serie > AFORE > Serie hija > AFORE.
- Se aplicaron sangrías, columnas numéricas alineadas y estilo compatible con el proyecto principal.
