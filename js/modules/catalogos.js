(function(){
  const STORAGE_KEY='consar_catalogos_v1';
  const definiciones={
    'tipo-cifra':{titulo:'Tipo de cifra', singular:'tipo de cifra', semillas:[
      {id:1,clave:'MON',nombre:'Moneda',descripcion:'Valores expresados como importes monetarios.',estado:'activo'},
      {id:2,clave:'PORC',nombre:'Porcentaje',descripcion:'Valores expresados en porcentaje.',estado:'activo'},
      {id:3,clave:'NUM',nombre:'Número',descripcion:'Valores numéricos sin unidad monetaria.',estado:'activo'},
      {id:4,clave:'IND',nombre:'Índice',descripcion:'Valores representados mediante índices estadísticos.',estado:'activo'}]},
    'periodicidad':{titulo:'Periodicidad', singular:'periodicidad', semillas:[
      {id:1,clave:'MENS',nombre:'Mensual',descripcion:'Información actualizada cada mes.',estado:'activo'},
      {id:2,clave:'BIM',nombre:'Bimestral',descripcion:'Información actualizada cada dos meses.',estado:'activo'},
      {id:3,clave:'TRIM',nombre:'Trimestral',descripcion:'Información actualizada cada tres meses.',estado:'activo'},
      {id:4,clave:'SEM',nombre:'Semestral',descripcion:'Información actualizada cada seis meses.',estado:'activo'},
      {id:5,clave:'ANUAL',nombre:'Anual',descripcion:'Información actualizada una vez al año.',estado:'activo'}]},
    'unidad-medida':{titulo:'Unidad de Medida', singular:'unidad de medida', semillas:[
      {id:1,clave:'MXN',nombre:'Pesos',descripcion:'Pesos mexicanos.',estado:'activo'},
      {id:2,clave:'MDP',nombre:'Millones de pesos',descripcion:'Importes expresados en millones de pesos.',estado:'activo'},
      {id:3,clave:'PCT',nombre:'Porcentaje',descripcion:'Proporción expresada como porcentaje.',estado:'activo'},
      {id:4,clave:'PERS',nombre:'Personas',descripcion:'Cantidad de personas.',estado:'activo'},
      {id:5,clave:'CTAS',nombre:'Cuentas',descripcion:'Cantidad de cuentas registradas.',estado:'activo'}]},
    'afore':{titulo:'AFORE', singular:'AFORE', semillas:[
      {id:1,clave:'AZT',nombre:'Azteca',descripcion:'Administradora de fondos para el retiro.',estado:'activo'},
      {id:2,clave:'BAN',nombre:'Banamex',descripcion:'Administradora de fondos para el retiro.',estado:'activo'},
      {id:3,clave:'COP',nombre:'Coppel',descripcion:'Administradora de fondos para el retiro.',estado:'activo'},
      {id:4,clave:'INB',nombre:'Inbursa',descripcion:'Administradora de fondos para el retiro.',estado:'activo'},
      {id:5,clave:'INV',nombre:'Invercap',descripcion:'Administradora de fondos para el retiro.',estado:'activo'},
      {id:6,clave:'PISS',nombre:'PensionISSSTE',descripcion:'Administradora de fondos para el retiro.',estado:'activo'},
      {id:7,clave:'PRI',nombre:'Principal',descripcion:'Administradora de fondos para el retiro.',estado:'activo'},
      {id:8,clave:'PRO',nombre:'Profuturo',descripcion:'Administradora de fondos para el retiro.',estado:'activo'},
      {id:9,clave:'SUR',nombre:'SURA',descripcion:'Administradora de fondos para el retiro.',estado:'activo'},
      {id:10,clave:'XXI',nombre:'XXI Banorte',descripcion:'Administradora de fondos para el retiro.',estado:'activo'}]},
    'sector':{titulo:'Sector', singular:'sector', semillas:[
      {id:1,clave:'PUB',nombre:'Público',descripcion:'Sector público.',estado:'activo'},
      {id:2,clave:'EST',nombre:'Estadística',descripcion:'Sector de estadística.',estado:'activo'},
      {id:3,clave:'OPE',nombre:'Operaciones',descripcion:'Sector de operaciones.',estado:'activo'},
      {id:4,clave:'INF',nombre:'Informática',descripcion:'Sector de informática.',estado:'activo'}]},
    'unidad-administrativa':{titulo:'Unidades administrativas', singular:'unidad administrativa', semillas:[
      {id:1,clave:'PRE',nombre:'Presidencia',descripcion:'Presidencia.',estado:'activo'},
      {id:2,clave:'VJ',nombre:'Vicepresidencia Jurídica',descripcion:'Vicepresidencia Jurídica.',estado:'activo'},
      {id:3,clave:'VO',nombre:'Vicepresidencia de Operaciones',descripcion:'Vicepresidencia de Operaciones.',estado:'activo'}]}
  };
  let datos=cargar();
  let modal=null;

  function clonar(x){return JSON.parse(JSON.stringify(x));}
  function cargar(){
    let base={};
    try{
      const raw=localStorage.getItem(STORAGE_KEY);
      if(raw){const parsed=JSON.parse(raw); if(parsed && typeof parsed==='object') base=parsed;}
    }catch(e){}
    Object.entries(definiciones).forEach(([k,d])=>{
      if(!Array.isArray(base[k])) base[k]=clonar(d.semillas);
    });
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(base));}catch(e){}
    return base;
  }
  function guardar(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(datos));}catch(e){}}
  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
  function porVista(view){return {
    'catalogo-tipo-cifra':'tipo-cifra',
    'catalogo-periodicidad':'periodicidad',
    'catalogo-unidad-medida':'unidad-medida',
    'catalogo-afore':'afore',
    'catalogo-sector':'sector',
    'catalogo-unidad-administrativa':'unidad-administrativa'
  }[view];}
  function render(tipo){
    if(!definiciones[tipo]) return;
    const body=document.getElementById('catalogoBody-'+tipo), empty=document.getElementById('catalogoEmpty-'+tipo), buscar=document.getElementById('catalogoBuscar-'+tipo);
    if(!body||!empty)return;
    const q=(buscar?.value||'').trim().toLowerCase();
    const rows=(datos[tipo]||[]).filter(r=>!q || [r.clave,r.nombre,r.descripcion].some(v=>String(v||'').toLowerCase().includes(q))).sort((a,b)=>String(a.nombre).localeCompare(String(b.nombre),'es'));
    body.innerHTML=''; empty.classList.toggle('d-none',rows.length>0);
    rows.forEach(r=>{
      const tr=document.createElement('tr');
      tr.innerHTML=`<td><span class="catalogo-clave">${esc(r.clave)}</span></td><td><div class="fw-semibold">${esc(r.nombre)}</div></td><td><span class="text-muted">${esc(r.descripcion||'—')}</span></td><td><span class="badge ${r.estado==='activo'?'text-bg-success':'text-bg-secondary'}">${r.estado==='activo'?'Activo':'Inactivo'}</span></td><td class="text-end text-nowrap"><button class="btn btn-sm btn-outline-primary me-1" data-cat-edit="${tipo}" data-id="${r.id}"><i class="bi bi-pencil me-1"></i>Editar</button><button class="btn btn-sm btn-outline-danger" data-cat-delete="${tipo}" data-id="${r.id}"><i class="bi bi-trash me-1"></i>Eliminar</button></td>`;
      body.appendChild(tr);
    });
  }
  function abrir(tipo,id=null){
    const d=definiciones[tipo]; if(!d)return;
    const r=id!=null?(datos[tipo]||[]).find(x=>String(x.id)===String(id)):null;
    document.getElementById('catalogoModalTipo').value=tipo;
    document.getElementById('catalogoModalId').value=r?.id??'';
    document.getElementById('catalogoModalTitulo').textContent=r?`Editar ${d.singular}`:`Nuevo ${d.singular}`;
    document.getElementById('catalogoClave').value=r?.clave??'';
    document.getElementById('catalogoNombre').value=r?.nombre??'';
    document.getElementById('catalogoDescripcion').value=r?.descripcion??'';
    document.getElementById('catalogoEstado').value=r?.estado??'activo';
    document.getElementById('catalogoModalError').classList.add('d-none');
    modal=modal||new bootstrap.Modal(document.getElementById('catalogoCrudModal')); modal.show();
  }
  function salvar(){
    const tipo=document.getElementById('catalogoModalTipo').value, id=document.getElementById('catalogoModalId').value;
    const clave=document.getElementById('catalogoClave').value.trim().toUpperCase(), nombre=document.getElementById('catalogoNombre').value.trim(), descripcion=document.getElementById('catalogoDescripcion').value.trim(), estado=document.getElementById('catalogoEstado').value;
    const error=document.getElementById('catalogoModalError');
    if(!clave||!nombre){error.textContent='Capture la clave y el nombre del registro.'; error.classList.remove('d-none'); return;}
    const duplicado=(datos[tipo]||[]).some(r=>r.clave.toLowerCase()===clave.toLowerCase() && String(r.id)!==String(id));
    if(duplicado){error.textContent='Ya existe un registro con esa clave.'; error.classList.remove('d-none'); return;}
    if(id){const idx=datos[tipo].findIndex(r=>String(r.id)===String(id)); if(idx>=0) datos[tipo][idx]={...datos[tipo][idx],clave,nombre,descripcion,estado};}
    else {const next=Math.max(0,...(datos[tipo]||[]).map(r=>Number(r.id)||0))+1; datos[tipo].push({id:next,clave,nombre,descripcion,estado});}
    guardar(); render(tipo); modal?.hide();
  }
  function eliminar(tipo,id){
    const r=(datos[tipo]||[]).find(x=>String(x.id)===String(id)); if(!r)return;
    if(!confirm(`¿Eliminar “${r.nombre}” del catálogo?`))return;
    datos[tipo]=datos[tipo].filter(x=>String(x.id)!==String(id)); guardar(); render(tipo);
  }
  document.addEventListener('click',e=>{
    const nuevo=e.target.closest('[data-catalogo-nuevo]'); if(nuevo){abrir(nuevo.dataset.catalogoNuevo);return;}
    const edit=e.target.closest('[data-cat-edit]'); if(edit){abrir(edit.dataset.catEdit,edit.dataset.id);return;}
    const del=e.target.closest('[data-cat-delete]'); if(del){eliminar(del.dataset.catDelete,del.dataset.id);return;}
  });
  document.addEventListener('input',e=>{if(e.target.id?.startsWith('catalogoBuscar-')) render(e.target.id.replace('catalogoBuscar-',''));});
  document.addEventListener('DOMContentLoaded',()=>{
    document.getElementById('catalogoGuardarBtn')?.addEventListener('click',salvar);
    Object.keys(definiciones).forEach(render);
  });
  window.CatalogosCRUD={render,renderPorVista(view){const tipo=porVista(view); if(tipo)render(tipo);}};
})();
