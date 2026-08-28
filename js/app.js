// ========== VARIABLES GLOBALES (se declaran UNA sola vez) ==========

let usuarios = [
  { id: 1, nombre: 'admin', correo: 'admin@empresa.com', rol: 'admin', estado: 'activo', password: '1234' },
  { id: 2, nombre: 'juan.perez', correo: 'juan@empresa.com', rol: 'usuario', estado: 'activo', password: 'abc' },
  { id: 3, nombre: 'ana.lopez', correo: 'ana@empresa.com', rol: 'lector', estado: 'inactivo', password: 'xyz' }
];

const modulosSistema = [
  { id: 'home', nombre: 'Inicio', descripcion: 'Página de inicio del sistema' },
  { id: 'tables', nombre: 'Cuadros y Series', descripcion: 'Crear y gestionar cuadros y series de tiempo' },
  { id: 'sql-create', nombre: 'Consultas SQL', descripcion: 'Crear y actualizar consultas SQL' },
  { id: 'panel-web', nombre: 'Carga de archivos', descripcion: 'Carga de archivos, editor y administración integrados' },
  { id: 'publish', nombre: 'Publicación de cuadros', descripcion: 'Publicar cuadros para visualización' },
  { id: 'editor', nombre: 'Editor de páginas web', descripcion: 'Editor para crear y modificar páginas' },
  { id: 'reports', nombre: 'Consulta y generación de reportes', descripcion: 'Generar reportes en múltiples formatos' },
  { id: 'users', nombre: 'Administración de usuarios y roles', descripcion: 'Gestionar usuarios y definir roles' },
  { id: 'bitacora', nombre: 'Bitácora Interna', descripcion: 'Registro de eventos del sistema' }
];

let roles = [
  { id: 1, nombre: 'admin', descripcion: 'Administrador del sistema', permisos: { home:['R','W','Q'], upload:['R','W','Q'], tables:['R','W','Q'], 'panel-web':['R','W','Q'], publish:['R','W','Q'], editor:['R','W','Q'], reports:['R','W','Q'], users:['R','W','Q'], bitacora:['R','W','Q'] } },
  { id: 2, nombre: 'usuario', descripcion: 'Usuario normal', permisos: { home:['R'], upload:['R','W'], tables:['R','W'], 'panel-web':['R','W'], publish:['R'], editor:['R'], reports:['R','Q'], users:[], bitacora:['R'] } },
  { id: 3, nombre: 'lector', descripcion: 'Solo lectura', permisos: { home:['R'], upload:['R'], tables:['R'], 'panel-web':['R'], publish:['R'], editor:['R'], reports:['R'], users:[], bitacora:['R'] } }
];

let reportes = [
  { id: 1, nombre: 'Usuarios activos - Mayo', tipo: 'usuarios', fecha: '2026-05-28', formato: 'pdf' },
  { id: 2, nombre: 'Series de tiempo Q1', tipo: 'series', fecha: '2026-05-25', formato: 'excel' },
  { id: 3, nombre: 'Archivos cargados', tipo: 'archivos', fecha: '2026-05-20', formato: 'csv' }
];

let archivosFinancieros = [];
let archivosOperaciones = [];
let datosExtraidosSQL = [];
let cuadros = [
  { id: 1, nombre: 'Balance General Q1', tipo: 'financiero', fuente: 'financieros', fecha: '2026-05-15' },
  { id: 2, nombre: 'Ventas Mensuales', tipo: 'indicador', fuente: 'operaciones', fecha: '2026-05-20' },
  { id: 3, nombre: 'Tendencia Inventario', tipo: 'serie', fuente: 'sql', fecha: '2026-05-25' }
];
let publicados = [
  { id: 1, cuadroId: 1, nombre: 'Balance General Q1', permiso: 'publico', fecha: '2026-05-16', vistas: 156 },
  { id: 2, cuadroId: 2, nombre: 'Ventas Mensuales', permiso: 'interno', fecha: '2026-05-21', vistas: 89 }
];
let bitacora = [
  { id: 1, tipo: 'success', usuario: 'admin', evento: 'Usuario logró ingresar al sistema', fecha: '2026-06-01 10:30' },
  { id: 2, tipo: 'info', usuario: 'admin', evento: 'Cuadro "Balance General Q1" creado', fecha: '2026-06-01 10:35' },
  { id: 3, tipo: 'warning', usuario: 'juan.perez', evento: 'Archivo excedió tamaño máximo', fecha: '2026-06-01 11:00' },
  { id: 4, tipo: 'error', usuario: 'ana.lopez', evento: 'Error al conectar con SQL', fecha: '2026-06-01 11:15' },
  { id: 5, tipo: 'success', usuario: 'admin', evento: 'Cuadro "Ventas Mensuales" publicado', fecha: '2026-06-01 11:30' }
];

const loginScreen = document.getElementById('login-screen');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logoutBtn');
const viewTitle = document.getElementById('view-title');
const sidebarToggle = document.getElementById('sidebarToggle');
const floatingSidebar = document.getElementById('floatingSidebar');
const closeSidebarMobile = document.getElementById('closeSidebarMobile');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const loginError = document.getElementById('loginError');
const VALID_USER = 'admin';
const VALID_PASS = '1234';
let sidebarOpen = true;
let lastScrollY = window.scrollY;
let modalUsuario = null;
let modalRol = null;
let editandoUsuarioId = null;
let editandoRolId = null;

const tablaUsuarios = document.getElementById('tablaUsuarios');
const tablaRoles = document.getElementById('tablaRoles');
const rolUsuarioSelect = document.getElementById('rolUsuario');
const modalUsuarioEl = document.getElementById('modalUsuario');
const modalRolEl = document.getElementById('modalRol');
const modalUsuarioLabel = document.getElementById('modalUsuarioLabel');
const modalRolLabel = document.getElementById('modalRolLabel');
const formUsuario = document.getElementById('formUsuario');
const formRol = document.getElementById('formRol');
const btnGuardarUsuario = document.getElementById('btnGuardarUsuario');
const btnGuardarRol = document.getElementById('btnGuardarRol');
const passwordRequired = document.getElementById('passwordRequired');
const passwordHint = document.getElementById('passwordHint');
const tablaPermisosModulos = document.getElementById('tablaPermisosMódulos');
const btnPermisoTodos = document.getElementById('btnPermisoTodos');
const btnPermisoSoloLectura = document.getElementById('btnPermisoSoloLectura');
const btnPermisoNinguno = document.getElementById('btnPermisoNinguno');
const tablaReportes = document.getElementById('tablaReportes');
const tablaCuadros = document.getElementById('tablaCuadros');
const tablaPublicados = document.getElementById('tablaPublicados');
const cuadroPublicar = document.getElementById('cuadroPublicar');
const btnPublicarCuadro = document.getElementById('btnPublicarCuadro');
const listaBitacora = document.getElementById('listaBitacora');
const tipoEvento = document.getElementById('tipoEvento');
const usuarioEvento = document.getElementById('usuarioEvento');
const btnFiltrarBitacora = document.getElementById('btnFiltrarBitacora');
const btnLimpiarBitacora = document.getElementById('btnLimpiarBitacora');
const btnCrearCuadro = document.getElementById('btnCrearCuadro');

function initModals(){
  if(!modalUsuario && modalUsuarioEl && window.bootstrap) modalUsuario=new bootstrap.Modal(modalUsuarioEl);
  if(!modalRol && modalRolEl && window.bootstrap) modalRol=new bootstrap.Modal(modalRolEl);
}

function getCurrentUser(){
  return document.querySelector('.navbar .ms-auto span')?.textContent || 'admin';
}

function renderizarTablaUsuarios(){
  if(!tablaUsuarios) return;
  tablaUsuarios.innerHTML='';
  if(rolUsuarioSelect){
    rolUsuarioSelect.innerHTML='<option value="">Seleccione...</option>';
    roles.forEach(r=>{
      const opt=document.createElement('option');
      opt.value=r.nombre;
      opt.textContent=r.descripcion;
      rolUsuarioSelect.appendChild(opt);
    });
  }
  usuarios.forEach(u=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td><strong>${u.nombre}</strong></td><td>${u.correo}</td><td><span class="badge bg-${u.rol==='admin'?'danger':u.rol==='usuario'?'primary':'info'}">${roles.find(x=>x.nombre===u.rol)?.descripcion || u.rol}</span></td><td><span class="badge bg-${u.estado==='activo'?'success':'secondary'}">${u.estado}</span></td><td class="text-end"><button class="btn btn-sm btn-outline-primary me-1" data-accion="editar" data-id="${u.id}"><i class="bi bi-pencil"></i></button><button class="btn btn-sm btn-outline-danger" data-accion="eliminar" data-id="${u.id}"><i class="bi bi-trash"></i></button></td>`;
    tablaUsuarios.appendChild(tr);
  });
  tablaUsuarios.querySelectorAll('button[data-accion]').forEach(btn=>btn.addEventListener('click',()=>{
    const a=btn.getAttribute('data-accion');
    const id=+btn.getAttribute('data-id');
    if(a==='editar') editarUsuario(id);
    if(a==='eliminar') eliminarUsuario(id);
  }));
}

function editarUsuario(id){
  const u=usuarios.find(x=>x.id===id);
  if(!u) return;
  editandoUsuarioId=u.id;
  modalUsuarioLabel.textContent='Editar usuario';
  document.getElementById('userId').value=u.id;
  document.getElementById('nombreUsuario').value=u.nombre;
  document.getElementById('correoUsuario').value=u.correo;
  document.getElementById('rolUsuario').value=u.rol;
  document.getElementById('estadoUsuario').value=u.estado;
  document.getElementById('passwordUsuario').value='';
  passwordRequired.style.display='none';
  passwordHint.textContent='Deje en blanco para mantener la contraseña actual';
  modalUsuario?.show();
}

function eliminarUsuario(id){
  const u=usuarios.find(x=>x.id===id);
  if(!u) return;
  if(confirm(`¿Eliminar usuario "${u.nombre}"?`)){
    usuarios=usuarios.filter(x=>x.id!==id);
    renderizarTablaUsuarios();
  }
}

btnGuardarUsuario?.addEventListener('click',()=>{
  const nombre=document.getElementById('nombreUsuario').value.trim();
  const correo=document.getElementById('correoUsuario').value.trim();
  const rol=document.getElementById('rolUsuario').value;
  const estado=document.getElementById('estadoUsuario').value;
  const password=document.getElementById('passwordUsuario').value;

  if(!nombre||!correo||!rol) return alert('Complete los campos obligatorios');
  if(!editandoUsuarioId && !password) return alert('Ingrese contraseña para nuevo usuario');

  if(editandoUsuarioId){
    const u=usuarios.find(x=>x.id===editandoUsuarioId);
    if(u){
      u.nombre=nombre;
      u.correo=correo;
      u.rol=rol;
      u.estado=estado;
      if(password) u.password=password;
    }
  } else {
    usuarios.push({ id: Date.now(), nombre, correo, rol, estado, password: password || 'changeme' });
  }

  renderizarTablaUsuarios();
  modalUsuario?.hide();
  resetFormularioUsuario();
});

function resetFormularioUsuario(){
  formUsuario?.reset();
  editandoUsuarioId=null;
  modalUsuarioLabel.textContent='Nuevo usuario';
  passwordRequired.style.display='';
  passwordHint.textContent='Solo si es nuevo o quiere cambiarla';
}

function renderizarTablaPermisosModulos() {
  if (!tablaPermisosModulos) return;
  tablaPermisosModulos.innerHTML = '';

  modulosSistema.forEach(mod => {
    const tr = document.createElement('tr');

    const tdNombre = document.createElement('td');
    tdNombre.innerHTML = `<strong>${mod.nombre}</strong><br><small class="text-muted">${mod.descripcion}</small>`;
    tr.appendChild(tdNombre);

    const permisosActuales = editandoRolId
      ? (roles.find(x => x.id === editandoRolId)?.permisos?.[mod.id] || [])
      : [];

    const tdHabilitado = document.createElement('td');
    tdHabilitado.className = 'text-center';

    const chk = document.createElement('input');
    chk.type = 'checkbox';
    chk.className = 'form-check-input perm-habilitado';
    chk.id = `perm_${mod.id}`;
    chk.dataset.modulo = mod.id;
    chk.checked = permisosActuales.includes('H');

    tdHabilitado.appendChild(chk);
    tr.appendChild(tdHabilitado);

    tablaPermisosModulos.appendChild(tr);
  });
}

function contarUsuariosPorRol(rolNombre){
  return usuarios.filter(u=>u.rol===rolNombre).length;
}

function obtenerPermisosTexto(permisosObj) {
  let modulosHabilitados = 0;

  modulosSistema.forEach(mod => {
    const perms = permisosObj[mod.id] || [];
    if (perms.includes('H')) {
      modulosHabilitados++;
    }
  });

  if (modulosHabilitados === 0) return 'Sin permisos';
  if (modulosHabilitados === modulosSistema.length) return 'Todos habilitados';

  return `${modulosHabilitados} módulos habilitados`;
}

function renderizarTablaRoles(){
  if(!tablaRoles) return;
  tablaRoles.innerHTML='';
  roles.forEach(r=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td><strong>${r.descripcion}</strong><br><small class="text-muted">${r.nombre}</small></td><td>${r.descripcion}</td><td><span class="badge bg-secondary">${obtenerPermisosTexto(r.permisos)}</span></td><td><span class="badge bg-info">${contarUsuariosPorRol(r.nombre)} usuario(s)</span></td><td class="text-end"><button class="btn btn-sm btn-outline-primary me-1" data-accion="editar-rol" data-id="${r.id}"><i class="bi bi-pencil"></i></button><button class="btn btn-sm btn-outline-danger" data-accion="eliminar-rol" data-id="${r.id}"><i class="bi bi-trash"></i></button></td>`;
    tablaRoles.appendChild(tr);
  });
  tablaRoles.querySelectorAll('button[data-accion]').forEach(btn=>btn.addEventListener('click',()=>{
    const accion=btn.getAttribute('data-accion');
    const id=+btn.getAttribute('data-id');
    if(accion==='editar-rol') editarRol(id);
    if(accion==='eliminar-rol') eliminarRol(id);
  }));
}

function editarRol(id){
  const r=roles.find(x=>x.id===id);
  if(!r) return;
  editandoRolId=r.id;
  modalRolLabel.textContent='Editar rol';
  document.getElementById('rolId').value=r.id;
  document.getElementById('nombreRol').value=r.nombre;
  document.getElementById('descripcionRol').value=r.descripcion;
  renderizarTablaPermisosModulos();
  modalRol?.show();
}

function eliminarRol(id){
  const r=roles.find(x=>x.id===id);
  if(!r) return;
  const usuariosConRol=contarUsuariosPorRol(r.nombre);
  if(usuariosConRol>0) return alert(`No se puede eliminar. Hay ${usuariosConRol} usuario(s) con este rol.`);
  if(confirm(`¿Eliminar rol "${r.descripcion}"?`)){
    roles=roles.filter(x=>x.id!==id);
    renderizarTablaRoles();
    renderizarTablaUsuarios();
  }
}

btnGuardarRol?.addEventListener('click', () => {
  const nombre = document.getElementById('nombreRol').value.trim();
  const descripcion = document.getElementById('descripcionRol').value.trim();

  if (!nombre || !descripcion) {
    alert('Complete los campos obligatorios');
    return;
  }

  const permisosRecopilados = {};
  modulosSistema.forEach(mod => {
    const chk = document.getElementById(`perm_${mod.id}`);
    permisosRecopilados[mod.id] = chk && chk.checked ? ['H'] : [];
  });

  if (editandoRolId) {
    const r = roles.find(x => x.id === editandoRolId);
    if (r) {
      r.nombre = nombre;
      r.descripcion = descripcion;
      r.permisos = permisosRecopilados;
    }
  } else {
    if (roles.some(x => x.nombre === nombre)) {
      alert('Ya existe un rol con ese nombre');
      return;
    }

    roles.push({
      id: Date.now(),
      nombre,
      descripcion,
      permisos: permisosRecopilados
    });
  }

  renderizarTablaRoles();
  renderizarTablaUsuarios();
  modalRol?.hide();
  resetFormularioRol();
});

function resetFormularioRol() {
  formRol?.reset();
  editandoRolId = null;
  modalRolLabel.textContent = 'Nuevo rol';
  renderizarTablaPermisosModulos();
}

if(btnPermisoTodos) btnPermisoTodos.addEventListener('click',()=>{
  modulosSistema.forEach(mod=>{
    ['R','W','Q'].forEach(code=>{
      const chk=document.getElementById(`perm_${code}_${mod.id}`);
      if(chk) chk.checked=true;
    });
    const t=document.getElementById(`todos_${mod.id}`);
    if(t) t.checked=true;
  });
});

if(btnPermisoSoloLectura) btnPermisoSoloLectura.addEventListener('click',()=>{
  modulosSistema.forEach(mod=>{
    const r=document.getElementById(`perm_R_${mod.id}`);
    const w=document.getElementById(`perm_W_${mod.id}`);
    const q=document.getElementById(`perm_Q_${mod.id}`);
    const t=document.getElementById(`todos_${mod.id}`);
    if(r) r.checked=true;
    if(w) w.checked=false;
    if(q) q.checked=false;
    if(t) t.checked=false;
  });
});

if(btnPermisoNinguno) btnPermisoNinguno.addEventListener('click',()=>{
  modulosSistema.forEach(mod=>{
    ['R','W','Q'].forEach(code=>{
      const chk=document.getElementById(`perm_${code}_${mod.id}`);
      if(chk) chk.checked=false;
    });
    const t=document.getElementById(`todos_${mod.id}`);
    if(t) t.checked=false;
  });
});

const tiposReporte = { usuarios:'Reporte de Usuarios', series:'Series de Tiempo', archivos:'Carga de Archivos', roles:'Roles y Permisos', personalizado:'Personalizado' };
const formatosIconos = { pdf:'bi-filetype-pdf text-danger', excel:'bi-filetype-xlsx text-success', csv:'bi-filetype-csv text-primary', html:'bi-filetype-html text-info' };

function renderizarTablaReportes(){
  if(!tablaReportes) return;
  tablaReportes.innerHTML='';
  reportes.forEach(r=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td><strong>${r.nombre}</strong></td><td><span class="badge bg-info">${tiposReporte[r.tipo]}</span></td><td>${r.fecha}</td><td><i class="bi ${formatosIconos[r.formato]} fs-5"></i> <small>${r.formato.toUpperCase()}</small></td><td class="text-end"><button class="btn btn-sm btn-outline-primary me-1" data-accion="ver" data-id="${r.id}"><i class="bi bi-eye"></i></button><button class="btn btn-sm btn-outline-success me-1" data-accion="descargar" data-id="${r.id}"><i class="bi bi-download"></i></button><button class="btn btn-sm btn-outline-danger" data-accion="eliminar" data-id="${r.id}"><i class="bi bi-trash"></i></button></td>`;
    tablaReportes.appendChild(tr);
  });
}

function renderizarTablaCuadros(){
  if(!tablaCuadros) return;
  tablaCuadros.innerHTML='';
  cuadros.forEach(c=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td><strong>${c.nombre}</strong></td><td><span class="badge bg-info">${c.tipo}</span></td><td><span class="badge bg-secondary">${c.fuente}</span></td><td>${c.fecha}</td><td class="text-end"><button class="btn btn-sm btn-outline-danger" data-accion="eliminar-cuadro" data-id="${c.id}"><i class="bi bi-trash"></i></button></td>`;
    tablaCuadros.appendChild(tr);
  });
}

function renderizarTablaPublicados(){
  if(!tablaPublicados) return;
  tablaPublicados.innerHTML='';
  publicados.forEach(p=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td><strong>${p.nombre}</strong></td><td><span class="badge bg-${p.permiso==='publico'?'success':p.permiso==='interno'?'warning':'danger'}">${p.permiso}</span></td><td>${p.fecha}</td><td>${p.vistas}</td><td class="text-end"><button class="btn btn-sm btn-outline-danger" data-accion="despublicar" data-id="${p.id}"><i class="bi bi-x-circle"></i></button></td>`;
    tablaPublicados.appendChild(tr);
  });
}

function actualizarSelectCuadroPublicar(){
  if(!cuadroPublicar) return;
  cuadroPublicar.innerHTML='<option value="">Seleccione cuadro...</option>';
  cuadros.forEach(c=>{
    const opt=document.createElement('option');
    opt.value=c.id;
    opt.textContent=c.nombre;
    cuadroPublicar.appendChild(opt);
  });
}

btnCrearCuadro?.addEventListener('click',()=>{
  const tipo=document.getElementById('tipoCuadro')?.value;
  const fuente=document.getElementById('fuenteCuadro')?.value;
  if(!tipo||!fuente) return alert('Seleccione tipo y fuente');
  const nombre=`Cuadro ${tipo} - ${fuente}`;
  cuadros.push({ id: Date.now(), nombre, tipo, fuente, fecha: new Date().toISOString().split('T')[0] });
  renderizarTablaCuadros();
  actualizarSelectCuadroPublicar();
  registrarEvento('success', getCurrentUser(), `Cuadro "${nombre}" creado`);
});

btnPublicarCuadro?.addEventListener('click',()=>{
  const cuadroId=+cuadroPublicar.value;
  const permiso=document.getElementById('permisoPublicar')?.value;
  if(!cuadroId) return alert('Seleccione cuadro');
  const c=cuadros.find(x=>x.id===cuadroId);
  if(!c) return;
  publicados.push({ id: Date.now(), cuadroId, nombre:c.nombre, permiso, fecha:new Date().toISOString().split('T')[0], vistas:0 });
  renderizarTablaPublicados();
  registrarEvento('success', getCurrentUser(), `Cuadro "${c.nombre}" publicado`);
});

function renderizarBitacora(filtro=null){
  if(!listaBitacora) return;
  listaBitacora.innerHTML='';
  const eventos=filtro ? bitacora.filter(filtro) : bitacora;
  eventos.forEach(e=>{
    const div=document.createElement('div');
    div.className=`list-group-item bitacora-item bitacora-${e.tipo}`;
    div.innerHTML=`<div class="d-flex w-100 justify-content-between"><div><i class="bi bi-${e.tipo==='success'?'check-circle':e.tipo==='error'?'x-circle':e.tipo==='warning'?'exclamation-circle':'info-circle'} me-2"></i><strong>${e.evento}</strong></div><small class="text-muted">${e.fecha}</small></div><small class="text-muted">Usuario: ${e.usuario}</small>`;
    listaBitacora.appendChild(div);
  });
}

function actualizarSelectUsuario(){
  if(!usuarioEvento) return;
  usuarioEvento.innerHTML='<option value="">Todos</option>';
  [...new Set(bitacora.map(b=>b.usuario))].forEach(u=>{
    const opt=document.createElement('option');
    opt.value=u;
    opt.textContent=u;
    usuarioEvento.appendChild(opt);
  });
}

function registrarEvento(tipo, usuario, evento){
  bitacora.push({ id: Date.now(), tipo, usuario, evento, fecha: new Date().toLocaleString('es-MX') });
  renderizarBitacora();
}

btnFiltrarBitacora?.addEventListener('click',()=>{
  const tipo=tipoEvento?.value;
  const usuario=usuarioEvento?.value;
  renderizarBitacora(e=>(!tipo||e.tipo===tipo)&&(!usuario||e.usuario===usuario));
});

btnLimpiarBitacora?.addEventListener('click',()=>{
  if(confirm('¿Eliminar toda la bitácora?')){
    bitacora=[];
    renderizarBitacora();
  }
});

function setupDragDrop(dropzone, fileInput, selectBtn, fileList, uploadBtn, clearBtn, statusEl, archivosArray){
  if(!dropzone||!fileInput||!selectBtn||!fileList||!uploadBtn||!clearBtn||!statusEl) return;
  ['dragenter','dragover'].forEach(ev=>dropzone.addEventListener(ev,e=>{ e.preventDefault(); e.stopPropagation(); dropzone.classList.add('hover'); }));
  ['dragleave','drop'].forEach(ev=>dropzone.addEventListener(ev,e=>{ e.preventDefault(); e.stopPropagation(); dropzone.classList.remove('hover'); }));
  dropzone.addEventListener('drop',e=>handleFilesCarga(Array.from(e.dataTransfer.files), archivosArray, fileList, statusEl));
  selectBtn.addEventListener('click',()=>fileInput.click());
  fileInput.addEventListener('change',e=>handleFilesCarga(Array.from(e.target.files), archivosArray, fileList, statusEl));
  uploadBtn.addEventListener('click',async()=>{
    if(archivosArray.length===0) return statusEl.textContent='No hay archivos seleccionados.';
    statusEl.textContent='Subiendo... (simulado)';
    await new Promise(r=>setTimeout(r,500));
    statusEl.textContent=`Se subieron ${archivosArray.length} archivo(s) correctamente.`;
    archivosArray.length=0;
    renderFileListCarga(fileList, archivosArray);
  });
  clearBtn.addEventListener('click',()=>{
    archivosArray.length=0;
    renderFileListCarga(fileList, archivosArray);
    statusEl.textContent='';
  });
}

function handleFilesCarga(selected, archivosArray, fileList){
  selected.forEach(f=>{
    if(f.size<=50*1024*1024) archivosArray.push(f);
  });
  renderFileListCarga(fileList, archivosArray);
}

function renderFileListCarga(fileList, archivosArray){
  fileList.innerHTML='';
  archivosArray.forEach((f,idx)=>{
    const li=document.createElement('li');
    li.className='list-group-item';
    li.innerHTML=`<div class="me-2"><strong>${f.name}</strong> <small class="text-muted">(${Math.round(f.size/1024)} KB)</small></div><div><button class="btn btn-sm btn-outline-danger" data-idx="${idx}">Eliminar</button></div>`;
    fileList.appendChild(li);
  });
  fileList.querySelectorAll('button[data-idx]').forEach(btn=>btn.addEventListener('click',()=>{
    archivosArray.splice(+btn.getAttribute('data-idx'),1);
    renderFileListCarga(fileList, archivosArray);
  }));
}

function initScrollBehavior(){ window.addEventListener('scroll', onScroll, { passive:true }); }
function removeScrollBehavior(){ window.removeEventListener('scroll', onScroll); }
function onScroll(){
  const currentScrollY=window.scrollY;
  const delta=currentScrollY-lastScrollY;
  if(window.innerWidth>=992){
    if(delta>10 && !floatingSidebar.classList.contains('hidden-by-scroll')){
      floatingSidebar.classList.add('hidden-by-scroll');
      sidebarOpen=false;
    } else if(delta<-10 && floatingSidebar.classList.contains('hidden-by-scroll')){
      floatingSidebar.classList.remove('hidden-by-scroll');
      sidebarOpen=true;
    }
  }
  lastScrollY=currentScrollY;
}

loginForm?.addEventListener('submit',(e)=>{
  e.preventDefault();
  const username=document.getElementById('username').value.trim();
  const password=document.getElementById('password').value;
  loginError?.classList.add('d-none');
  if(username===VALID_USER && password===VALID_PASS){
    loginScreen?.classList.add('d-none');
    dashboard?.classList.remove('d-none');
    const userSpan=document.querySelector('.navbar .ms-auto span');
    if(userSpan) userSpan.textContent=username || 'Admin';
    showView('home');
    sidebarOpen=true;
    floatingSidebar?.classList.remove('closed');
    if(floatingSidebar) floatingSidebar.style.transform='translateX(0)';
    if(window.innerWidth<992) sidebarOverlay?.classList.add('show');
    initScrollBehavior();
    initModals();
  } else {
    loginError?.classList.remove('d-none');
  }
});

logoutBtn?.addEventListener('click',()=>{
  dashboard?.classList.add('d-none');
  loginScreen?.classList.remove('d-none');
  document.getElementById('username').value='';
  document.getElementById('password').value='';
  loginError?.classList.add('d-none');
  removeScrollBehavior();
});

sidebarToggle?.addEventListener('click',()=>{
  if(window.innerWidth>=992){
    sidebarOpen=!sidebarOpen;
    floatingSidebar?.classList.toggle('closed', !sidebarOpen);
  } else toggleSidebarMobile();
});
closeSidebarMobile?.addEventListener('click', closeSidebar);
sidebarOverlay?.addEventListener('click', closeSidebar);

function toggleSidebarMobile(){
  if(!sidebarOverlay || !floatingSidebar) return;
  const isOpen=!sidebarOverlay.classList.contains('show');
  if(isOpen){
    sidebarOverlay.classList.add('show');
    floatingSidebar.style.transform='translateX(0)';
    floatingSidebar.classList.remove('closed');
  } else closeSidebar();
}
function closeSidebar(){
  sidebarOverlay?.classList.remove('show');
  if(floatingSidebar){
    floatingSidebar.style.transform='translateX(-320px)';
    floatingSidebar.classList.add('closed');
  }
}


function toggleCuadrosSeriesSubmenu(event){
  event?.preventDefault();
  event?.stopPropagation();
  const menu=document.getElementById('cuadrosSeriesSubmenu');
  const btn=document.getElementById('cuadrosSeriesMenuBtn');
  if(!menu || !btn) return;
  const abrir=menu.classList.contains('d-none');
  menu.classList.toggle('d-none', !abrir);
  btn.setAttribute('aria-expanded', abrir ? 'true' : 'false');
  btn.classList.toggle('submenu-open', abrir);
}

function toggleConsultasSqlSubmenu(event){
  event?.preventDefault();
  event?.stopPropagation();
  const menu=document.getElementById('consultasSqlSubmenu');
  const btn=document.getElementById('consultasSqlMenuBtn');
  if(!menu || !btn) return;
  const abrir=menu.classList.contains('d-none');
  menu.classList.toggle('d-none', !abrir);
  btn.setAttribute('aria-expanded', abrir ? 'true' : 'false');
  btn.classList.toggle('submenu-open', abrir);
}

document.querySelectorAll('[data-view]').forEach(a=>a.addEventListener('click',e=>{
  e.preventDefault();
  const target=a.getAttribute('data-view');
  showView(target);
  document.querySelectorAll('.sidebar-nav .nav-link').forEach(l=>l.classList.remove('active'));
  a.classList.add('active');
  if(a.getAttribute('data-submenu') === 'cuadros-series'){
    const submenu=document.getElementById('cuadrosSeriesSubmenu');
    const btn=document.getElementById('cuadrosSeriesMenuBtn');
    submenu?.classList.remove('d-none');
    btn?.setAttribute('aria-expanded','true');
    btn?.classList.add('submenu-open');
  }
  if(a.getAttribute('data-submenu') === 'consultas-sql'){
    const submenu=document.getElementById('consultasSqlSubmenu');
    const btn=document.getElementById('consultasSqlMenuBtn');
    submenu?.classList.remove('d-none');
    btn?.setAttribute('aria-expanded','true');
    btn?.classList.add('submenu-open');
  }
  if(window.innerWidth<992) closeSidebar();
}));

function showView(view){
  document.querySelectorAll('.app-view').forEach(v=>v.classList.add('d-none'));
  if(!view) view='home';
  const vistaElement=document.getElementById(view);
  if(!vistaElement) return;
  vistaElement.classList.remove('d-none');

  // En Creación de cuadros y series, el acordeón siempre inicia colapsado
  // cada vez que el usuario entra desde el menú principal.
  if(view === 'tables') {
    // Al entrar desde el menú principal se muestra siempre el constructor de cuadros.
    // La pantalla de consulta SQL solo se activa desde Nuevo > Crear nueva consulta.
    if (typeof window.ts_mostrarModoCuadros === 'function') {
      window.ts_mostrarModoCuadros(false);
    } else if (typeof ts_mostrarModoCuadros === 'function') {
      ts_mostrarModoCuadros(false);
    }

    const accordion = vistaElement.querySelector('#configurationAccordion');
    if(accordion) {
      accordion.querySelectorAll('.accordion-collapse').forEach(panel => {
        const instance = window.bootstrap?.Collapse?.getInstance(panel);
        if(instance) instance.hide();
        panel.classList.remove('show');
      });
      accordion.querySelectorAll('.accordion-button').forEach(button => {
        button.classList.add('collapsed');
        button.setAttribute('aria-expanded', 'false');
      });
    }
  }

  if(view === 'tables-update') {
    if (typeof window.ts_crudPrepararPaginaActualizacion === 'function') {
      window.ts_crudPrepararPaginaActualizacion();
    } else if (typeof ts_crudPrepararPaginaActualizacion === 'function') {
      ts_crudPrepararPaginaActualizacion();
    }
  }

  if(view === 'sql-create') {
    if (typeof window.ts_sqlRestablecerEstadoConexion === 'function') {
      window.ts_sqlRestablecerEstadoConexion(false);
    } else if (typeof ts_sqlRestablecerEstadoConexion === 'function') {
      ts_sqlRestablecerEstadoConexion(false);
    }
  }

  if(view === 'sql-update') {
    window.renderConsultasSqlPage?.();
  }

  const titleMap={
    home:'Inicio',
    upload:'Carga de archivos',
    tables:'Cuadros y Series - Crear',
    'tables-update':'Cuadros y Series - Actualizar',
    'sql-create':'Consultas SQL - Crear Consulta',
    'sql-update':'Consultas SQL - Actualizar consulta',
    'panel-web':'Carga de archivos',
    publish:'Publicación de cuadros',
    editor:'Editor de páginas web',
    reports:'Consulta y generación de reportes',
    users:'Administración de usuarios y roles',
    bitacora:'Bitácora Interna'
  };
  if(viewTitle){
    const t=viewTitle.querySelector('h3');
    const p=viewTitle.querySelector('p');
    if(t) t.textContent=titleMap[view] || 'Vista';
    if(p) p.textContent=view==='home' ? 'Bienvenido al sistema.' : 'Área para ' + titleMap[view] + '.';
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  initModals();
  renderizarTablaUsuarios();
  renderizarTablaRoles();
  renderizarTablaReportes();
  renderizarTablaCuadros();
  renderizarTablaPublicados();
  actualizarSelectCuadroPublicar();
  renderizarBitacora();
  actualizarSelectUsuario();
  setupDragDrop(document.getElementById('dropzoneFinancieros'), document.getElementById('fileInputFinancieros'), document.getElementById('selectFilesFinancieros'), document.getElementById('fileListFinancieros'), document.getElementById('uploadBtnFinancieros'), document.getElementById('clearBtnFinancieros'), document.getElementById('uploadStatusFinancieros'), archivosFinancieros);
  setupDragDrop(document.getElementById('dropzoneOperaciones'), document.getElementById('fileInputOperaciones'), document.getElementById('selectFilesOperaciones'), document.getElementById('fileListOperaciones'), document.getElementById('uploadBtnOperaciones'), document.getElementById('clearBtnOperaciones'), document.getElementById('uploadStatusOperaciones'), archivosOperaciones);
  document.querySelector('[data-view="users"]')?.addEventListener('click',()=>{
    renderizarTablaUsuarios();
    renderizarTablaRoles();
    renderizarTablaPermisosModulos();
  });
  document.querySelector('[data-view="tables"]')?.addEventListener('click',()=>renderizarTablaCuadros());
  document.querySelector('[data-view="publish"]')?.addEventListener('click',()=>{
    renderizarTablaPublicados();
    actualizarSelectCuadroPublicar();
  });
  document.querySelector('[data-view="bitacora"]')?.addEventListener('click',()=>{
    renderizarBitacora();
    actualizarSelectUsuario();
  });
  document.querySelector('[data-view="reports"]')?.addEventListener('click',()=>renderizarTablaReportes());
});