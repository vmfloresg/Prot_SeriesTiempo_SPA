
/* =========================================================
   ESTADO DE LA APLICACIÓN
   ========================================================= */

let ts_series = [];
let ts_datos = [];

let ts_chart = null;


/* =========================================================
   INICIALIZACIÓN
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    document
        .getElementById("titleIndent")
        .addEventListener("input", function () {

            document.getElementById("indentValue").textContent =
                this.value;

            ts_actualizarTitulo();

        });


    ts_actualizarVistaPrevia();

});


/* =========================================================
   TITULO
   ========================================================= */

function ts_actualizarTitulo() {

    const title =
        document.getElementById("chartTitle").value
        || "Evolución de las ts_series de tiempo";


    const alignment =
        document.getElementById("titleAlignment").value;


    const indent =
        document.getElementById("titleIndent").value;


    const row =
        parseInt(
            document.getElementById("titleRow").value
        ) || 1;


    const titleElement =
        document.getElementById("previewTitle");


    titleElement.textContent = title;

    titleElement.style.textAlign = alignment;

    titleElement.style.marginTop =
        `${(row - 1) * 10}px`;

    titleElement.style.paddingLeft =
        `${indent * 10}px`;
}


/* =========================================================
   AGREGAR SERIE
   ========================================================= */

function ts_agregarSerie() {

    const id =
        document.getElementById("seriesId").value.trim();

    const name =
        document.getElementById("seriesName").value.trim();

    const variable =
        document.getElementById("seriesVariable").value.trim();

    const unit =
        document.getElementById("seriesUnit").value;

    const frequency =
        document.getElementById("seriesFrequency").value;

    const start =
        document.getElementById("startPeriod").value;

    const end =
        document.getElementById("endPeriod").value;

    const source =
        document.getElementById("seriesSource").value.trim();


    if (!id || !name) {

        ts_mostrarMensaje(
            "Debe capturar el identificador y nombre de la serie.",
            "warning"
        );

        return;
    }


    const nuevaSerie = {

        id,
        name,
        variable,
        unit,
        frequency,
        start,
        end,
        source

    };


    ts_series.push(nuevaSerie);


    ts_renderizarSeries();

    ts_actualizarVistaPrevia();


    limpiarFormularioSerie();
}


/* =========================================================
   RENDERIZAR SERIES
   ========================================================= */

function ts_renderizarSeries() {

    const container =
        document.getElementById("seriesContainer");


    if (ts_series.length === 0) {

        container.innerHTML = `
            <div class="empty-message">
                No existen ts_series configuradas.
            </div>
        `;

        return;
    }


    container.innerHTML = "";


    ts_series.forEach((serie, index) => {

        const element =
            document.createElement("div");


        element.className = "ts_series-item";


        element.innerHTML = `

            <div class="d-flex justify-content-between">

                <div>

                    <div class="ts_series-item-title">
                        ${serie.name}
                    </div>

                    <div class="ts_series-item-meta">
                        ${serie.id} · ${serie.frequency}
                    </div>

                </div>

                <span class="badge text-bg-light">
                    ${serie.unit}
                </span>

            </div>


            <div class="ts_series-actions">

                <button
                    class="btn btn-outline-danger btn-sm"
                    onclick="ts_eliminarSerie(${index})">

                    <i class="bi bi-trash"></i>

                </button>

            </div>

        `;


        container.appendChild(element);

    });

}


/* =========================================================
   ELIMINAR SERIE
   ========================================================= */

function ts_eliminarSerie(index) {

    ts_series.splice(index, 1);

    ts_renderizarSeries();

    ts_actualizarVistaPrevia();

}


/* =========================================================
   AGREGAR DATO
   ========================================================= */

function ts_agregarDato() {

    const period =
        document.getElementById("dataPeriod").value;

    const value =
        document.getElementById("dataValue").value;


    if (!period || value === "") {

        ts_mostrarMensaje(
            "Debe indicar el periodo y el valor.",
            "warning"
        );

        return;
    }


    ts_datos.push({

        period,
        value: Number(value)

    });


    ts_datos.sort(
        (a, b) =>
            a.period.localeCompare(b.period)
    );


    ts_renderizarDatos();

    ts_actualizarVistaPrevia();


    document.getElementById("dataPeriod").value = "";

    document.getElementById("dataValue").value = "";

}


/* =========================================================
   RENDERIZAR DATOS
   ========================================================= */

function ts_renderizarDatos() {

    const tbody =
        document.getElementById("dataTableBody");


    tbody.innerHTML = "";


    ts_datos.forEach((dato, index) => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${ts_formatearPeriodo(dato.period)}
            </td>

            <td class="text-end">
                ${dato.value.toLocaleString(
            "es-MX"
        )}
            </td>

            <td class="text-end">

                <button
                    class="btn btn-sm btn-link text-danger"
                    onclick="ts_eliminarDato(${index})">

                    <i class="bi bi-trash"></i>

                </button>

            </td>

        `;


        tbody.appendChild(row);

    });

}


/* =========================================================
   ELIMINAR DATO
   ========================================================= */

function ts_eliminarDato(index) {

    ts_datos.splice(index, 1);

    ts_renderizarDatos();

    ts_actualizarVistaPrevia();

}


/* =========================================================
   ACTUALIZAR VISTA PREVIA
   ========================================================= */

function ts_actualizarVistaPrevia() {

    ts_actualizarTitulo();


    const frecuencia =
        document.getElementById(
            "seriesFrequency"
        ).value;


    const fuente =
        document.getElementById(
            "seriesSource"
        ).value || "—";


    document.getElementById("previewMeta").innerHTML = `

        <span>
            <i class="bi bi-calendar3"></i>
            Periodicidad: ${frecuencia}
        </span>

        <span>
            <i class="bi bi-database"></i>
            Fuente: ${fuente}
        </span>

    `;


    ts_actualizarVistaPreviaSeries();

    ts_actualizarNotas();

}


/* =========================================================
   GRAFICA
   ========================================================= */

function ts_actualizarGrafica() {

    const canvas =
        document.getElementById(
            "timeSeriesChart"
        );

    if (!canvas || typeof Chart === "undefined") {
        return;
    }

    if (ts_chart) {

        ts_chart.destroy();

    }


    let labels = [];

    let values = [];


    if (ts_datos.length > 0) {

        labels =
            ts_datos.map(
                dato => ts_formatearPeriodo(dato.period)
            );

        values =
            ts_datos.map(
                dato => dato.value
            );

    } else {

        labels = [
            "Ene 2025",
            "Feb 2025",
            "Mar 2025",
            "Abr 2025",
            "May 2025",
            "Jun 2025"
        ];


        values = [
            820,
            850,
            875,
            910,
            950,
            980
        ];

    }


    const datasets = [];


    if (ts_series.length === 0) {

        datasets.push({

            label: "Serie de ejemplo",

            data: values,

            borderWidth: 2,

            tension: 0.35,

            pointRadius: 3,

            fill: false

        });

    } else {

        ts_series.forEach((serie, index) => {

            let serieData;


            if (index === 0) {

                serieData = values;

            } else {

                serieData =
                    values.map(
                        value =>
                            value *
                            (1 + index * 0.08)
                    );

            }


            datasets.push({

                label: serie.name,

                data: serieData,

                borderWidth: 2,

                tension: 0.35,

                pointRadius: 3,

                fill: false

            });

        });

    }


    ts_chart = new Chart(canvas, {

        type: "line",

        data: {

            labels,

            datasets

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            interaction: {

                intersect: false,

                mode: "index"

            },

            plugins: {

                legend: {

                    position: "bottom",

                    labels: {

                        boxWidth: 12,

                        font: {

                            size: 11

                        }

                    }

                },

                tooltip: {

                    callbacks: {

                        label: function (context) {

                            return `${context.dataset.label}: ${Number(
                                context.raw
                            ).toLocaleString("es-MX")
                                }`;

                        }

                    }

                }

            },

            scales: {

                x: {

                    grid: {

                        display: false

                    },

                    ticks: {

                        font: {

                            size: 10

                        }

                    }

                },

                y: {

                    beginAtZero: false,

                    ticks: {

                        font: {

                            size: 10

                        },

                        callback: function (value) {

                            return value.toLocaleString(
                                "es-MX"
                            );

                        }

                    }

                }

            }

        }

    });

}


/* =========================================================
   NOTAS
   ========================================================= */

function ts_actualizarNotas() {

    const notes =
        document.getElementById(
            "chartNotes"
        ).value.trim();


    const source =
        document.getElementById(
            "chartSource"
        ).value.trim();


    const notesElement =
        document.getElementById(
            "previewNotes"
        );


    const footer =
        document.getElementById(
            "previewFooter"
        );


    notesElement.innerHTML = `

        <div class="notes-title">
            Notas
        </div>

        <p>
            ${notes ||
        "Configure las notas y fuentes desde el panel izquierdo."
        }
        </p>

    `;


    footer.textContent =
        `Fuente: ${source || "—"}`;

}


/* =========================================================
   VISTA COMPLETA
   ========================================================= */

function ts_vistaCompleta() {

    const documentPreview =
        document.getElementById(
            "previewDocument"
        );

    const content =
        document.getElementById(
            "fullPreviewContent"
        );

    const modalElement =
        document.getElementById(
            "fullPreviewModal"
        );

    if (!documentPreview || !content || !modalElement) {
        return;
    }

    /*
     * La Vista completa vive fuera de #tables. Por esa razón no se debe
     * copiar el HTML con outerHTML y esperar que herede los estilos del
     * módulo. Creamos una copia limpia, sin IDs duplicados, y la montamos
     * en un contenedor propio que cuenta con estilos equivalentes.
     */
    const clone = documentPreview.cloneNode(true);
    clone.removeAttribute("id");
    clone.classList.add("full-preview-document");

    clone.querySelectorAll("[id]").forEach(element => {
        element.removeAttribute("id");
    });


    content.replaceChildren(clone);

    const modal =
        bootstrap.Modal.getOrCreateInstance(
            modalElement
        );

    modal.show();

}


/* =========================================================
   GUARDAR CONFIGURACION
   ========================================================= */

function ts_guardarConfiguracion() {
    ts_crudGuardar();
}



/* =========================================================
   RESTABLECER
   ========================================================= */

// function limpiarConfiguracion() {

//     if (
//         !confirm(
//             "¿Desea eliminar toda la configuración actual?"
//         )
//     ) {

//         return;

//     }


//     ts_series = [];

//     ts_datos = [];


//     document.querySelectorAll(
//         "input, textarea"
//     ).forEach(element => {

//         if (
//             element.type !== "range" &&
//             element.type !== "number"
//         ) {

//             element.value = "";

//         }

//     });


//     document.getElementById(
//         "titleRow"
//     ).value = 1;


//     document.getElementById(
//         "titleIndent"
//     ).value = 0;


//     document.getElementById(
//         "indentValue"
//     ).textContent = "0";


//     document.getElementById(
//         "titleAlignment"
//     ).value = "center";


//     ts_renderizarSeries();

//     ts_renderizarDatos();

//     ts_actualizarVistaPrevia();

// }


// /* =========================================================
//    FORMULARIO DE SERIE
//    ========================================================= */

// function limpiarFormularioSerie() {

//     document.getElementById(
//         "seriesId"
//     ).value = "";

//     document.getElementById(
//         "seriesName"
//     ).value = "";

//     document.getElementById(
//         "seriesVariable"
//     ).value = "";

//     document.getElementById(
//         "seriesSource"
//     ).value = "";

// }


/* =========================================================
   UTILIDADES
   ========================================================= */

function ts_formatearPeriodo(periodo) {

    if (!periodo) {
        return "";
    }


    const partes =
        periodo.split("-");


    const meses = [

        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic"

    ];


    const año = partes[0];

    const mes =
        parseInt(partes[1]) - 1;


    return `${meses[mes]} ${año}`;

}


/* =========================================================
   MENSAJES
   ========================================================= */

function ts_mostrarMensaje(
    mensaje,
    tipo
) {

    const alert =
        document.createElement(
            "div"
        );


    alert.className =
        `alert alert-${tipo} position-fixed shadow`;

    alert.style.top = "90px";

    alert.style.right = "25px";

    alert.style.zIndex = "9999";

    alert.style.fontSize = "12px";


    alert.innerHTML = `

        <i class="bi bi-info-circle"></i>

        ${mensaje}

    `;


    document.body.appendChild(alert);


    setTimeout(() => {

        alert.remove();

    }, 3000);

}


/* ========================================================= 
    CONFIGURACIÓN GENERAL DE LA SERIE 
========================================================= */

let ts_configuracionSerie = {
    descripcion: "",
    decimales: 2,
    tipoCifra: "",
    periodicidad: "",
    periodoInicio: "",
    periodoFin: "",
    unidad: ""
};

/* ========================================================= 
    AGREGAR CONFIGURACIÓN A PREVISUALIZACIÓN 
========================================================= */

function ts_agregarConfiguracionSerie() {

    ts_configuracionSerie = {
        descripcion:
            document.getElementById("seriesDescription").value.trim(),
        decimales:
            document.getElementById("decimalPlaces").value,
        tipoCifra:
            document.getElementById("figureType").value,
        periodicidad:
            document.getElementById("seriesFrequency").value,
        periodoInicio:
            document.getElementById("availablePeriodStart").value,
        periodoFin:
            document.getElementById("availablePeriodEnd").value,
        unidad:
            document.getElementById("seriesUnit").value
    };

    ts_actualizarInformacionSerie();

    ts_mostrarMensaje("La configuración de la serie fue enviada a la previsualización.", "success");
}

/* ========================================================= 
    ACTUALIZAR INFORMACIÓN EN PREVISUALIZACIÓN 
========================================================= */

function ts_actualizarInformacionSerie() {

    const existing = document.getElementById("seriesInformation");

    if (existing) {
        existing.remove();
    }

    const chartTitle = document.getElementById("previewTitle");
    if (!chartTitle) {
        return;
    }

    const inicio = ts_formatearPeriodo(ts_configuracionSerie.periodoInicio);
    const fin = ts_formatearPeriodo(ts_configuracionSerie.periodoFin);
    const periodoDisponible =
        inicio === "—" && fin === "—"
            ? "—"
            : `${inicio} – ${fin}`;

    const information = document.createElement("section");
    information.id = "seriesInformation";
    information.className = "series-information";
    information.setAttribute("aria-label", "Información general de la serie de tiempo");

    information.innerHTML = `
        <div class="series-information-title">
            <i class="bi bi-info-circle"></i>
            <span>Información del cuadro / serie</span>
        </div>

        <div class="series-information-grid">
            <div class="series-information-item series-information-description">
                <div class="series-information-label">Descripción</div>
                <div class="series-information-value">${ts_escapeHtml(ts_configuracionSerie.descripcion || "—")}</div>
            </div>

            <div class="series-information-item">
                <div class="series-information-label">Número de decimales</div>
                <div class="series-information-value">${ts_escapeHtml(String(ts_configuracionSerie.decimales ?? "—"))}</div>
            </div>

            <div class="series-information-item">
                <div class="series-information-label">Tipo de cifra</div>
                <div class="series-information-value">${ts_escapeHtml(ts_configuracionSerie.tipoCifra || "—")}</div>
            </div>

            <div class="series-information-item">
                <div class="series-information-label">Periodicidad</div>
                <div class="series-information-value">${ts_escapeHtml(ts_configuracionSerie.periodicidad || "—")}</div>
            </div>

            <div class="series-information-item series-information-period">
                <div class="series-information-label">Periodo disponible</div>
                <div class="series-information-value">${ts_escapeHtml(periodoDisponible)}</div>
            </div>

            <div class="series-information-item">
                <div class="series-information-label">Unidad de medida</div>
                <div class="series-information-value">${ts_escapeHtml(ts_configuracionSerie.unidad || "—")}</div>
            </div>
        </div>
    `;

    /* La información general se coloca inmediatamente después del título. */
    chartTitle.insertAdjacentElement("afterend", information);
}


/* ========================================================= 
    FORMATEAR PERIODO 
========================================================= */

function ts_formatearPeriodo(periodo) {

    if (!periodo) {
        return "—";
    }

    const partes = periodo.split("-");

    if (partes.length < 2) {
        return periodo;
    }

    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const año = partes[0];
    const mes = parseInt(partes[1], 10) - 1; if (mes < 0 || mes > 11) { return periodo; } return `${meses[mes]} ${año}`;

}


/* =========================================================
   SERIES JERÁRQUICAS
   ========================================================= */

let ts_seriesDatos = [];

let ts_siguienteSerieId = 1;


/* =========================================================
   ACTUALIZAR SANGRIA
   ========================================================= */

document
    .getElementById("dataSeriesIndent")
    .addEventListener("input", function () {

        document.getElementById(
            "dataSeriesIndentValue"
        ).textContent = this.value;

    });


/* =========================================================
   OBTENER AFORES SELECCIONADAS
   ========================================================= */

function ts_obtenerAforesSeleccionadas() {

    const checks =
        document.querySelectorAll(
            ".afore-check:checked"
        );


    return Array.from(checks)
        .map(check => check.value);

}


/* =========================================================
   ACTUALIZAR TEXTO DEL SELECTOR
   ========================================================= */

document.addEventListener(
    "change",
    function (event) {

        if (
            event.target.classList.contains(
                "afore-check"
            )
        ) {

            ts_actualizarTextoAfores();

        }

    }
);


/* =========================================================
   SELECTOR AFORE - CONTROL PROPIO PARA LA SPA
   ========================================================= */

(function ts_inicializarSelectorAfores() {
    const button = document.getElementById("aforesSelectorButton");
    const menu = document.getElementById("aforesDropdown");

    if (!button || !menu || button.dataset.tsInitialized === "1") {
        return;
    }

    button.dataset.tsInitialized = "1";

    const cerrar = () => {
        menu.classList.remove("ts-show");
        button.classList.remove("show");
        button.setAttribute("aria-expanded", "false");
    };

    const abrir = () => {
        menu.classList.add("ts-show");
        button.classList.add("show");
        button.setAttribute("aria-expanded", "true");
    };

    button.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (menu.classList.contains("ts-show")) {
            cerrar();
        } else {
            abrir();
        }
    });

    menu.addEventListener("click", function (event) {
        // Mantener el menú abierto mientras se seleccionan varias AFORE.
        event.stopPropagation();
    });

    document.addEventListener("click", function () {
        cerrar();
    });
})();

function ts_actualizarTextoAfores() {

    const afores =
        ts_obtenerAforesSeleccionadas();


    const text =
        document.getElementById(
            "selectedAforesText"
        );


    if (afores.length === 0) {

        text.textContent =
            "Seleccionar AFORE";

        return;

    }


    if (afores.length === 10) {

        text.textContent =
            "Todas las AFORE seleccionadas";

        return;

    }


    text.textContent =
        `${afores.length} AFORE seleccionadas`;

}


/* =========================================================
   SELECCIONAR TODAS
   ========================================================= */

function ts_seleccionarTodasAfores() {

    document
        .querySelectorAll(".afore-check")
        .forEach(check => {

            check.checked = true;

        });


    ts_actualizarTextoAfores();

}


/* =========================================================
   DESELECCIONAR TODAS
   ========================================================= */

function ts_deseleccionarTodasAfores() {

    document
        .querySelectorAll(".afore-check")
        .forEach(check => {

            check.checked = false;

        });


    ts_actualizarTextoAfores();

}


/* =========================================================
   AGREGAR SERIE
   ========================================================= */

function ts_agregarSerieDatos() {

    const title =
        document.getElementById(
            "dataSeriesTitle"
        ).value.trim();


    const indent =
        parseInt(
            document.getElementById(
                "dataSeriesIndent"
            ).value
        ) || 0;


    const parentIdValue =
        document.getElementById(
            "parentSeries"
        ).value;


    const parentId =
        parentIdValue === ""
            ? null
            : Number(parentIdValue);


    const afores =
        ts_obtenerAforesSeleccionadas();


    /* =============================================
       VALIDACIONES
       ============================================= */

    if (!title) {

        ts_mostrarMensaje(
            "Debe indicar el título de la serie.",
            "warning"
        );

        return;

    }


    if (afores.length === 0) {

        ts_mostrarMensaje(
            "Debe seleccionar al menos una AFORE.",
            "warning"
        );

        return;

    }


    /* =============================================
       VALIDAR RELACIÓN PADRE
       ============================================= */

    if (parentId !== null) {

        const parent =
            ts_seriesDatos.find(
                serie =>
                    serie.id === parentId
            );


        if (!parent) {

            ts_mostrarMensaje(
                "La serie padre seleccionada no existe.",
                "warning"
            );

            return;

        }

        /*
         * La serie hija debe tener una sangría
         * mayor que la de su padre.
         */

        if (indent <= parent.indent) {

            ts_mostrarMensaje(
                "La serie hija debe tener una sangría mayor que la serie padre.",
                "warning"
            );

            return;

        }

    }


    /* =============================================
       CREAR SERIE
       ============================================= */

    const nuevaSerie = {

        id: ts_siguienteSerieId++,

        parentId,

        title,

        indent,

        afores

    };


    ts_seriesDatos.push(
        nuevaSerie
    );


    /* =============================================
       ACTUALIZAR INTERFAZ
       ============================================= */

    ts_renderizarSeriesConfiguradas();

    ts_actualizarCatalogoSeriesPadre();

    ts_actualizarVistaPreviaSeries();


    ts_limpiarFormularioSerieDatos();

    const ts_aforeMenu = document.getElementById("aforesDropdown");
    const ts_aforeButton = document.getElementById("aforesSelectorButton");
    if (ts_aforeMenu) ts_aforeMenu.classList.remove("ts-show");
    if (ts_aforeButton) {
        ts_aforeButton.classList.remove("show");
        ts_aforeButton.setAttribute("aria-expanded", "false");
    }


    ts_mostrarMensaje(
        "Serie agregada correctamente.",
        "success"
    );

}


/* =========================================================
   CATALOGO DE SERIES PADRE
   ========================================================= */

function ts_actualizarCatalogoSeriesPadre() {

    const select =
        document.getElementById(
            "parentSeries"
        );


    const selectedValue =
        select.value;


    select.innerHTML = `

        <option value="">
            Serie principal / sin padre
        </option>

    `;


    ts_seriesDatos.forEach(serie => {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            serie.id;


        option.textContent =
            `${"— ".repeat(serie.indent)}${serie.title}`;


        select.appendChild(
            option
        );

    });


    if (
        ts_seriesDatos.some(
            serie =>
                String(serie.id) ===
                selectedValue
        )
    ) {

        select.value =
            selectedValue;

    }

}


/* =========================================================
   RENDERIZAR SERIES CONFIGURADAS
   ========================================================= */

function ts_renderizarSeriesConfiguradas() {

    const container =
        document.getElementById(
            "configuredSeriesContainer"
        );


    if (ts_seriesDatos.length === 0) {

        container.innerHTML = `

            <div class="empty-message">

                No existen ts_series configuradas.

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    const roots =
        ts_seriesDatos.filter(
            serie =>
                serie.parentId === null
        );


    roots.forEach(root => {

        ts_renderizarNodoSerie(
            root,
            container
        );

    });

}


/* =========================================================
   RENDERIZAR NODO
   ========================================================= */

function ts_renderizarNodoSerie(
    serie,
    container
) {

    const wrapper =
        document.createElement(
            "div"
        );


    wrapper.className =
        serie.parentId !== null
            ? "ts_series-tree-line"
            : "";


    const item =
        document.createElement(
            "div"
        );


    item.className =
        "configured-ts_series-item";


    item.style.marginLeft =
        `${serie.indent * 12}px`;


    item.innerHTML = `

        <div class="d-flex justify-content-between
                    align-items-start">

            <div>

                <div class="configured-ts_series-title">

                    ${serie.parentId !== null
            ? '<span class="ts_series-parent-indicator">↳</span>'
            : ''
        }

                    ${ts_escapeHtml(serie.title)}

                </div>


                <div class="configured-ts_series-meta">

                    Nivel de sangría:
                    ${serie.indent}

                    &nbsp; · &nbsp;

                    ${serie.afores.length}
                    AFORE(s)

                </div>

            </div>


            <button
                class="btn btn-sm btn-outline-danger"
                onclick="ts_eliminarSerieDatos(${serie.id})">

                <i class="bi bi-trash"></i>

            </button>

        </div>


        <div class="configured-ts_series-meta mt-2">

            ${serie.afores
            .map(
                afore =>
                    `<span class="badge text-bg-light me-1">
                            ${ts_escapeHtml(afore)}
                        </span>`
            )
            .join("")}

        </div>

    `;


    wrapper.appendChild(item);

    container.appendChild(wrapper);


    /*
     * Buscar hijos de la serie.
     */

    const children =
        ts_seriesDatos.filter(
            child =>
                child.parentId === serie.id
        );


    children.forEach(child => {

        ts_renderizarNodoSerie(
            child,
            container
        );

    });

}


/* =========================================================
   ELIMINAR SERIE
   ========================================================= */

function ts_eliminarSerieDatos(id) {

    const hasChildren =
        ts_seriesDatos.some(
            serie =>
                serie.parentId === id
        );


    if (hasChildren) {

        ts_mostrarMensaje(
            "No se puede eliminar la serie porque tiene ts_series hijas.",
            "warning"
        );

        return;

    }


    ts_seriesDatos =
        ts_seriesDatos.filter(
            serie =>
                serie.id !== id
        );


    ts_renderizarSeriesConfiguradas();

    ts_actualizarCatalogoSeriesPadre();

    ts_actualizarVistaPreviaSeries();

}


/* =========================================================
   LIMPIAR FORMULARIO
   ========================================================= */

function ts_limpiarFormularioSerieDatos() {

    document.getElementById(
        "dataSeriesTitle"
    ).value = "";


    document.getElementById(
        "dataSeriesIndent"
    ).value = 0;


    document.getElementById(
        "dataSeriesIndentValue"
    ).textContent = "0";


    document.getElementById(
        "parentSeries"
    ).value = "";


    ts_deseleccionarTodasAfores();

}


/* =========================================================
   ESCAPAR HTML
   ========================================================= */

function ts_escapeHtml(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}

/* =========================================================
   ACTUALIZAR PREVISUALIZACIÓN DE SERIES
   ========================================================= */

function ts_actualizarVistaPreviaSeries() {

    const existing =
        document.getElementById(
            "previewSeriesData"
        );


    if (existing) {

        existing.remove();

    }


    if (ts_seriesDatos.length === 0) {

        return;

    }


    const chartContainer = null;


    const seriesContainer =
        document.createElement(
            "div"
        );


    seriesContainer.id =
        "previewSeriesData";


    seriesContainer.className =
        "preview-series-data";


    seriesContainer.innerHTML = `

        <div class="preview-series-header">

            <div class="preview-concept">

                CONCEPTO

            </div>

            <div>JUNIO 2025</div>

            <div>MAYO 2026</div>

            <div>JUNIO 2026</div>

        </div>

    `;


    const roots =
        ts_seriesDatos.filter(
            serie =>
                serie.parentId === null
        );


    roots.forEach(
        root => {

            ts_renderizarSeriePreview(
                root,
                seriesContainer
            );

        }
    );


    /*
     * La tabla se coloca antes de la gráfica.
     */

    const previewNotes = document.getElementById("previewNotes");
    const previewDocument = document.getElementById("previewDocument");

    if (previewNotes) {
        previewNotes.insertAdjacentElement("beforebegin", seriesContainer);
    } else if (previewDocument) {
        previewDocument.appendChild(seriesContainer);
    }

}


/* =========================================================
   RENDERIZAR SERIE EN PREVISUALIZACIÓN
   ========================================================= */

function ts_renderizarSeriePreview(
    serie,
    container
) {

    /*
     * Título de la serie.
     */

    const titleRow =
        document.createElement(
            "div"
        );


    titleRow.className =
        "preview-series-row preview-series-title-row";
    titleRow.dataset.level = String(serie.indent);



    titleRow.innerHTML = `

        <div class="preview-concept" style="padding-left:${serie.indent * 24 + 8}px">

            <span class="preview-checkbox">
                □
            </span>

            ${ts_escapeHtml(serie.title)}

        </div>

        <div></div>

        <div></div>

        <div></div>

    `;


    container.appendChild(
        titleRow
    );


    /*
     * AFORE pertenecientes a la serie.
     */

    serie.afores.forEach(
        (afore, index) => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "preview-series-row preview-afore-row";
            row.dataset.level = String(serie.indent + 1);


            /*
             * La AFORE tiene la misma sangría
             * de la serie.
             */

            row.dataset.indent = serie.indent + 1;


            const baseValue =
                ts_obtenerValorEjemplo(
                    serie.id,
                    index
                );


            row.innerHTML = `

                <div class="preview-concept" style="padding-left:${(serie.indent + 1) * 24 + 8}px">

                    <span class="preview-checkbox">
                        □
                    </span>

                    ${ts_escapeHtml(afore)}

                </div>


                <div>
                    ${ts_formatearNumero(
                baseValue
            )}
                </div>


                <div>
                    ${ts_formatearNumero(
                baseValue * 1.035
            )}
                </div>


                <div>
                    ${ts_formatearNumero(
                baseValue * 1.041
            )}
                </div>

            `;


            container.appendChild(
                row
            );

        }
    );


    /*
     * Buscar ts_series hijas.
     */

    const children =
        ts_seriesDatos.filter(
            child =>
                child.parentId === serie.id
        );


    children.forEach(
        child => {

            ts_renderizarSeriePreview(
                child,
                container
            );

        }
    );

}


/* =========================================================
   VALORES DE EJEMPLO
   ========================================================= */

function ts_obtenerValorEjemplo(
    serieId,
    index
) {

    const valores = [

        76918549,
        68799591,
        17038522,
        8561379,
        11868514,
        1108447,
        1864292,
        2520067,
        2291840,
        8387899

    ];


    const base =
        valores[index % valores.length];


    return base *
        (1 + ((serieId - 1) * 0.025));

}


/* =========================================================
   FORMATEAR NUMERO
   ========================================================= */

function ts_formatearNumero(numero) {

    const decimals =
        ts_configuracionSerie &&
            ts_configuracionSerie.decimales !== undefined
            ? Number(
                ts_configuracionSerie.decimales
            )
            : 0;


    return Number(numero)
        .toLocaleString(
            "es-MX",
            {
                minimumFractionDigits:
                    decimals,

                maximumFractionDigits:
                    decimals
            }
        );

}

/* =========================================================
   EXPORTAR A EXCEL
   ========================================================= */

function ts_exportarExcel() {

    if (ts_seriesDatos.length === 0) {

        ts_mostrarMensaje(
            "No existen ts_series de ts_datos para exportar.",
            "warning"
        );

        return;

    }


    const filas =
        ts_construirDatosExportacion();


    const worksheet =
        XLSX.utils.json_to_sheet(
            filas
        );


    const workbook =
        XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Series de ts_datos"
    );


    const titulo =
        ts_obtenerTituloExportacion();


    const nombreArchivo =
        ts_sanitizarNombreArchivo(
            titulo
        );


    XLSX.writeFile(
        workbook,
        `${nombreArchivo}.xlsx`
    );


    ts_mostrarMensaje(
        "El archivo Excel fue generado correctamente.",
        "success"
    );

}

/* =========================================================
   CONSTRUIR DATOS DE EXPORTACIÓN
   ========================================================= */

function ts_construirDatosExportacion() {

    const filas = [];


    ts_seriesDatos.forEach(
        serie => {

            /*
             * La serie se exporta como un registro.
             */

            serie.afores.forEach(
                afore => {

                    filas.push({

                        "Serie":
                            ts_obtenerRutaSerie(
                                serie.id
                            ),

                        "AFORE":
                            afore,

                        "Sangría":
                            serie.indent,

                        "Junio 2025":
                            ts_obtenerValorEjemplo(
                                serie.id,
                                0
                            ),

                        "Mayo 2026":
                            ts_obtenerValorEjemplo(
                                serie.id,
                                0
                            ) * 1.035,

                        "Junio 2026":
                            ts_obtenerValorEjemplo(
                                serie.id,
                                0
                            ) * 1.041

                    });

                }

            );

        }
    );


    return filas;
}

/* =========================================================
   OBTENER RUTA DE LA SERIE
   ========================================================= */

function ts_obtenerRutaSerie(id) {

    const serie =
        ts_seriesDatos.find(
            item => item.id === id
        );


    if (!serie) {

        return "";

    }


    if (serie.parentId === null) {

        return serie.title;

    }


    return (
        ts_obtenerRutaSerie(
            serie.parentId
        )
        +
        " > "
        +
        serie.title
    );

}

/* =========================================================
   EXPORTAR CSV
   ========================================================= */

function ts_exportarCSV() {

    if (ts_seriesDatos.length === 0) {

        ts_mostrarMensaje(
            "No existen ts_series de ts_datos para exportar.",
            "warning"
        );

        return;

    }


    const filas =
        ts_construirDatosExportacion();


    if (filas.length === 0) {

        return;

    }


    const headers =
        Object.keys(
            filas[0]
        );


    const csv = [

        headers.join(","),

        ...filas.map(
            fila =>
                headers
                    .map(
                        header =>
                            ts_escaparCSV(
                                fila[header]
                            )
                    )
                    .join(",")
        )

    ].join("\n");


    const blob =
        new Blob(
            [
                "\uFEFF" + csv
            ],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    ts_descargarArchivo(
        blob,
        `${ts_sanitizarNombreArchivo(
            ts_obtenerTituloExportacion()
        )}.csv`
    );


    ts_mostrarMensaje(
        "El archivo CSV fue generado correctamente.",
        "success"
    );

}

function ts_escaparCSV(valor) {

    if (
        valor === null ||
        valor === undefined
    ) {

        return "";

    }


    const texto =
        String(valor);


    if (
        texto.includes(",") ||
        texto.includes('"') ||
        texto.includes("\n")
    ) {

        return `"${texto.replace(
            /"/g,
            '""'
        )}"`;

    }


    return texto;

}

/* =========================================================
   EXPORTAR PDF
   ========================================================= */

function ts_exportarPDF() {

    if (ts_seriesDatos.length === 0) {

        ts_mostrarMensaje(
            "No existen ts_series de ts_datos para exportar.",
            "warning"
        );

        return;

    }


    const {
        jsPDF
    } = window.jspdf;


    const doc =
        new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "letter"
        });


    const titulo =
        ts_obtenerTituloExportacion();


    /*
     * Título
     */

    doc.setFontSize(15);

    doc.setFont(
        "helvetica",
        "bold"
    );


    doc.text(
        titulo,
        15,
        15
    );


    /*
     * Información general
     */

    doc.setFontSize(8);

    doc.setFont(
        "helvetica",
        "normal"
    );


    let y = 23;


    if (
        ts_configuracionSerie.descripcion
    ) {

        doc.text(
            ts_configuracionSerie.descripcion,
            15,
            y,
            {
                maxWidth: 250
            }
        );

        y += 7;

    }


    doc.text(
        `Periodicidad: ${ts_configuracionSerie.periodicidad || "—"
        }`,
        15,
        y
    );


    doc.text(
        `Unidad: ${ts_configuracionSerie.unidad || "—"
        }`,
        100,
        y
    );


    doc.text(
        180,
        y
    );


    y += 8;


    /*
     * Tabla
     */

    const filas =
        ts_construirDatosExportacion();


    const body =
        filas.map(
            fila => [

                fila["Serie"],

                fila["AFORE"],

                fila["Junio 2025"],

                fila["Mayo 2026"],

                fila["Junio 2026"]

            ]
        );


    doc.autoTable({

        startY: y,

        head: [[

            "Serie",

            "AFORE",

            "Junio 2025",

            "Mayo 2026",

            "Junio 2026"

        ]],

        body,

        styles: {

            fontSize: 7,

            cellPadding: 2

        },

        headStyles: {

            fontStyle: "bold"

        },

        columnStyles: {

            0: {
                cellWidth: 85
            },

            1: {
                cellWidth: 45
            },

            2: {
                halign: "right"
            },

            3: {
                halign: "right"
            },

            4: {
                halign: "right"
            }

        }

    });


    const nombreArchivo =
        ts_sanitizarNombreArchivo(
            titulo
        );


    doc.save(
        `${nombreArchivo}.pdf`
    );


    ts_mostrarMensaje(
        "El archivo PDF fue generado correctamente.",
        "success"
    );

}

/* =========================================================
   EXPORTAR IQY
   ========================================================= */

function ts_exportarIQY() {

    const titulo =
        ts_obtenerTituloExportacion();


    /*
     * URL del servicio que posteriormente
     * proporcionará los ts_datos.
     *
     * En producción esta URL deberá sustituirse
     * por el API real del sistema.
     */

    const url =
        "https://ejemplo.consar.gob.mx/api/ts_series";


    const iqy =

        `WEB
1
${url}

Selection=Entire Page
Formatting=None
PreFormattedTextToColumns=True
ConsecutiveDelimitersAsOne=True
SingleBlockTextImport=False
DisableDateRecognition=False
DisableRedirections=False`;


    const blob =
        new Blob(
            [iqy],
            {
                type:
                    "application/x-iqy"
            }
        );


    ts_descargarArchivo(
        blob,
        `${ts_sanitizarNombreArchivo(
            titulo
        )}.iqy`
    );


    ts_mostrarMensaje(
        "El archivo IQY fue generado correctamente.",
        "success"
    );

}

/* =========================================================
   DESCARGAR ARCHIVO
   ========================================================= */

function ts_descargarArchivo(
    blob,
    nombre
) {

    const url =
        URL.createObjectURL(
            blob
        );


    const enlace =
        document.createElement(
            "a"
        );


    enlace.href = url;

    enlace.download = nombre;


    document.body.appendChild(
        enlace
    );


    enlace.click();


    document.body.removeChild(
        enlace
    );


    URL.revokeObjectURL(
        url
    );

}


/* =========================================================
   OBTENER TITULO
   ========================================================= */

function ts_obtenerTituloExportacion() {

    const titulo =
        document.getElementById(
            "previewTitle"
        );


    if (
        titulo &&
        titulo.textContent.trim()
    ) {

        return titulo.textContent.trim();

    }


    return "serie_tiempo";

}


/* =========================================================
   SANITIZAR NOMBRE
   ========================================================= */

function ts_sanitizarNombreArchivo(
    nombre
) {

    return nombre

        .normalize("NFD")

        .replace(
            /[\u0300-\u036f]/g,
            ""
        )

        .replace(
            /[^a-zA-Z0-9_-]+/g,
            "_"
        )

        .replace(
            /^_+|_+$/g,
            ""
        )

        .substring(
            0,
            80
        )

        || "serie_tiempo";

}




/* =========================================================
   CRUD DE CREACIÓN DE CUADROS Y SERIES
   Persistencia local, sin alterar las demás vistas de la SPA.
   ========================================================= */

const TS_CRUD_STORAGE_KEY = "crudCuadrosSeriesV3";
let ts_crudIdActual = null;

function ts_crudClonar(valor) {
    return JSON.parse(JSON.stringify(valor ?? null));
}

function ts_crudLeerRegistros() {
    try {
        const raw = localStorage.getItem(TS_CRUD_STORAGE_KEY);
        const data = raw ? JSON.parse(raw) : [];
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("No fue posible leer los cuadros guardados", error);
        return [];
    }
}

function ts_crudPersistirRegistros(registros) {
    localStorage.setItem(TS_CRUD_STORAGE_KEY, JSON.stringify(registros));
    ts_crudActualizarContador();
}

function ts_crudGenerarId() {
    const registros = ts_crudLeerRegistros();
    const numeros = registros
        .map(r => String(r.id || "").match(/(\d+)$/))
        .filter(Boolean)
        .map(m => Number(m[1]));
    const siguiente = (numeros.length ? Math.max(...numeros) : 0) + 1;
    return `CS-${String(siguiente).padStart(4, "0")}`;
}

function ts_crudRecolectarFormulario() {
    // Sincronizar lo que el usuario ve con el estado antes de guardar.
    ts_actualizarTitulo();
    ts_agregarConfiguracionSerieSilenciosa();
    ts_actualizarNotas();
    ts_actualizarVistaPreviaSeries();

    const ahora = new Date().toISOString();
    const registros = ts_crudLeerRegistros();
    const existente = registros.find(r => r.id === ts_crudIdActual);

    return {
        id: ts_crudIdActual || ts_crudGenerarId(),
        creadoEn: existente?.creadoEn || ahora,
        actualizadoEn: ahora,
        titulo: {
            texto: document.getElementById("chartTitle")?.value.trim() || "",
            renglon: document.getElementById("titleRow")?.value || "1",
            alineacion: document.getElementById("titleAlignment")?.value || "center",
            sangria: document.getElementById("titleIndent")?.value || "0"
        },
        configuracionSerie: ts_crudClonar(ts_configuracionSerie) || {},
        seriesDatos: ts_crudClonar(ts_seriesDatos) || [],
        siguienteSerieId: ts_siguienteSerieId,
        notas: document.getElementById("chartNotes")?.value || "",
        fuente: document.getElementById("chartSource")?.value || "",
        // Se conservan estos arreglos por compatibilidad con configuraciones anteriores.
        seriesLegacy: ts_crudClonar(ts_series) || [],
        datosLegacy: ts_crudClonar(ts_datos) || []
    };
}

function ts_agregarConfiguracionSerieSilenciosa() {
    ts_configuracionSerie = {
        descripcion: document.getElementById("seriesDescription")?.value.trim() || "",
        decimales: document.getElementById("decimalPlaces")?.value ?? "2",
        tipoCifra: document.getElementById("figureType")?.value || "",
        periodicidad: document.getElementById("seriesFrequency")?.value || "",
        periodoInicio: document.getElementById("availablePeriodStart")?.value || "",
        periodoFin: document.getElementById("availablePeriodEnd")?.value || "",
        unidad: document.getElementById("seriesUnit")?.value || ""
    };
    ts_actualizarInformacionSerie();
}

function ts_crudValidar(registro) {
    if (!registro.titulo.texto) {
        ts_mostrarMensaje("Capture el título del cuadro antes de guardarlo.", "warning");
        document.getElementById("chartTitle")?.focus();
        return false;
    }
    if (!registro.configuracionSerie.descripcion) {
        ts_mostrarMensaje("Capture la descripción del cuadro.", "warning");
        document.getElementById("seriesDescription")?.focus();
        return false;
    }
    if (!registro.seriesDatos.length) {
        ts_mostrarMensaje("Agregue al menos una serie de datos a la estructura jerárquica.", "warning");
        return false;
    }
    return true;
}

function ts_crudGuardar() {
    const registro = ts_crudRecolectarFormulario();
    if (!ts_crudValidar(registro)) return;

    const registros = ts_crudLeerRegistros();
    const index = registros.findIndex(r => r.id === registro.id);
    const esEdicion = index >= 0;

    if (esEdicion) registros[index] = registro;
    else registros.push(registro);

    ts_crudPersistirRegistros(registros);
    ts_crudIdActual = registro.id;
    ts_crudActualizarEstado();
    ts_mostrarMensaje(
        esEdicion ? `Cuadro ${registro.id} actualizado correctamente.` : `Cuadro ${registro.id} creado correctamente.`,
        "success"
    );
}

function ts_crudNuevo() {
    ts_crudIdActual = null;
    ts_series = [];
    ts_datos = [];
    ts_seriesDatos = [];
    ts_siguienteSerieId = 1;
    ts_configuracionSerie = {
        descripcion: "", decimales: 2, tipoCifra: "", periodicidad: "",
        periodoInicio: "", periodoFin: "", unidad: ""
    };

    const valores = {
        chartTitle: "", titleRow: "1", titleAlignment: "center", titleIndent: "0",
        seriesDescription: "", decimalPlaces: "2", figureType: "", seriesFrequency: "",
        availablePeriodStart: "", availablePeriodEnd: "", seriesUnit: "",
        chartNotes: "", chartSource: "", dataSeriesTitle: "", dataSeriesIndent: "0", parentSeries: ""
    };
    Object.entries(valores).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el) el.value = value;
    });

    document.querySelectorAll("#tables .afore-check").forEach(c => c.checked = false);
    const indent = document.getElementById("indentValue");
    if (indent) indent.textContent = "0";
    const dataIndent = document.getElementById("dataSeriesIndentValue");
    if (dataIndent) dataIndent.textContent = "0";

    document.getElementById("seriesInformation")?.remove();
    document.getElementById("previewSeriesData")?.remove();
    ts_actualizarTextoAfores();
    ts_renderizarSeriesConfiguradas();
    ts_actualizarCatalogoSeriesPadre();
    ts_actualizarTitulo();
    ts_actualizarNotas();
    ts_crudActualizarEstado();
    ts_mostrarMensaje("Formulario preparado para crear un nuevo cuadro.", "info");
}

function ts_crudAplicarRegistro(registro) {
    if (!registro) return;
    ts_crudIdActual = registro.id;

    const t = registro.titulo || {};
    const c = registro.configuracionSerie || {};
    const valores = {
        chartTitle: t.texto || "",
        titleRow: t.renglon || "1",
        titleAlignment: t.alineacion || "center",
        titleIndent: t.sangria ?? "0",
        seriesDescription: c.descripcion || "",
        decimalPlaces: c.decimales ?? "2",
        figureType: c.tipoCifra || "",
        seriesFrequency: c.periodicidad || "",
        availablePeriodStart: c.periodoInicio || "",
        availablePeriodEnd: c.periodoFin || "",
        seriesUnit: c.unidad || "",
        chartNotes: registro.notas || "",
        chartSource: registro.fuente || ""
    };
    Object.entries(valores).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el) el.value = value;
    });

    ts_configuracionSerie = ts_crudClonar(c) || {};
    ts_seriesDatos = ts_crudClonar(registro.seriesDatos) || [];
    ts_siguienteSerieId = Number(registro.siguienteSerieId) ||
        (ts_seriesDatos.reduce((max, s) => Math.max(max, Number(s.id) || 0), 0) + 1);
    ts_series = ts_crudClonar(registro.seriesLegacy) || [];
    ts_datos = ts_crudClonar(registro.datosLegacy) || [];

    const indent = document.getElementById("indentValue");
    if (indent) indent.textContent = String(t.sangria ?? 0);
    ts_deseleccionarTodasAfores();
    ts_renderizarSeriesConfiguradas();
    ts_actualizarCatalogoSeriesPadre();
    ts_actualizarTitulo();
    ts_actualizarInformacionSerie();
    ts_actualizarVistaPreviaSeries();
    ts_actualizarNotas();
    ts_crudActualizarEstado();
}

function ts_crudEditar(id) {
    const registro = ts_crudLeerRegistros().find(r => r.id === id);
    if (!registro) {
        ts_mostrarMensaje("El registro solicitado ya no existe.", "warning");
        return;
    }
    const listado = document.getElementById("tsCrudRegistrosModal");
    if (listado) bootstrap.Modal.getInstance(listado)?.hide();
    const detalle = document.getElementById("tsCrudDetalleModal");
    if (detalle) bootstrap.Modal.getInstance(detalle)?.hide();
    ts_crudAplicarRegistro(registro);
    ts_mostrarMensaje(`Editando ${id}. Los cambios se guardarán sobre el mismo registro.`, "info");
}

function ts_crudEliminar(id) {
    const registros = ts_crudLeerRegistros();
    const registro = registros.find(r => r.id === id);
    if (!registro) return;
    const titulo = registro.titulo?.texto || id;
    if (!confirm(`¿Desea eliminar el cuadro “${titulo}”?\n\nEsta acción no se puede deshacer.`)) return;

    ts_crudPersistirRegistros(registros.filter(r => r.id !== id));
    if (ts_crudIdActual === id) ts_crudNuevo();
    ts_crudRenderizarRegistros();
    ts_mostrarMensaje(`Cuadro ${id} eliminado.`, "success");
}

function ts_crudAbrirRegistros() {
    ts_crudRenderizarRegistros();
    const modal = document.getElementById("tsCrudRegistrosModal");
    if (modal) bootstrap.Modal.getOrCreateInstance(modal).show();
}

function ts_crudRenderizarRegistros() {
    const body = document.getElementById("tsCrudRegistrosBody");
    const empty = document.getElementById("tsCrudSinRegistros");
    if (!body || !empty) return;

    const query = (document.getElementById("tsCrudBuscar")?.value || "").trim().toLowerCase();
    const registros = ts_crudLeerRegistros()
        .filter(r => {
            const c = r.configuracionSerie || {};
            return [r.id, r.titulo?.texto, c.descripcion, c.periodicidad, c.unidad]
                .some(v => String(v || "").toLowerCase().includes(query));
        })
        .sort((a,b) => String(b.actualizadoEn || "").localeCompare(String(a.actualizadoEn || "")));

    body.innerHTML = "";
    empty.classList.toggle("d-none", registros.length !== 0);

    registros.forEach(registro => {
        const c = registro.configuracionSerie || {};
        const inicio = ts_formatearPeriodo(c.periodoInicio);
        const fin = ts_formatearPeriodo(c.periodoFin);
        const periodo = inicio === "—" && fin === "—" ? "—" : `${inicio} – ${fin}`;
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><span class="badge text-bg-light border">${ts_escapeHtml(registro.id)}</span></td>
            <td>
              <div class="fw-semibold">${ts_escapeHtml(registro.titulo?.texto || "Sin título")}</div>
              <small class="text-muted ts-crud-description">${ts_escapeHtml(c.descripcion || "Sin descripción")}</small>
            </td>
            <td>${ts_escapeHtml(c.periodicidad || "—")}</td>
            <td class="text-nowrap">${ts_escapeHtml(periodo)}</td>
            <td class="text-center"><span class="badge text-bg-primary">${(registro.seriesDatos || []).length}</span></td>
            <td class="text-nowrap"><small>${ts_crudFecha(registro.actualizadoEn)}</small></td>
            <td class="text-end text-nowrap">
              <button class="btn btn-sm btn-outline-secondary" title="Consultar" onclick="ts_crudConsultar('${registro.id}')"><i class="bi bi-eye"></i></button>
              <button class="btn btn-sm btn-outline-primary ms-1" title="Editar" onclick="ts_crudEditar('${registro.id}')"><i class="bi bi-pencil-square"></i></button>
              <button class="btn btn-sm btn-outline-danger ms-1" title="Eliminar" onclick="ts_crudEliminar('${registro.id}')"><i class="bi bi-trash"></i></button>
            </td>`;
        body.appendChild(tr);
    });
}

function ts_crudConsultar(id) {
    const registro = ts_crudLeerRegistros().find(r => r.id === id);
    if (!registro) return;
    const container = document.getElementById("tsCrudDetalleContenido");
    if (!container) return;
    container.innerHTML = ts_crudConstruirDetalle(registro);
    const editar = document.getElementById("tsCrudDetalleEditar");
    if (editar) editar.onclick = () => ts_crudEditar(id);
    const listado = document.getElementById("tsCrudRegistrosModal");
    if (listado) bootstrap.Modal.getInstance(listado)?.hide();
    bootstrap.Modal.getOrCreateInstance(document.getElementById("tsCrudDetalleModal")).show();
}

function ts_crudConstruirDetalle(registro) {
    const c = registro.configuracionSerie || {};
    const inicio = ts_formatearPeriodo(c.periodoInicio);
    const fin = ts_formatearPeriodo(c.periodoFin);
    const periodo = inicio === "—" && fin === "—" ? "—" : `${inicio} – ${fin}`;
    return `
      <article class="ts-crud-detail preview-document">
        <div class="d-flex justify-content-between gap-3 align-items-start mb-3">
          <div>
            <div class="preview-title text-start p-0 m-0">${ts_escapeHtml(registro.titulo?.texto || "Sin título")}</div>
            <div class="text-muted small mt-1">Clave: ${ts_escapeHtml(registro.id)}</div>
          </div>
          <span class="badge text-bg-light border">Actualizado ${ts_crudFecha(registro.actualizadoEn)}</span>
        </div>
        <section class="series-information mb-4">
          <div class="series-information-title"><i class="bi bi-info-circle"></i><span>Información del cuadro / serie</span></div>
          <div class="series-information-grid">
            <div class="series-information-item series-information-description"><div class="series-information-label">Descripción</div><div class="series-information-value">${ts_escapeHtml(c.descripcion || "—")}</div></div>
            <div class="series-information-item"><div class="series-information-label">Número de decimales</div><div class="series-information-value">${ts_escapeHtml(String(c.decimales ?? "—"))}</div></div>
            <div class="series-information-item"><div class="series-information-label">Tipo de cifra</div><div class="series-information-value">${ts_escapeHtml(c.tipoCifra || "—")}</div></div>
            <div class="series-information-item"><div class="series-information-label">Periodicidad</div><div class="series-information-value">${ts_escapeHtml(c.periodicidad || "—")}</div></div>
            <div class="series-information-item"><div class="series-information-label">Periodo disponible</div><div class="series-information-value">${ts_escapeHtml(periodo)}</div></div>
            <div class="series-information-item"><div class="series-information-label">Unidad de medida</div><div class="series-information-value">${ts_escapeHtml(c.unidad || "—")}</div></div>
          </div>
        </section>
        ${ts_crudConstruirJerarquiaHTML(registro.seriesDatos || [])}
        <div class="preview-notes mt-4"><div class="notes-title">Notas</div><p>${ts_escapeHtml(registro.notas || "—")}</p></div>
        <div class="preview-footer">Fuente: ${ts_escapeHtml(registro.fuente || "—")}</div>
      </article>`;
}

function ts_crudConstruirJerarquiaHTML(series) {
    if (!series.length) return '<div class="alert alert-light border">No existen series de datos configuradas.</div>';
    const out = [];
    out.push('<div class="preview-series-data ts-crud-hierarchy">');
    out.push('<div class="preview-series-header"><div class="preview-concept">CONCEPTO</div><div>JUNIO 2025</div><div>MAYO 2026</div><div>JUNIO 2026</div></div>');
    const roots = series.filter(s => s.parentId === null || s.parentId === undefined || s.parentId === "");
    const render = serie => {
        const indent = Number(serie.indent) || 0;
        out.push(`<div class="preview-series-row preview-series-title-row"><div class="preview-concept" style="padding-left:${indent*24+8}px"><span class="preview-checkbox">□</span>${ts_escapeHtml(serie.title || "Serie")}</div><div></div><div></div><div></div></div>`);
        (serie.afores || []).forEach((afore,index) => {
            const base = ts_obtenerValorEjemplo(serie.id,index);
            out.push(`<div class="preview-series-row preview-afore-row"><div class="preview-concept" style="padding-left:${(indent+1)*24+8}px"><span class="preview-checkbox">□</span>${ts_escapeHtml(afore)}</div><div>${ts_formatearNumero(base)}</div><div>${ts_formatearNumero(base*1.035)}</div><div>${ts_formatearNumero(base*1.041)}</div></div>`);
        });
        series.filter(s => String(s.parentId) === String(serie.id)).forEach(render);
    };
    roots.forEach(render);
    out.push('</div>');
    return out.join('');
}

function ts_crudFecha(valor) {
    if (!valor) return "—";
    const fecha = new Date(valor);
    if (Number.isNaN(fecha.getTime())) return "—";
    return fecha.toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short" });
}

function ts_crudActualizarContador() {
    const el = document.getElementById("tsCrudContador");
    if (el) el.textContent = String(ts_crudLeerRegistros().length);
}

function ts_crudActualizarEstado() {
    const estado = document.getElementById("tsCrudEstado");
    const panel = document.getElementById("tsCrudModoPanel");
    const boton = document.getElementById("tsCrudGuardarBtn");
    const edicion = Boolean(ts_crudIdActual);
    if (estado) {
        estado.textContent = edicion ? `Editando ${ts_crudIdActual}` : "Nuevo registro";
        estado.className = edicion ? "badge rounded-pill text-bg-warning" : "badge rounded-pill text-bg-light border";
    }
    if (panel) panel.innerHTML = edicion
        ? '<i class="bi bi-circle-fill"></i> Edición'
        : '<i class="bi bi-circle-fill"></i> Nuevo';
    if (boton) boton.innerHTML = edicion
        ? '<i class="bi bi-save me-1"></i> Actualizar'
        : '<i class="bi bi-save me-1"></i> Guardar';
    ts_crudActualizarContador();
}

function ts_crudMigrarConfiguracionAnterior() {
    if (localStorage.getItem("tsCrudMigracionV3") === "1") return;
    const registros = ts_crudLeerRegistros();
    if (registros.length === 0) {
        try {
            const raw = localStorage.getItem("configuracionSeriesTiempo");
            if (raw) {
                const antigua = JSON.parse(raw);
                if (antigua && antigua.titulo) {
                    registros.push({
                        id: ts_crudGenerarId(),
                        creadoEn: new Date().toISOString(),
                        actualizadoEn: new Date().toISOString(),
                        titulo: { texto: antigua.titulo || "Configuración anterior", renglon: antigua["renglón"] || "1", alineacion: antigua.alineacion || "center", sangria: antigua.sangria || "0" },
                        configuracionSerie: { descripcion: "Configuración migrada desde una versión anterior", decimales: 2, tipoCifra: "", periodicidad: "", periodoInicio: "", periodoFin: "", unidad: "" },
                        seriesDatos: [], siguienteSerieId: 1,
                        notas: antigua.notas || "", fuente: antigua.fuente || "",
                        seriesLegacy: antigua.ts_series || [], datosLegacy: antigua.ts_datos || []
                    });
                    ts_crudPersistirRegistros(registros);
                }
            }
        } catch (error) {
            console.warn("No se pudo migrar la configuración anterior", error);
        }
    }
    localStorage.setItem("tsCrudMigracionV3", "1");
}

document.addEventListener("DOMContentLoaded", () => {
    ts_crudMigrarConfiguracionAnterior();
    ts_crudActualizarEstado();
});

/* =========================================================
   MODO NUEVA CONSULTA SQL
   ========================================================= */
let ts_sqlConexionActiva = false;

function ts_mostrarModoCuadros(crearNuevo = false) {
    const cuadros = document.getElementById('tsModoCuadros');
    const consulta = document.getElementById('tsModoConsulta');
    const actualizar = document.getElementById('tsCrudActualizarBtn');
    const guardar = document.getElementById('tsCrudGuardarBtn');

    cuadros?.classList.remove('d-none');
    consulta?.classList.add('d-none');
    actualizar?.classList.remove('d-none');
    guardar?.classList.remove('d-none');

    if (crearNuevo && typeof ts_crudNuevo === 'function') {
        ts_crudNuevo();
    }
}

function ts_mostrarModoConsulta() {
    const cuadros = document.getElementById('tsModoCuadros');
    const consulta = document.getElementById('tsModoConsulta');
    const actualizar = document.getElementById('tsCrudActualizarBtn');
    const guardar = document.getElementById('tsCrudGuardarBtn');

    cuadros?.classList.add('d-none');
    consulta?.classList.remove('d-none');
    actualizar?.classList.add('d-none');
    guardar?.classList.add('d-none');

    // La pantalla inicia sin una conexión validada.
    ts_sqlRestablecerEstadoConexion(false);
}

function ts_sqlRestablecerEstadoConexion(limpiarCampos = false) {
    ts_sqlConexionActiva = false;
    const estado = document.getElementById('tsSqlEstadoConexion');
    const consulta = document.getElementById('tsSqlConsulta');
    const verRegistros = document.getElementById('tsSqlVerRegistrosBtn');
    const guardarConsulta = document.getElementById('tsSqlGuardarBtn');
    const ayuda = document.getElementById('tsSqlAyuda');

    if (estado) {
        estado.textContent = 'Sin conexión';
        estado.className = 'badge text-bg-secondary';
    }
    if (consulta) consulta.disabled = true;
    if (verRegistros) verRegistros.disabled = true;
    if (guardarConsulta) guardarConsulta.disabled = true;
    if (ayuda) ayuda.textContent = 'Primero establezca la conexión.';

    if (limpiarCampos) {
        ['tsSqlNombreConexion','tsSqlServidor','tsSqlBase','tsSqlUsuario','tsSqlPassword','tsSqlConsulta']
            .forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = '';
            });
        const motor = document.getElementById('tsSqlMotor');
        const puerto = document.getElementById('tsSqlPuerto');
        if (motor) motor.value = 'sqlserver';
        if (puerto) puerto.value = '1433';
    }
}

function ts_sqlPuertoPorMotor(motor) {
    return {
        sqlserver: '1433',
        postgresql: '5432',
        mysql: '3306',
        oracle: '1521'
    }[motor] || '';
}

function ts_sqlProbarConexion() {
    const servidor = document.getElementById('tsSqlServidor')?.value.trim();
    const base = document.getElementById('tsSqlBase')?.value.trim();
    const usuario = document.getElementById('tsSqlUsuario')?.value.trim();
    const motor = document.getElementById('tsSqlMotor')?.value || 'sqlserver';
    const estado = document.getElementById('tsSqlEstadoConexion');
    const consulta = document.getElementById('tsSqlConsulta');
    const verRegistros = document.getElementById('tsSqlVerRegistrosBtn');
    const guardarConsulta = document.getElementById('tsSqlGuardarBtn');
    const ayuda = document.getElementById('tsSqlAyuda');

    if (!servidor || !base || !usuario) {
        ts_sqlConexionActiva = false;
        if (estado) {
            estado.textContent = 'Datos incompletos';
            estado.className = 'badge text-bg-danger';
        }
        if (consulta) consulta.disabled = true;
        if (verRegistros) verRegistros.disabled = true;
        if (guardarConsulta) guardarConsulta.disabled = true;
        if (ayuda) ayuda.textContent = 'Capture servidor, base de datos y usuario para continuar.';
        return;
    }

    // Prototipo front-end: la conexión real debe ejecutarse mediante una API/backend.
    ts_sqlConexionActiva = true;
    if (estado) {
        estado.textContent = `Conectado · ${motor.toUpperCase()}`;
        estado.className = 'badge text-bg-success';
    }
    if (consulta) {
        consulta.disabled = false;
        if (!consulta.value.trim()) {
            consulta.value = 'SELECT TOP 100 *\nFROM CuadrosEstadisticos\nORDER BY FechaPeriodo DESC;';
        }
        consulta.focus();
    }
    if (verRegistros) verRegistros.disabled = false;
    if (guardarConsulta) guardarConsulta.disabled = false;
    if (ayuda) ayuda.textContent = 'Conexión validada. Escriba una consulta SELECT, guárdela o visualice los registros.';
}


function ts_sqlGuardarConsulta() {
    if (!ts_sqlConexionActiva) {
        ts_sqlProbarConexion();
        if (!ts_sqlConexionActiva) return;
    }

    const sql = document.getElementById('tsSqlConsulta')?.value.trim() || '';
    const ayuda = document.getElementById('tsSqlAyuda');

    if (!sql) {
        if (ayuda) ayuda.textContent = 'Escriba una consulta SQL antes de guardarla.';
        return;
    }

    const registro = {
        id: 'SQL-' + Date.now(),
        nombre: document.getElementById('tsSqlNombreConexion')?.value.trim() || 'Consulta SQL',
        motor: document.getElementById('tsSqlMotor')?.value || 'sqlserver',
        puerto: document.getElementById('tsSqlPuerto')?.value.trim() || '',
        servidor: document.getElementById('tsSqlServidor')?.value.trim() || '',
        baseDatos: document.getElementById('tsSqlBase')?.value.trim() || '',
        usuario: document.getElementById('tsSqlUsuario')?.value.trim() || '',
        consulta: sql,
        fechaActualizacion: new Date().toISOString()
    };

    // No se guarda la contraseña en localStorage.
    const clave = 'consultasSqlGuardadas';
    let registros = [];
    try {
        registros = JSON.parse(localStorage.getItem(clave) || '[]');
        if (!Array.isArray(registros)) registros = [];
    } catch (error) {
        registros = [];
    }

    const existente = registros.findIndex(item =>
        item.nombre === registro.nombre &&
        item.servidor === registro.servidor &&
        item.baseDatos === registro.baseDatos
    );

    if (existente >= 0) {
        registro.id = registros[existente].id;
        registros[existente] = registro;
    } else {
        registros.push(registro);
    }

    localStorage.setItem(clave, JSON.stringify(registros));

    if (ayuda) {
        ayuda.textContent = existente >= 0
            ? 'Consulta SQL actualizada correctamente.'
            : 'Consulta SQL guardada correctamente.';
    }
}

function ts_sqlVerRegistros() {
    const sql = document.getElementById('tsSqlConsulta')?.value.trim() || '';
    if (!ts_sqlConexionActiva) {
        ts_sqlProbarConexion();
        if (!ts_sqlConexionActiva) return;
    }
    if (!sql) {
        const ayuda = document.getElementById('tsSqlAyuda');
        if (ayuda) ayuda.textContent = 'Escriba una consulta SQL antes de visualizar los registros.';
        return;
    }
    if (!/^\s*(select|with)\b/i.test(sql)) {
        const ayuda = document.getElementById('tsSqlAyuda');
        if (ayuda) ayuda.textContent = 'Para este prototipo utilice una consulta de lectura (SELECT o WITH).';
        return;
    }

    const datos = ts_sqlDatosDemostracion(sql);
    ts_sqlRenderizarResultado(datos);
    bootstrap.Modal.getOrCreateInstance(document.getElementById('tsSqlRegistrosModal')).show();
}

function ts_sqlDatosDemostracion(sql) {
    // Datos ficticios para representar la respuesta que entregará la futura API.
    return [
        { id: 1001, periodo: '2026-06', afore: 'Azteca', concepto: 'Recursos administrados', valor: '79,995,325.40', estatus: 'Vigente' },
        { id: 1002, periodo: '2026-06', afore: 'Banamex', concepto: 'Recursos administrados', valor: '71,650,574.12', estatus: 'Vigente' },
        { id: 1003, periodo: '2026-06', afore: 'Coppel', concepto: 'Recursos administrados por tipo', valor: '17,894,216.08', estatus: 'Vigente' },
        { id: 1004, periodo: '2026-06', afore: 'Inbursa', concepto: 'Recursos administrados por tipo', valor: '8,946,721.55', estatus: 'Vigente' },
        { id: 1005, periodo: '2026-05', afore: 'Azteca', concepto: 'Recursos administrados', valor: '79,611,694.33', estatus: 'Vigente' }
    ];
}

function ts_sqlRenderizarResultado(registros) {
    const head = document.getElementById('tsSqlResultadoHead');
    const body = document.getElementById('tsSqlResultadoBody');
    const resumen = document.getElementById('tsSqlResumenResultado');
    if (!head || !body) return;

    const columnas = registros.length ? Object.keys(registros[0]) : [];
    head.innerHTML = `<tr>${columnas.map(c => `<th>${ts_sqlEscape(c)}</th>`).join('')}</tr>`;
    body.innerHTML = registros.length
        ? registros.map(r => `<tr>${columnas.map(c => `<td>${ts_sqlEscape(r[c])}</td>`).join('')}</tr>`).join('')
        : `<tr><td colspan="${Math.max(columnas.length,1)}" class="text-center text-muted py-4">Sin registros</td></tr>`;

    if (resumen) {
        const nombre = document.getElementById('tsSqlNombreConexion')?.value.trim() || 'Conexión actual';
        resumen.textContent = `${nombre} · ${registros.length} registro${registros.length === 1 ? '' : 's'} encontrados`;
    }
}

function ts_sqlEscape(valor) {
    return String(valor ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Ajusta automáticamente el puerto al cambiar el motor.
document.addEventListener('change', function (event) {
    if (event.target?.id === 'tsSqlMotor') {
        const puerto = document.getElementById('tsSqlPuerto');
        if (puerto) puerto.value = ts_sqlPuertoPorMotor(event.target.value);
        ts_sqlRestablecerEstadoConexion(false);
    }
});

// Si se modifica cualquier parámetro después de conectar, se obliga a validar otra vez.
document.addEventListener('input', function (event) {
    if (['tsSqlServidor','tsSqlBase','tsSqlUsuario','tsSqlPassword','tsSqlPuerto'].includes(event.target?.id) && ts_sqlConexionActiva) {
        ts_sqlRestablecerEstadoConexion(false);
    }
});


// ===== MENÚ NUEVO: control propio, independiente de Bootstrap =====
function ts_toggleNuevoMenu(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const btn = document.getElementById('tsNuevoBtn');
    const menu = document.getElementById('tsNuevoMenu');
    if (!btn || !menu) return;

    const abierto = menu.classList.contains('show');
    ts_cerrarNuevoMenu();
    if (!abierto) {
        menu.classList.add('show');
        btn.setAttribute('aria-expanded', 'true');
    }
}

function ts_cerrarNuevoMenu() {
    const btn = document.getElementById('tsNuevoBtn');
    const menu = document.getElementById('tsNuevoMenu');
    if (menu) menu.classList.remove('show');
    if (btn) btn.setAttribute('aria-expanded', 'false');
}

document.addEventListener('click', function(event) {
    const contenedor = document.querySelector('#tables .ts-nuevo-dropdown');
    if (contenedor && !contenedor.contains(event.target)) {
        ts_cerrarNuevoMenu();
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') ts_cerrarNuevoMenu();
});
