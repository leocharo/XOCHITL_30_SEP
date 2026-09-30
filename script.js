function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e}
function $(i){return document.getElementById(i)}

/* ===== Pizarra táctica ===== */
var FM={
 "11":{
  "4-4-2":{d:"Bloque equilibrado: dos líneas de cuatro y dos delanteros que se apoyan.",p:[[25,130],[90,40],[90,100],[90,160],[90,220],[190,40],[190,100],[190,160],[190,220],[300,95],[300,165]]},
  "4-3-3":{d:"Ataque por bandas: tres mediocampistas controlan el ritmo.",p:[[25,130],[90,40],[90,100],[90,160],[90,220],[190,70],[190,130],[190,190],[300,55],[300,130],[300,205]]},
  "3-5-2":{d:"Carrileros largos y mediocampo poblado para dominar el centro.",p:[[25,130],[90,70],[90,130],[90,190],[190,30],[190,80],[190,130],[190,180],[190,230],[300,95],[300,165]]},
  "4-2-3-1":{d:"Dos pivotes protegen la defensa y tres creativos apoyan a un solo punta.",p:[[25,130],[90,40],[90,100],[90,160],[90,220],[160,95],[160,165],[235,55],[235,130],[235,205],[310,130]]},
  "5-3-2":{d:"Muy sólido atrás, ideal para cerrar espacios y salir al contraataque.",p:[[25,130],[90,25],[90,77],[90,130],[90,183],[90,235],[190,70],[190,130],[190,190],[300,95],[300,165]]}
 },
 "7":{
  "2-3-1":{d:"Amplitud con tres en medio y un referente arriba.",p:[[25,130],[95,80],[95,180],[195,50],[195,130],[195,210],[300,130]]},
  "3-2-1":{d:"Defensa firme con dos volantes que conectan con el delantero.",p:[[25,130],[95,50],[95,130],[95,210],[190,90],[190,170],[300,130]]},
  "2-2-2":{d:"Dos líneas simétricas y dos delanteros que se mueven juntos.",p:[[25,130],[95,80],[95,180],[190,80],[190,180],[300,90],[300,170]]},
  "3-1-2":{d:"Un pivote ordena el juego y dos atacantes presionan arriba.",p:[[25,130],[95,50],[95,130],[95,210],[185,130],[300,90],[300,170]]}
 }
};
var PLAYS={
 contra:{n:"Contraataque rápido",d:"Recupera, busca al volante libre y lanza al delantero a la espalda de la defensa rival.",p:[[25,130],[190,130],[300,60],[375,130]]},
 salida:{n:"Salida corta con el portero",d:"El portero juega con el defensa, el volante recibe de espaldas y se gira al frente.",p:[[25,130],[90,100],[190,130],[300,130]]},
 banda:{n:"Ataque por banda y centro",d:"Abrir al extremo, ganar línea de fondo y centrar atrás para el segundo palo.",p:[[90,40],[190,35],[320,35],[355,110]]},
 triang:{n:"Triangulación por el centro",d:"Pared entre tres jugadores para romper la línea y llegar al área con superioridad.",p:[[190,100],[240,150],[270,100],[340,130]]},
 corner:{n:"Córner al primer palo",d:"Bloqueo en el primer palo, desvío de cabeza y remate de segunda jugada.",p:[[392,8],[365,80],[350,120]]},
 presion:{n:"Presión tras pérdida",d:"Al perder el balón, dos jugadores cierran al portador y el resto corta los pases cercanos.",p:[[300,130],[340,90],[370,130]]}
};
var REC={
 ofensivo:{"11":"5-3-2","7":"3-2-1",w:"Tu rival adelanta líneas y deja espacios a la espalda: defiende ordenado y sal rápido.",pl:["contra","salida"]},
 cerrado:{"11":"4-3-3","7":"2-3-1",w:"Tu rival se encierra: necesitas amplitud, movilidad y llegar por fuera.",pl:["banda","triang"]},
 presion:{"11":"4-2-3-1","7":"3-1-2",w:"Tu rival presiona alto: asegura la salida con pivotes y busca correr a su espalda.",pl:["salida","contra"]},
 igual:{"11":"4-4-2","7":"2-2-2",w:"Partido parejo: un bloque equilibrado y mucha coordinación entre líneas.",pl:["salida","banda"]}
};
var EXTRA={velocidad:"contra",tecnica:"triang",fuerza:"corner",equilibrio:"presion"};
var mode="11",form="4-4-2";
var cancha=$('cancha'),chips=$('chips'),desc=$('desc'),NS="http://www.w3.org/2000/svg",pl=[];
function sv(t,a){var e=document.createElementNS(NS,t);for(var k in a)e.setAttribute(k,a[k]);return e}
for(var i=0;i<11;i++){
 var g=sv('g',{'class':'ply'});
 g.appendChild(sv('circle',{r:10,fill:i===0?'#f5f5f0':'#c6f432'}));
 var t=sv('text',{'text-anchor':'middle',y:4,'font-size':10,'font-weight':700,fill:'#0f1b2d'});t.textContent=i===0?'P':i+1;
 g.appendChild(t);cancha.appendChild(g);pl.push(g);
}
var layer=sv('g',{});cancha.appendChild(layer);
var anim=0;
function clearPlay(){cancelAnimationFrame(anim);layer.textContent=''}
function drawPlay(pts){
 clearPlay();
 var path=sv('path',{d:'M'+pts.map(function(p){return p.join(' ')}).join(' L'),fill:'none',stroke:'#c6f432','stroke-width':2.5,'stroke-dasharray':'7 6','stroke-linecap':'round'});
 var end=pts[pts.length-1];
 var ring=sv('circle',{cx:end[0],cy:end[1],r:12,fill:'none',stroke:'#c6f432','stroke-width':2});
 var ball=sv('circle',{r:6,fill:'#f5f5f0',stroke:'#0f1b2d','stroke-width':2});
 layer.appendChild(path);layer.appendChild(ring);layer.appendChild(ball);
 var L=path.getTotalLength(),t0=null,dur=3000;
 function step(ts){
  if(!t0)t0=ts;
  var k=Math.min(((ts-t0)%(dur+700))/dur,1),p=path.getPointAtLength(L*k);
  ball.setAttribute('cx',p.x);ball.setAttribute('cy',p.y);
  anim=requestAnimationFrame(step);
 }
 anim=requestAnimationFrame(step);
}
function setF(n){
 form=n;var f=FM[mode][n],cnt=mode==='7'?7:11;
 pl.forEach(function(g,i){
  g.style.display=i<cnt?'':'none';
  if(i<cnt)g.style.transform='translate('+f.p[i][0]+'px,'+f.p[i][1]+'px)';
 });
 desc.textContent=f.d;
 [].forEach.call(chips.children,function(b){b.classList.toggle('on',b.textContent===n)});
}
function buildChips(){
 chips.textContent='';
 Object.keys(FM[mode]).forEach(function(n){var b=el('button','chip',n);b.type='button';b.onclick=function(){setF(n)};chips.appendChild(b)});
}
var mc=$('modeChips');
[["11","Fútbol 11"],["7","Fútbol 7"]].forEach(function(m){
 var b=el('button','chip',m[1]);b.type='button';b.dataset.m=m[0];
 b.onclick=function(){
  mode=m[0];[].forEach.call(mc.children,function(x){x.classList.toggle('on',x.dataset.m===mode)});
  buildChips();setF(Object.keys(FM[mode])[0]);clearPlay();$('aiOut').textContent='';
 };
 mc.appendChild(b);
});
mc.children[0].classList.add('on');
buildChips();setF("4-4-2");
$('aiClear').onclick=clearPlay;
$('aiGo').onclick=function(){
 var r=REC[$('aiRival').value],ids=r.pl.slice(),x=EXTRA[$('aiFuerte').value];
 if(ids.indexOf(x)<0)ids.push(x);
 ids=ids.slice(0,3);
 var out=$('aiOut');out.textContent='';
 var fo=r[mode];setF(fo);
 var b=el('p',null,'Alineación sugerida: '+fo);b.style.fontWeight='700';b.style.color='var(--acento)';b.style.marginBottom='4px';
 out.appendChild(b);out.appendChild(el('p','lead',r.w));
 ids.forEach(function(id){
  var p=PLAYS[id],d=el('div','aiplay');
  d.appendChild(el('b',null,p.n));d.appendChild(el('span',null,p.d));
  var v=el('button','chip','Ver jugada');v.type='button';v.onclick=function(){drawPlay(p.p)};
  d.appendChild(v);out.appendChild(d);
 });
 drawPlay(PLAYS[ids[0]].p);
};

/* ===== Archivo histórico ===== */
var H={
 "Partidos históricos":[
  {y:"1950",t:"El Maracanazo",d:"Brasil solo necesitaba empatar en casa la final del Mundial. Uruguay remontó y ganó 2-1, y silenció el estadio más grande del mundo.",q:"Maracanazo 1950 Uruguay Brasil"},
  {y:"1970",t:"Italia 4-3 Alemania",d:"La semifinal del Mundial en el Estadio Azteca, con cinco goles en el tiempo extra. Se le llama el «Partido del siglo».",q:"Italia Alemania 4-3 1970 partido del siglo"},
  {y:"1986",t:"Argentina 2-1 Inglaterra",d:"Cuartos de final en el Azteca. Maradona marcó la «Mano de Dios» y, minutos después, el gol tras gambetear a media cancha.",q:"Maradona Inglaterra 1986 gol del siglo"},
  {y:"1999",t:"Manchester United 2-1 Bayern",d:"Final de Champions en el Camp Nou. El Bayern ganaba hasta el minuto 90 y el United remontó con dos goles en el descuento.",q:"Manchester United Bayern final 1999"},
  {y:"2005",t:"La noche de Estambul",d:"El Milan ganaba 3-0 al descanso. El Liverpool empató 3-3 en seis minutos y ganó la Champions en los penales.",q:"Liverpool Milan final Estambul 2005"},
  {y:"2014",t:"Brasil 1-7 Alemania",d:"Semifinal del Mundial en Belo Horizonte. Alemania hizo cinco goles en la primera media hora, en una de las mayores goleadas en una semifinal mundialista.",q:"Brasil Alemania 1-7 2014 resumen"}
 ],
 "Jugadores legendarios":[
  {y:"Pelé",t:"El Rey del fútbol",d:"Campeón del mundo con Brasil en 1958, 1962 y 1970. Fue campeón mundial a los 17 años, el más joven de la historia.",q:"Pelé mejores jugadas Mundial 1970"},
  {y:"Maradona",t:"El Diez",d:"Llevó a Argentina al título en México 1986 y a Napoli a sus dos primeros scudettos, en 1987 y 1990.",q:"Maradona Napoli mejores jugadas"},
  {y:"Di Stéfano",t:"La Saeta Rubia",d:"Columna del Real Madrid que ganó las cinco primeras Copas de Europa seguidas, de 1956 a 1960.",q:"Alfredo Di Stéfano Real Madrid historia"},
  {y:"Cruyff",t:"El profeta del gol",d:"Figura del Ajax de tres Copas de Europa seguidas (1971-73) y de la Holanda de 1974. Revolucionó el juego con el fútbol total.",q:"Johan Cruyff fútbol total Holanda 1974"},
  {y:"Hugo Sánchez",t:"Pentapichichi mexicano",d:"Delantero mexicano que ganó cinco veces el Pichichi en España, famoso por sus chilenas y sus goles con el Real Madrid.",q:"Hugo Sánchez mejores goles Real Madrid"},
  {y:"Zidane",t:"Elegancia en la final",d:"En la final del Mundial de 1998 marcó dos goles de cabeza a Brasil (3-0) y dio el primer título a Francia.",q:"Zidane final 1998 Francia Brasil goles"}
 ],
 "Campañas inolvidables":[
  {y:"1970",t:"Brasil, la selección perfecta",d:"Ganó sus seis partidos en México. Jairzinho marcó en todos, y Pelé, Tostão y Rivelino formaron un ataque legendario.",q:"Brasil 1970 campaña completa Mundial"},
  {y:"1974",t:"La Naranja Mecánica",d:"Holanda deslumbró con un fútbol de presión y rotación constante. Perdió la final con Alemania, pero cambió el juego.",q:"Holanda 1974 Naranja Mecánica"},
  {y:"1986",t:"México en casa",d:"El Tri llegó a cuartos de final en su Mundial. Cayó en penales ante Alemania Occidental, en una de sus mejores campañas.",q:"México Mundial 1986 cuartos de final Alemania"},
  {y:"1992",t:"Dinamarca, la sorpresa",d:"Entró a la Eurocopa a última hora, cuando vetaron a Yugoslavia. Ganó el título sin haber planeado ir.",q:"Dinamarca Eurocopa 1992 campeón"},
  {y:"2004",t:"Grecia campeona",d:"Con orden defensivo y goles en el momento justo, Grecia ganó la Eurocopa 2004 como una gran sorpresa.",q:"Grecia Eurocopa 2004 campeón"},
  {y:"2015-16",t:"Leicester City campeón",d:"El club ganó la Premier League cuando las casas de apuestas lo daban con probabilidades de 5000 a 1.",q:"Leicester City campeón Premier League 2016"}
 ]
};
var hTabs=$('histTabs'),hGrid=$('histGrid');
function showH(k){
 [].forEach.call(hTabs.children,function(b){b.classList.toggle('on',b.textContent===k)});
 hGrid.textContent='';
 H[k].forEach(function(x){
  var c=el('article','hc'),a=el('a',null,'▶ Ver videos');
  a.href='https://www.youtube.com/results?search_query='+encodeURIComponent(x.q);a.target='_blank';a.rel='noopener';
  c.appendChild(el('small',null,k.split(' ')[0]));c.appendChild(el('div','yr',x.y));c.appendChild(el('h3',null,x.t));c.appendChild(el('p',null,x.d));c.appendChild(a);
  hGrid.appendChild(c);
 });
}
Object.keys(H).forEach(function(k){var b=el('button','chip',k);b.onclick=function(){showH(k)};hTabs.appendChild(b)});
showH("Partidos históricos");

/* ===== Gestor de torneos ===== */
var T=null,eq=[];
function save(){try{localStorage.setItem('tactika_torneo',JSON.stringify(T))}catch(e){}}
function listEq(){
 var l=$('teamList');l.textContent='';
 eq.forEach(function(n,i){var b=el('button','chip on',n+' ✕');b.type='button';b.onclick=function(){eq.splice(i,1);listEq()};l.appendChild(b)});
}
function addEq(){
 var v=$('teamIn').value.trim();if(!v)return;
 if(eq.indexOf(v)>-1){$('msg').textContent='Ese equipo ya está en la lista.';return}
 eq.push(v);$('teamIn').value='';$('msg').textContent='';listEq();$('teamIn').focus();
}
$('addTeam').onclick=addEq;
$('teamIn').onkeydown=function(e){if(e.key==='Enter'){e.preventDefault();addEq()}};
$('demo').onclick=function(){eq=['Halcones','Deportivo Barrio Alto','Real Esperanza','Los Tigres','Atlético Reforma','Juventud Sur'];listEq();$('msg').textContent=''};

function fixture(teams,dbl){
 var a=teams.slice(),R=[];if(a.length%2)a.push(null);
 var n=a.length;
 for(var r=0;r<n-1;r++){
  var m=[];
  for(var i=0;i<n/2;i++){
   var h=a[i],v=a[n-1-i];if(h===null||v===null)continue;
   if(r%2&&i===0){var t=h;h=v;v=t}
   m.push({h:h,a:v,gh:null,ga:null});
  }
  R.push(m);a.splice(1,0,a.pop());
 }
 if(dbl)R=R.concat(R.map(function(m){return m.map(function(x){return{h:x.a,a:x.h,gh:null,ga:null}})}));
 return R;
}
$('crear').onclick=function(){
 if(eq.length<3){$('msg').textContent='Agrega al menos 3 equipos.';return}
 T={n:$('tName').value.trim()||'Mi torneo',teams:eq.slice(),pts:+$('tPts').value,R:fixture(eq,$('tFmt').value==='2')};
 save();showT();
};
$('reset').onclick=function(){T=null;try{localStorage.removeItem('tactika_torneo')}catch(e){}$('torneo').hidden=true;$('setup').hidden=false};

function calc(){
 var s={};T.teams.forEach(function(t){s[t]={n:t,pj:0,g:0,e:0,p:0,gf:0,gc:0}});
 T.R.forEach(function(r){r.forEach(function(m){
  if(m.gh===null||m.ga===null)return;
  var A=s[m.h],B=s[m.a];A.pj++;B.pj++;A.gf+=m.gh;A.gc+=m.ga;B.gf+=m.ga;B.gc+=m.gh;
  if(m.gh>m.ga){A.g++;B.p++}else if(m.gh<m.ga){B.g++;A.p++}else{A.e++;B.e++}
 })});
 var L=Object.keys(s).map(function(k){var x=s[k];x.dg=x.gf-x.gc;x.pts=x.g*T.pts+x.e;return x});
 L.sort(function(a,b){return b.pts-a.pts||b.dg-a.dg||b.gf-a.gf||a.n.localeCompare(b.n)});
 return L;
}
function renderTabla(){
 var L=calc(),tb=$('tabla');tb.textContent='';
 var hr=el('tr'),cols=['#','Equipo','PJ','G','E','P','GF','GC','DG','Pts'];
 cols.forEach(function(c,i){hr.appendChild(el('th',i===1?'n':'',c))});
 var th=el('thead');th.appendChild(hr);tb.appendChild(th);
 var bd=el('tbody'),jug=0,gol=0;
 L.forEach(function(x,i){
  var r=el('tr',i===0&&x.pj>0?'top':'');
  var v=[i+1,x.n,x.pj,x.g,x.e,x.p,x.gf,x.gc,(x.dg>0?'+':'')+x.dg,x.pts];
  v.forEach(function(z,j){r.appendChild(el('td',j===1?'n':(j===9?'pts':''),z))});
  bd.appendChild(r);gol+=x.gf;jug+=x.pj;
 });
 tb.appendChild(bd);
 var tot=0;T.R.forEach(function(r){tot+=r.length});
 jug=jug/2;
 var st=$('stats');st.textContent='';
 [[jug+' / '+tot,'Partidos jugados'],[gol,'Goles totales'],[jug?(gol/jug).toFixed(2):'0','Goles por partido'],[jug?L[0].n:'—','Líder']].forEach(function(p){
  var d=el('div');d.appendChild(el('b',null,p[0]));d.appendChild(el('span',null,p[1]));st.appendChild(d);
 });
}
function inp(m,k){
 var i=el('input');i.type='number';i.min=0;i.setAttribute('aria-label','Goles');
 i.value=m[k]===null?'':m[k];
 i.oninput=function(){m[k]=i.value===''?null:Math.max(0,Math.floor(+i.value));save();renderTabla()};
 return i;
}
function showT(){
 $('setup').hidden=true;$('torneo').hidden=false;
 $('tTitle').textContent=T.n+' · '+T.teams.length+' equipos';
 var cal=$('cal');cal.textContent='';
 T.R.forEach(function(r,n){
  var j=el('div','jor');j.appendChild(el('h4',null,'Jornada '+(n+1)));
  r.forEach(function(m){
   var d=el('div','mt');
   d.appendChild(el('span',null,m.h));d.appendChild(inp(m,'gh'));d.appendChild(el('span',null,'-'));d.appendChild(inp(m,'ga'));d.appendChild(el('span',null,m.a));
   j.appendChild(d);
  });
  cal.appendChild(j);
 });
 renderTabla();
}
try{var sv=localStorage.getItem('tactika_torneo');if(sv){T=JSON.parse(sv);if(T&&T.teams)showT();else T=null}}catch(e){T=null}