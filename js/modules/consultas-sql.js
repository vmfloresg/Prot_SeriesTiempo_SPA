(function () {
    let consultaSeleccionadaId = null;

    function escapeHtml(value) {
        return String(value ?? '')
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }

    function obtenerConsultas() {
        return window.PanelWebConsultas?.listar?.() || [];
    }

    window.renderConsultasSqlPage = function renderConsultasSqlPage() {
        const body = document.getElementById('sqlUpdateBody');
        const empty = document.getElementById('sqlUpdateEmpty');
        const input = document.getElementById('sqlUpdateBuscar');
        if (!body || !empty) return;

        const q = (input?.value || '').trim().toLowerCase();
        const consultas = obtenerConsultas()
            .filter(c => !q || String(c.nombre || '').toLowerCase().includes(q))
            .sort((a,b) => String(a.nombre || '').localeCompare(String(b.nombre || ''), 'es'));

        body.innerHTML = '';
        empty.classList.toggle('d-none', consultas.length !== 0);

        consultas.forEach(consulta => {
            const tr = document.createElement('tr');
            const deshabilitada = consulta.habilitada === false;
            const seleccionada = consultaSeleccionadaId === consulta.id;
            tr.className = 'sql-update-row';
            if (deshabilitada) tr.classList.add('sql-update-disabled');
            if (seleccionada) tr.classList.add('sql-update-selected');
            tr.tabIndex = 0;
            tr.setAttribute('role','button');
            tr.setAttribute('aria-selected', seleccionada ? 'true' : 'false');
            tr.innerHTML = `
                <td>
                    <div class="fw-semibold">${escapeHtml(consulta.nombre || 'Consulta sin nombre')}</div>
                    ${deshabilitada ? '<span class="badge text-bg-secondary mt-1">Deshabilitada</span>' : ''}
                </td>
                <td class="text-nowrap"><small>${escapeHtml(consulta.fechaUltimaActualizacion || '—')}</small></td>
                <td class="text-end text-nowrap">
                    <button type="button" class="btn btn-sm ${deshabilitada ? 'btn-outline-success' : 'btn-outline-danger'} sql-update-toggle">
                        <i class="bi ${deshabilitada ? 'bi-check-circle' : 'bi-slash-circle'} me-1"></i>${deshabilitada ? 'Habilitar' : 'Deshabilitar'}
                    </button>
                </td>`;

            const abrirEdicion = () => {
                consultaSeleccionadaId = consulta.id;
                document.querySelectorAll('#sqlUpdateBody .sql-update-row').forEach(row => row.classList.remove('sql-update-selected'));
                tr.classList.add('sql-update-selected');
                tr.setAttribute('aria-selected','true');
                window.PanelWebConsultas?.editar?.(consulta.id);
            };

            tr.addEventListener('click', event => {
                if (event.target.closest('button')) return;
                abrirEdicion();
            });
            tr.addEventListener('keydown', event => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    abrirEdicion();
                }
            });
            tr.querySelector('.sql-update-toggle')?.addEventListener('click', event => {
                event.stopPropagation();
                window.PanelWebConsultas?.cambiarEstado?.(consulta.id);
                window.renderConsultasSqlPage();
            });
            body.appendChild(tr);
        });
    };

    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('sqlUpdateBuscar')?.addEventListener('input', window.renderConsultasSqlPage);
        window.renderConsultasSqlPage();
    });
})();
