
(() => {
'use strict';
const STORAGE='consar_editor_paginas_v1';
let pagina={id:null,titulo:'INFORMACIÓN ESTADÍSTICA',estado:'Borrador',actualizadoEn:null,bloques:[]};
let seleccionado=null;
const $=id=>document.getElementById(id);
const escapeHtml=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const uid=()=> 'BLK-'+Date.now()+'-'+Math.random().toString(36).slice(2,6);

function leerPaginas(){try{const a=JSON.parse(localStorage.getItem(STORAGE)||'[]');return Array.isArray(a)?a:[]}catch{return[]}}
function persistir(arr){localStorage.setItem(STORAGE,JSON.stringify(arr));}
function datosDemo(){
 if(leerPaginas().length) return;
 persistir([{id:'PAG-001',titulo:'Información Estadística',estado:'Borrador',actualizadoEn:'2026-08-25T16:20:00',bloques:[
 {id:'D1',tipo:'texto',titulo:'Información estadística del SAR',texto:'En esta sección se presentan indicadores relevantes del Sistema de Ahorro para el Retiro (SAR).'},
 {id:'D2',tipo:'cuadro',titulo:'Datos relevantes del SAR',cuadro:'Recursos administrados por las AFORE'},
 {id:'D3',tipo:'enlace',texto:'Consultar series históricas',url:'#'}]}]);
}
function nuevo(){ pagina={id:null,titulo:'INFORMACIÓN ESTADÍSTICA',estado:'Borrador',actualizadoEn:null,bloques:[]}; seleccionado=null; render(); }
function agregar(tipo){
 const base={id:uid(),tipo};
 if(tipo==='texto') Object.assign(base,{titulo:'Nuevo bloque de texto',texto:'Escribe aquí el contenido de la página.'});
 if(tipo==='serie') Object.assign(base,{titulo:'Serie de tiempo',serie:'Recursos administrados',periodo:'Mensual'});
 if(tipo==='enlace') Object.assign(base,{texto:'Enlace de interés',url:'#'});
 if(tipo==='cuadro') Object.assign(base,{titulo:'Cuadro estadístico',cuadro:'Activos netos de las AFORE'});
 if(tipo==='imagen') Object.assign(base,{titulo:'Imagen informativa',url:'',alt:'Imagen de contenido'});
 pagina.bloques.push(base); seleccionado=base.id; render();
}
function mover(id,dir){const i=pagina.bloques.findIndex(b=>b.id===id);const j=i+dir;if(i<0||j<0||j>=pagina.bloques.length)return;[pagina.bloques[i],pagina.bloques[j]]=[pagina.bloques[j],pagina.bloques[i]];render();}
function eliminar(id){pagina.bloques=pagina.bloques.filter(b=>b.id!==id);if(seleccionado===id)seleccionado=null;render();}
function bloqueHtml(b,preview=false){
 let content='';
 if(b.tipo==='texto') content=`<div class="editor-text"><h2>${escapeHtml(b.titulo)}</h2><p class="mb-0">${escapeHtml(b.texto)}</p></div>`;
 if(b.tipo==='serie') content=`<div class="editor-series-card"><div class="d-flex justify-content-between"><div><strong>${escapeHtml(b.titulo)}</strong><div class="small text-muted">${escapeHtml(b.serie)} · ${escapeHtml(b.periodo)}</div></div><i class="bi bi-graph-up-arrow fs-4 text-primary"></i></div><div class="mini-bars"><span style="height:48%"></span><span style="height:72%"></span><span style="height:58%"></span><span style="height:84%"></span><span style="height:68%"></span></div></div>`;
 if(b.tipo==='enlace') content=`<div class="editor-link"><i class="bi bi-link-45deg me-2"></i><a href="${escapeHtml(b.url)}" ${preview?'target="_blank"':''}>${escapeHtml(b.texto)}</a></div>`;
 if(b.tipo==='cuadro') content=`<div class="editor-stat-card"><div class="d-flex align-items-center gap-3"><i class="bi bi-table fs-2 text-primary"></i><div><strong>${escapeHtml(b.titulo)}</strong><div class="small text-muted">${escapeHtml(b.cuadro)}</div></div></div></div>`;
 if(b.tipo==='imagen') content=b.url?`<div class="editor-image text-center"><img src="${escapeHtml(b.url)}" alt="${escapeHtml(b.alt)}"><div class="small text-muted mt-2">${escapeHtml(b.titulo)}</div></div>`:`<div class="editor-image text-center border rounded p-4 text-muted"><i class="bi bi-image fs-1"></i><div>${escapeHtml(b.titulo)}</div><small>Agrega una URL de imagen en Propiedades</small></div>`;
 const actions=preview?'':`<div class="web-editor-block-actions"><button class="btn btn-light btn-sm" data-move="up" title="Subir"><i class="bi bi-arrow-up"></i></button><button class="btn btn-light btn-sm" data-move="down" title="Bajar"><i class="bi bi-arrow-down"></i></button><button class="btn btn-outline-danger btn-sm" data-delete title="Eliminar"><i class="bi bi-trash"></i></button></div>`;
 return `<section class="web-editor-block ${seleccionado===b.id&&!preview?'is-selected':''}" data-block-id="${b.id}">${actions}${content}</section>`;
}
function render(){
 const title=$('webEditorTituloPagina'); if(title) title.value=pagina.titulo;
 const canvas=$('webEditorCanvas'); if(!canvas)return;
 canvas.innerHTML=pagina.bloques.length?pagina.bloques.map(b=>bloqueHtml(b)).join(''):`<div class="web-editor-empty" id="webEditorEmpty"><i class="bi bi-plus-square-dotted"></i><strong>Agrega contenido a la página</strong><span>Selecciona un elemento del panel izquierdo.</span></div>`;
 const fecha=$('webEditorFechaPublicacion'); if(fecha) fecha.textContent=`Fecha de actualización: ${pagina.actualizadoEn?new Date(pagina.actualizadoEn).toLocaleString('es-MX'):'—'}`;
 canvas.querySelectorAll('[data-block-id]').forEach(el=>{
  el.addEventListener('click',e=>{const id=el.dataset.blockId;if(e.target.closest('[data-delete]')){e.stopPropagation();eliminar(id);return;}const mv=e.target.closest('[data-move]');if(mv){e.stopPropagation();mover(id,mv.dataset.move==='up'?-1:1);return;}seleccionado=id;render();});
 });
 renderProps();
}
function field(label,value,key,type='text',help='') {return `<div class="property-group"><label>${label}</label>${type==='textarea'?`<textarea class="form-control form-control-sm" rows="4" data-prop="${key}">${escapeHtml(value)}</textarea>`:`<input class="form-control form-control-sm" type="${type}" value="${escapeHtml(value)}" data-prop="${key}">`}${help?`<div class="property-help mt-1">${help}</div>`:''}</div>`;}
function renderProps(){
 const box=$('webEditorProperties');if(!box)return; const b=pagina.bloques.find(x=>x.id===seleccionado);
 if(!b){box.innerHTML='<div class="text-muted small">Selecciona un elemento del lienzo para editar sus propiedades.</div>';return;}
 let h=`<div class="badge text-bg-light border mb-3 text-capitalize">${escapeHtml(b.tipo)}</div>`;
 if(b.tipo==='texto') h+=field('Encabezado',b.titulo,'titulo')+field('Contenido',b.texto,'texto','textarea');
 if(b.tipo==='serie') h+=field('Título',b.titulo,'titulo')+field('Serie',b.serie,'serie')+field('Periodicidad',b.periodo,'periodo');
 if(b.tipo==='enlace') h+=field('Texto del enlace',b.texto,'texto')+field('URL',b.url,'url','url');
 if(b.tipo==='cuadro') h+=field('Título',b.titulo,'titulo')+field('Cuadro / serie vinculada',b.cuadro,'cuadro');
 if(b.tipo==='imagen') h+=field('Título',b.titulo,'titulo')+field('URL de imagen',b.url,'url','url','Para el prototipo se usa una URL; en backend podrá sustituirse por carga de archivos.')+field('Texto alternativo',b.alt,'alt');
 box.innerHTML=h;
 box.querySelectorAll('[data-prop]').forEach(i=>i.addEventListener('input',()=>{b[i.dataset.prop]=i.value;renderCanvasOnly();}));
}
function renderCanvasOnly(){pagina.titulo=$('webEditorTituloPagina')?.value||pagina.titulo;const canvas=$('webEditorCanvas');if(canvas)canvas.innerHTML=pagina.bloques.map(b=>bloqueHtml(b)).join(''); if(canvas) canvas.querySelectorAll('[data-block-id]').forEach(el=>el.addEventListener('click',e=>{const id=el.dataset.blockId;if(e.target.closest('[data-delete]')){e.stopPropagation();eliminar(id);return;}const mv=e.target.closest('[data-move]');if(mv){e.stopPropagation();mover(id,mv.dataset.move==='up'?-1:1);return;}seleccionado=id;render();}));}
function guardar(){pagina.titulo=$('webEditorTituloPagina')?.value.trim()||'Página sin título';const arr=leerPaginas();const now=new Date().toISOString();if(!pagina.id)pagina.id='PAG-'+String(Date.now()).slice(-6);pagina.actualizadoEn=now;const i=arr.findIndex(x=>x.id===pagina.id);if(i>=0)arr[i]=JSON.parse(JSON.stringify(pagina));else arr.push(JSON.parse(JSON.stringify(pagina)));persistir(arr);render();alert('Página guardada correctamente.');}
function abrirModal(){renderLista();bootstrap.Modal.getOrCreateInstance($('webEditorPaginasModal')).show();}
function renderLista(){const body=$('webEditorPaginasBody'),empty=$('webEditorPaginasEmpty');if(!body)return;const q=($('webEditorBuscarPagina')?.value||'').toLowerCase();const arr=leerPaginas().filter(p=>[p.id,p.titulo].some(v=>String(v||'').toLowerCase().includes(q)));body.innerHTML='';empty?.classList.toggle('d-none',arr.length>0);arr.forEach(p=>{const tr=document.createElement('tr');tr.innerHTML=`<td><span class="badge text-bg-light border">${escapeHtml(p.id)}</span></td><td class="fw-semibold">${escapeHtml(p.titulo)}</td><td><small>${p.actualizadoEn?new Date(p.actualizadoEn).toLocaleString('es-MX'):'—'}</small></td><td><span class="badge ${p.estado==='Publicado'?'text-bg-success':'text-bg-warning'}">${escapeHtml(p.estado||'Borrador')}</span></td><td class="text-end"><button class="btn btn-sm btn-outline-primary" data-open="${p.id}"><i class="bi bi-pencil-square me-1"></i>Editar</button></td>`;body.appendChild(tr);});body.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>{const p=leerPaginas().find(x=>x.id===b.dataset.open);if(p){pagina=JSON.parse(JSON.stringify(p));seleccionado=null;bootstrap.Modal.getInstance($('webEditorPaginasModal'))?.hide();render();}}));}
function preview(){pagina.titulo=$('webEditorTituloPagina')?.value||pagina.titulo;const c=$('webEditorPreviewContent'),modal=$('webEditorPreviewModal');if(!c||!modal)return;const bloques=pagina.bloques.length?pagina.bloques.map(b=>bloqueHtml(b,true)).join(''):'<div class="text-center text-muted py-5"><i class="bi bi-layout-text-window-reverse fs-1 d-block mb-2"></i>La página todavía no tiene elementos agregados.</div>';c.innerHTML=`<div class="small text-muted text-uppercase mb-2">CONSAR Estadística</div><div class="preview-web-title">${escapeHtml(pagina.titulo)}</div>${bloques}<div class="small text-muted border-top pt-3 mt-4">Fecha de actualización: ${pagina.actualizadoEn?new Date(pagina.actualizadoEn).toLocaleString('es-MX'):new Date().toLocaleString('es-MX')}</div>`;bootstrap.Modal.getOrCreateInstance(modal,{backdrop:true,keyboard:true}).show();}
function init(){datosDemo();document.querySelectorAll('[data-editor-add]').forEach(b=>b.addEventListener('click',()=>agregar(b.dataset.editorAdd)));$('webEditorNuevaPagina')?.addEventListener('click',nuevo);$('webEditorAbrirPaginas')?.addEventListener('click',abrirModal);$('webEditorGuardar')?.addEventListener('click',guardar);$('webEditorVistaPrevia')?.addEventListener('click',preview);$('webEditorTituloPagina')?.addEventListener('input',e=>pagina.titulo=e.target.value);$('webEditorBuscarPagina')?.addEventListener('input',renderLista);document.querySelector('[data-view="editor"]')?.addEventListener('click',()=>setTimeout(render,0));render();}
document.addEventListener('DOMContentLoaded',init);
})();
