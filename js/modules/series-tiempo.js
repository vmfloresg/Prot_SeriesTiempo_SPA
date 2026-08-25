
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

    ts_actualizarGrafica();

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

    /*
     * Un canvas clonado conserva la etiqueta pero no sus pixeles. Convertimos
     * la gráfica actual en una imagen para que Vista completa muestre exactamente
     * lo que el usuario está viendo en la previsualización.
     */
    const sourceCanvas = document.getElementById("timeSeriesChart");
    const clonedCanvas = clone.querySelector("canvas");

    if (sourceCanvas && clonedCanvas) {
        try {
            const chartImage = document.createElement("img");
            chartImage.className = "full-preview-chart-image";
            chartImage.alt = "Gráfica de la serie de tiempo";
            chartImage.src = sourceCanvas.toDataURL("image/png");
            clonedCanvas.replaceWith(chartImage);
        } catch (error) {
            /* Si el navegador impide serializar el canvas, se conserva el espacio. */
            clonedCanvas.classList.add("full-preview-chart-fallback");
        }
    }

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

    const configuracion = {

        titulo:
            document.getElementById(
                "chartTitle"
            ).value,

        renglón:
            document.getElementById(
                "titleRow"
            ).value,

        alineacion:
            document.getElementById(
                "titleAlignment"
            ).value,

        sangria:
            document.getElementById(
                "titleIndent"
            ).value,

        ts_series,

        ts_datos,

        notas:
            document.getElementById(
                "chartNotes"
            ).value,

        fuente:
            document.getElementById(
                "chartSource"
            ).value

    };


    localStorage.setItem(
        "configuracionSeriesTiempo",
        JSON.stringify(configuracion)
    );


    ts_mostrarMensaje(
        "Configuración guardada correctamente.",
        "success"
    );

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


    const chartContainer =
        document.querySelector(
            "#timeSeriesChart"
        )?.closest(".chart-container");


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

    if (chartContainer) {
        chartContainer.insertAdjacentElement(
            "beforebegin",
            seriesContainer
        );
    } else {
        const previewDocument = document.getElementById("previewDocument");
        if (previewDocument) {
            previewDocument.appendChild(seriesContainer);
        }
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


