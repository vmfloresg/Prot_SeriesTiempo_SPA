# Proyecto Integrado SPA

Se integraron:

- Proyecto 1 como aplicación principal.
- Proyecto 2 como módulo `Carga de archivos`.
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


## CRUD reconstruido de Creación de cuadros y series

- Se reconstruyó sobre la versión estable anterior al CRUD para preservar el menú principal y todas las demás vistas.
- CRUD completo: Nuevo, Guardar/Actualizar, Registros, Consultar, Editar y Eliminar.
- Persistencia en `localStorage` bajo la clave `crudCuadrosSeriesV3`.
- Cada registro conserva título, configuración general, periodo, unidad, estructura jerárquica de series/AFORES, notas y fuente.
- La previsualización ya no utiliza gráfica; muestra la estructura jerárquica del cuadro.
- Incluye migración no destructiva del antiguo `configuracionSeriesTiempo` cuando existe.


## Ajuste de interfaz 2026-08-25
- El acordeón de Creación de cuadros y series inicia colapsado al entrar desde el menú.
- El botón Exportar ahora se denomina Genera plantilla.
- Se retiró el botón Nuevo de la cintilla CRUD.
- El botón Registros se renombró Actualizar y conserva la apertura del modal de registros.


## Ajuste Nuevo > Crear nueva consulta

El botón **Nuevo** ofrece dos opciones:

- **Creación de cuadros y series**: conserva el constructor existente con Configuración y Previsualización.
- **Crear nueva consulta**: muestra una pantalla para configurar una conexión y escribir una consulta SQL. **Ver registros** abre un modal con la tabla de resultados.

La conexión incluida es una simulación de interfaz para el prototipo front-end. Una aplicación de producción no debe conectar el navegador directamente a SQL Server, PostgreSQL, MySQL u Oracle; la ejecución real debe hacerse mediante una API/backend con credenciales protegidas.
