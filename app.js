const state = {
  route: 'home',
  uploadedMeetings: [],
  compact: false,
  meeting: {
    title: 'Reunião com TechSolutions', date: '15/05/2025', duration: '1:24:36',
    transcript: [
      ['00:02:15','Ana Souza (TechSolutions)','Agradeço a presença de todos. Queremos discutir nossa experiência com os módulos atuais e explorar oportunidades para expandir nosso uso da plataforma.'],
      ['00:03:47','Carlos Mendes (TechSolutions)','No geral, estamos satisfeitos com o ERP Financeiro e o módulo de Compras. No entanto, enfrentamos alguns desafios na integração com nosso CRM.'],
      ['00:05:21','Juliana Lima (OMNIA)','Entendo. A integração com CRM realmente é um ponto sensível para alguns clientes. Podemos apresentar nossa solução de integração nativa, que já ajudou empresas como a de vocês.'],
      ['00:07:10','Ana Souza (TechSolutions)','Seria ótimo. Outro ponto importante: estamos avaliando expandir o uso para o módulo de CRM, especialmente para melhorar nosso relacionamento com clientes e pipeline comercial.'],
      ['00:08:32','Ricardo Almeida (OMNIA)','Perfeito. Com o módulo de CRM, vocês terão uma visão 360° dos clientes, além de automações que podem aumentar a produtividade do time comercial.'],
      ['00:10:05','Carlos Mendes (TechSolutions)','Também temos interesse em entender melhor os dashboards e análises gerenciais. Precisamos de mais visibilidade para tomada de decisão estratégica.']
    ]
  }
};
const main = document.querySelector('#main');
const toast = document.querySelector('#toast');
const modalRoot = document.querySelector('#modalRoot');

const meetingRows = [
  ['TechSolutions','15/05/2025','Concluída','7 insights'],
  ['Cliente ABC','14/05/2025','Concluída','5 insights'],
  ['Cliente XYZ','13/05/2025','Em análise','—'],
  ['Alinhamento interno','12/05/2025','Concluída','4 insights']
];

function setRoute(route){
  state.route = route;
  document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.route===route));
  render();
  window.scrollTo({top:0,behavior:'smooth'});
}

document.addEventListener('click',e=>{
  const route = e.target.closest('[data-route]')?.dataset.route;
  if(route) setRoute(route);
});

document.querySelector('#globalSearch').addEventListener('keydown',e=>{
  if(e.key==='Enter' && e.target.value.trim()){
    showToast(`Busca por “${e.target.value.trim()}” concluída: 6 resultados encontrados.`);
  }
});

document.addEventListener('keydown',e=>{
  if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){
    e.preventDefault(); document.querySelector('#globalSearch').focus();
  }
});

function showToast(msg){toast.textContent=msg;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2800)}

function spark(points,color='#168eff'){
  return `<svg viewBox="0 0 200 60" preserveAspectRatio="none"><polyline fill="none" stroke="${color}" stroke-width="4" points="${points}" /></svg>`
}

function pageHead(title,subtitle,action=''){
  return `<div class="page-head"><div><h1>${title}</h1><p>${subtitle}</p></div>${action}</div>`
}

function home(){
  const rows=[...state.uploadedMeetings.map(x=>[x,'Hoje','Em análise','—']),...meetingRows];
  return `${pageHead('Bem-vindo ao <span class="blue">OMNIA</span>','Sua inteligência para transformar conversas em resultados.','<button class="primary-btn" id="newMeeting">＋ Nova reunião</button>')}
    <section class="card upload-card" id="dropzone">
      <div class="upload-icon">☁</div><h2>Faça upload da sua reunião</h2>
      <p>Arraste e solte o arquivo aqui ou clique para selecionar</p><p>Formatos suportados: TXT, PDF, DOCX, CSV • Tamanho máximo: 50MB</p>
      <input id="fileInput" type="file" hidden accept=".txt,.pdf,.docx,.csv" />
      <button class="primary-btn" id="selectFile" style="margin-top:22px">⇧ &nbsp; Selecionar arquivo</button>
    </section>
    <section class="card flow-strip">
      ${[['1. Upload','Envie a transcrição da reunião'],['2. Análise IA','Nossa IA analisa os conteúdos e contextos'],['3. Insights','Identificamos padrões, oportunidades e riscos'],['4. Dashboard','Visualize insights e tome decisões melhores']].map((s,i)=>`<div class="flow-step"><div class="flow-num">${i+1}</div><div><b>${s[0]}</b><small>${s[1]}</small></div></div>`).join('')}
    </section>
    <div class="section-title"><h2>Reuniões recentes</h2><button class="link-btn" data-route="meetings">Ver todas</button></div>
    <section class="card table-wrap"><table class="data-table"><thead><tr><th>Reunião</th><th>Data</th><th>Status</th><th>Insights</th></tr></thead><tbody>
    ${rows.map((r,i)=>`<tr class="meeting-row" data-open-meeting="1"><td><b>${r[0]}</b></td><td>${r[1]}</td><td><span class="status ${r[2]==='Concluída'?'done':r[2]==='Em análise'?'progressing':'pending'}">${r[2]}</span></td><td>${r[3]}</td></tr>`).join('')}
    </tbody></table></section>`;
}

function meetings(){
  const t=state.meeting.transcript;
  return `${pageHead('← &nbsp; '+state.meeting.title, 'Data: '+state.meeting.date+' &nbsp; • &nbsp; Duração: '+state.meeting.duration, '<button class="secondary-btn" id="shareBtn">↗ Compartilhar</button>')}
  <div class="meeting-layout">
    <section class="card transcript">
      <div class="meeting-tabs"><button class="active">Transcrição</button><button>Resumo</button><button>Tópicos</button><button>Participantes</button></div>
      <div style="display:flex;justify-content:space-between;align-items:center"><h2 style="font-size:18px">Transcrição da reunião</h2><button class="secondary-btn" id="filterTranscript">⌕ Buscar na transcrição</button></div>
      ${t.map(r=>`<div class="speaker-row"><span class="time">${r[0]}</span><span class="speaker">${r[1]}</span><p>${highlightTerms(r[2])}</p></div>`).join('')}
      <div class="card" style="padding:12px 16px;display:flex;align-items:center;gap:12px"><button class="icon-btn">▶</button><span style="color:#37a8ff">00:00:00</span><div class="progress" style="flex:1"><i style="width:35%"></i></div><span>${state.meeting.duration}</span><b>1.0x</b></div>
    </section>
    <aside class="analysis-side">
      <section class="card analysis-card"><div style="display:flex;justify-content:space-between"><h3>Análise de IA</h3><span class="status done">Confiança: 98%</span></div>
        <div class="analysis-grid"><div class="analysis-kpi"><small>Sentimento geral</small><b class="good">Positivo</b>${spark('0,45 30,42 55,48 78,35 105,39 130,30 160,28 200,20','#22cc88')}</div><div class="analysis-kpi"><small>Risco de churn</small><b class="warn">Médio</b>${spark('0,50 30,49 55,45 85,48 115,31 145,35 170,29 200,25','#f4b83a')}</div><div class="analysis-kpi"><small>Score da reunião</small><b class="score">8,6/10</b>${spark('0,48 30,49 60,47 90,45 120,30 150,31 180,28 200,27')}</div></div>
      </section>
      <section class="card analysis-card"><h3>Principais recomendações</h3><ul class="list-clean"><li><span>◉ Apresentar solução de integração nativa com CRM</span><span class="status done">Alta</span></li><li><span>♧ Propor expansão para o módulo de CRM</span><span class="status done">Alta</span></li><li><span>▣ Demonstrar dashboards e análises gerenciais</span><span class="status pending">Média</span></li><li><span>◌ Alinhar expectativas sobre implementação</span><span class="status pending">Média</span></li></ul></section>
      <section class="card analysis-card"><h3>Oportunidades identificadas</h3><ul class="list-clean"><li><span>Upsell: Módulo de CRM</span><b>85% • R$ 120K</b></li><li><span>Serviços de Integração</span><b>70% • R$ 45K</b></li><li><span>Analytics Avançado</span><b>60% • R$ 35K</b></li></ul></section>
      <section class="card analysis-card"><h3>Interesses do cliente</h3><div>${['Integração com CRM','Expansão de módulos','Dashboards gerenciais','Aumento de produtividade','Visão 360° do cliente'].map(x=>`<span class="pill">${x}</span>`).join('')}</div></section>
      <section class="card analysis-card"><h3>Insights estratégicos</h3><p style="color:#9fb3cb;line-height:1.6">Cliente satisfeito com módulos atuais, mas enfrentando desafios de integração. Há forte intenção de expansão e interesse em soluções que aumentem visibilidade e produtividade.</p></section>
    </aside>
  </div>`;
}
function highlightTerms(s){return s.replace(/(oportunidades|integração com nosso CRM|solução de integração nativa|expandir o uso para o módulo de CRM|aumentar a produtividade|dashboards e análises gerenciais)/gi,'<span class="highlight">$1</span>')}

function ai(){
  return `${pageHead('AI Copilot <span class="pill">Nabu AI</span>','Seu agente de IA para inteligência que gera resultados.')}
    <section class="card chat-hero"><img src="assets/nabu.png" class="nabu" alt="Nabu"><h1>Olá, eu sou o Nabu! 👋</h1><p style="color:#9fb3ca">Como posso ajudar você hoje?</p></section>
    <div class="suggestions">${['Quais clientes apresentam maior risco de churn?','Quais oportunidades de upsell foram identificadas?','Resuma os principais tópicos das reuniões desta semana.','Quais são os principais interesses dos nossos clientes?'].map(x=>`<button class="suggestion" data-question="${x}">${x}</button>`).join('')}</div>
    <section class="chat" id="chatLog"><div class="msg user"><div class="bubble">Quais clientes apresentam maior risco de churn?</div><div class="avatar">RA</div></div><div class="msg"><img src="assets/nabu.png" class="chat-avatar"><div class="bubble">Identifiquei 5 clientes com maior risco de churn nesta semana com base em sinais de engajamento, abertura de chamados e interações recentes.</div></div></section>
    <div class="composer"><input id="chatInput" placeholder="Digite sua pergunta para o Nabu..."/><button id="sendChat">➤</button></div>
    <p style="text-align:center;color:#647d9c;font-size:12px">Nabu pode cometer erros. Verifique as informações importantes.</p>`;
}

function dashboard(){
  const days=[48,76,54,71,50,36,24];
  return `${pageHead('Olá, Arisha! 👋','Continue evoluindo na TOTVS')}
    <div class="dashboard-grid">
      <section class="card dash-card"><h3>Aproveitamento de reuniões ⓘ</h3><div class="big-num">87%</div><div class="delta">↑ 12% vs semana passada</div><div class="mini-line">${spark('0,55 25,44 50,37 78,30 104,31 130,20 154,35 175,32 200,5')}</div></section>
      <section class="card dash-card"><h3>Total de reuniões ⓘ</h3><div class="big-num">23</div><div class="delta">↑ 15% vs semana passada</div><div class="mini-line">${spark('0,50 25,42 50,36 75,22 100,31 125,29 150,16 175,24 200,6')}</div></section>
      <section class="card dash-card"><h3>Desempenho essa semana ⓘ</h3><div class="gauge"><span>76%</span></div><p style="text-align:center;color:#9fb2ca">Bom desempenho!</p></section>
      <section class="card dash-card"><h3>Participação nas reuniões</h3><div class="bar-list">${days.map((h,i)=>`<div class="bar" style="height:${h}%"><small>${['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'][i]}</small></div>`).join('')}</div></section>
      <section class="card dash-card"><h3>Tantos da reunião</h3><div style="display:flex;gap:18px;align-items:center"><div class="gauge" style="width:90px;height:55px"><span style="font-size:22px">12</span></div><div style="color:#9fb2ca">Concluídos <b style="color:#fff">8 (67%)</b><br><br>Pendentes <b style="color:#fff">4 (33%)</b></div></div></section>
      <section class="card dash-card span-2"><h3>Evolução do aproveitamento</h3><div class="line-chart"><svg viewBox="0 0 600 150" preserveAspectRatio="none"><polyline fill="rgba(12,130,255,.08)" stroke="#0d8cff" stroke-width="4" points="0,120 50,105 100,111 150,92 200,99 250,78 300,83 350,65 400,62 450,70 500,46 550,38 600,20 600,150 0,150"/></svg></div></section>
      <section class="card dash-card"><h3>Reuniões por status</h3><ul class="list-clean"><li><span>Agendadas</span><b>7</b></li><li><span>Em andamento</span><b>3</b></li><li><span>Concluídas</span><b>13</b></li><li><span>Canceladas</span><b>2</b></li></ul></section>
      <section class="card dash-card span-2"><h3>Aproveitamento por tipo de reunião</h3>${[['Reunião de acompanhamento',92],['Reunião de negócios',78],['Reunião de alinhamento',71],['Reunião interna',65],['Treinamento / Workshop',89]].map(x=>progressRow(x[0],x[1])).join('')}</section>
      <section class="card dash-card span-2"><h3>Desempenho por competência</h3>${[['Comunicação',82],['Negociação',76],['Planejamento',71],['Relacionamento',89],['Execução',73]].map(x=>progressRow(x[0],x[1])).join('')}</section>
    </div>`;
}
function progressRow(label,p){return `<div class="progress-row"><div><span>${label}</span><b>${p}%</b></div><i style="--p:${p}%"></i></div>`}

function insights(){return genericPage('Insights','Visão consolidada dos principais padrões extraídos das conversas.',[
  ['Riscos emergentes','8 clientes com sinais de churn nos últimos 7 dias.','Risco'],['Temas recorrentes','Integração, dashboards e produtividade lideram as menções.','Padrões'],['Ações recomendadas','12 follow-ups de alta prioridade sugeridos pela IA.','Ação']
])}
function clients(){return genericPage('Clientes','Acompanhe sinais, histórico e contexto de cada conta.',[
  ['TechSolutions','Saúde da conta: 82% • Churn médio','Conta'],['Cliente ABC','Saúde da conta: 91% • Churn baixo','Conta'],['Cliente XYZ','Saúde da conta: 64% • Churn alto','Conta']
])}
function opportunities(){return genericPage('Oportunidades','Oportunidades identificadas automaticamente nas conversas.',[
  ['Módulo de CRM','Probabilidade 85% • R$ 120K estimados','Upsell'],['Serviços de Integração','Probabilidade 70% • R$ 45K estimados','Serviço'],['Analytics Avançado','Probabilidade 60% • R$ 35K estimados','Cross-sell']
])}
function risks(){return genericPage('Riscos','Priorize os sinais críticos antes que virem churn.',[
  ['Cliente XYZ','Risco alto • 3 reclamações recentes','Alto'],['TechSolutions','Risco médio • desafio de integração','Médio'],['Conta Delta','Risco médio • baixa adoção','Médio']
])}
function reports(){return genericPage('Relatórios','Gere relatórios executivos a partir dos dados analisados.',[
  ['Resumo executivo semanal','Indicadores, riscos, oportunidades e principais ações.','PDF'],['Relatório de churn','Contas em risco e fatores associados.','PDF'],['Oportunidades comerciais','Pipeline identificado nas reuniões.','XLSX']
], true)}
function genericPage(title,subtitle,cards,download=false){return `${pageHead(title,subtitle,download?'<button class="primary-btn" id="exportReport">↓ Exportar relatório</button>':'')}
<div class="cards-list">${cards.map(c=>`<section class="card info-card"><div style="display:flex;justify-content:space-between"><h3>${c[0]}</h3><span class="tag">${c[2]}</span></div><p>${c[1]}</p><button class="secondary-btn" data-generic-action>Ver detalhes</button></section>`).join('')}</div>`}
function settings(){return `${pageHead('Configurações','Personalize sua experiência na Ominia.')}
<div class="settings"><section class="card setting-card"><h2>Preferências</h2><div class="setting-row"><span>Modo compacto</span><div class="switch ${state.compact?'on':''}" id="compactSwitch"><i></i></div></div><div class="setting-row"><span>Alertas de churn</span><div class="switch on"><i></i></div></div><div class="setting-row"><span>Resumo semanal por e-mail</span><div class="switch on"><i></i></div></div></section><section class="card setting-card"><h2>Privacidade e IA</h2><p style="color:#9fb2ca;line-height:1.6">A Ominia trabalha com conteúdos autorizados e pode aplicar anonimização antes do processamento.</p><button class="secondary-btn" data-generic-action>Gerenciar políticas</button></section></div>`}

function render(){
  const routes={home,meetings,insights,dashboard,clients,opportunities,risks,reports,ai,settings};
  main.innerHTML=(routes[state.route]||home)();
  bindPageEvents();
}

function bindPageEvents(){
  const select=document.querySelector('#selectFile'), input=document.querySelector('#fileInput'), drop=document.querySelector('#dropzone');
  if(select) select.onclick=()=>input.click();
  if(input) input.onchange=()=>input.files[0]&&processUpload(input.files[0]);
  if(drop){
    ['dragenter','dragover'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.add('drop-active')}));
    ['dragleave','drop'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.remove('drop-active')}));
    drop.addEventListener('drop',e=>e.dataTransfer.files[0]&&processUpload(e.dataTransfer.files[0]));
  }
  document.querySelector('#newMeeting')?.addEventListener('click',openNewMeetingModal);
  document.querySelectorAll('[data-open-meeting]').forEach(r=>r.onclick=()=>setRoute('meetings'));
  document.querySelector('#shareBtn')?.addEventListener('click',()=>navigator.clipboard?.writeText(location.href).then(()=>showToast('Link da reunião copiado.')).catch(()=>showToast('Reunião pronta para compartilhar.')));
  document.querySelector('#filterTranscript')?.addEventListener('click',()=>showToast('Filtro de transcrição ativado. Digite um termo na busca superior.'));
  document.querySelectorAll('[data-question]').forEach(b=>b.onclick=()=>sendQuestion(b.dataset.question));
  document.querySelector('#sendChat')?.addEventListener('click',()=>{const i=document.querySelector('#chatInput');if(i.value.trim())sendQuestion(i.value.trim())});
  document.querySelector('#chatInput')?.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.value.trim())sendQuestion(e.target.value.trim())});
  document.querySelectorAll('[data-generic-action]').forEach(b=>b.onclick=()=>showToast('Detalhes carregados no protótipo.'));
  document.querySelector('#exportReport')?.addEventListener('click',exportReport);
  document.querySelector('#compactSwitch')?.addEventListener('click',e=>{state.compact=!state.compact;e.currentTarget.classList.toggle('on',state.compact);document.documentElement.style.setProperty('--radius',state.compact?'10px':'16px');showToast('Preferência salva.');});
}

function processUpload(file){
  if(file.size>50*1024*1024){showToast('Arquivo maior que 50MB.');return}
  showToast(`Enviando ${file.name}...`);
  setTimeout(()=>{state.uploadedMeetings.unshift(file.name.replace(/\.[^.]+$/,''));showToast('Upload concluído. A análise de IA foi iniciada.');render();},1000)
}
function openNewMeetingModal(){
  modalRoot.innerHTML=`<div class="modal-backdrop"><div class="modal"><h2>Nova reunião</h2><div class="field"><label>Nome da reunião</label><input id="meetingName" value="Reunião com novo cliente"></div><div class="field"><label>Cliente</label><input id="clientName" placeholder="Nome do cliente"></div><div class="field"><label>Observações</label><textarea rows="4" placeholder="Contexto opcional para a análise"></textarea></div><div class="modal-actions"><button class="secondary-btn" id="cancelModal">Cancelar</button><button class="primary-btn" id="createMeeting">Criar reunião</button></div></div></div>`;
  document.querySelector('#cancelModal').onclick=()=>modalRoot.innerHTML='';
  document.querySelector('#createMeeting').onclick=()=>{const n=document.querySelector('#meetingName').value.trim()||'Nova reunião';state.uploadedMeetings.unshift(n);modalRoot.innerHTML='';render();showToast('Reunião criada. Você já pode enviar a transcrição.');};
}
function sendQuestion(q){
  if(state.route!=='ai'){setRoute('ai');setTimeout(()=>sendQuestion(q),0);return}
  const log=document.querySelector('#chatLog');
  log.insertAdjacentHTML('beforeend',`<div class="msg user"><div class="bubble">${escapeHtml(q)}</div><div class="avatar">RA</div></div>`);
  const loading=document.createElement('div');loading.className='msg';loading.innerHTML=`<img src="assets/nabu.png" class="chat-avatar"><div class="bubble"><div class="loader"></div></div>`;log.appendChild(loading);log.scrollIntoView({behavior:'smooth',block:'end'});
  document.querySelector('#chatInput').value='';
  setTimeout(()=>{loading.remove();log.insertAdjacentHTML('beforeend',`<div class="msg"><img src="assets/nabu.png" class="chat-avatar"><div class="bubble">${answerFor(q)}</div></div>`);log.lastElementChild.scrollIntoView({behavior:'smooth',block:'end'});},650);
}
function answerFor(q){const s=q.toLowerCase();if(s.includes('churn'))return 'Identifiquei 5 clientes com maior risco de churn nesta semana. O principal fator recorrente é queda de engajamento combinada a chamados abertos. Posso detalhar as contas e os próximos passos recomendados.';if(s.includes('upsell')||s.includes('oportun'))return 'Encontrei 8 oportunidades de upsell com alta probabilidade de conversão. As três principais somam aproximadamente R$ 200 mil em valor potencial, com destaque para CRM, integração e analytics.';if(s.includes('resum'))return 'Nesta semana, os tópicos mais recorrentes foram integração com CRM, dashboards gerenciais, produtividade comercial e expansão de módulos. Também houve aumento de menções a dificuldades de integração.';if(s.includes('interesse'))return 'Os principais interesses identificados são integração com CRM, expansão de módulos, dashboards gerenciais, visão 360° do cliente e automação de tarefas comerciais.';return 'Analisei o contexto disponível. Posso cruzar reuniões, clientes, riscos, oportunidades e recomendações para responder com mais precisão. Tente perguntar sobre churn, upsell, tópicos recorrentes ou interesses dos clientes.'}
function escapeHtml(s){return s.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]))}
function exportReport(){const csv='Relatorio,Valor\nRiscos em aberto,8\nOportunidades,12\nReunioes analisadas,23\n';const blob=new Blob([csv],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='omnia-relatorio.csv';a.click();URL.revokeObjectURL(a.href);showToast('Relatório exportado.');}

render();
