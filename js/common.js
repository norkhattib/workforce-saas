(() => {
  function toast(message,type='info'){let root=document.querySelector('.toast-root');if(!root){root=document.createElement('div');root.className='toast-root';document.body.appendChild(root);}const el=document.createElement('div');el.className=`toast ${type}`;el.textContent=message;root.appendChild(el);requestAnimationFrame(()=>el.classList.add('show'));setTimeout(()=>{el.classList.remove('show');setTimeout(()=>el.remove(),250)},3200);}
  function setButtonLoading(btn,loading,text){if(!btn)return;if(!btn.dataset.originalText)btn.dataset.originalText=btn.textContent;btn.disabled=loading;btn.textContent=loading?(text||i18n.t('saving')):btn.dataset.originalText;}
  function monthRangeFromInput(value){const [y,m]=value.split('-').map(Number);const start=`${y}-${String(m).padStart(2,'0')}-01`;const next=new Date(y,m,1);const end=`${next.getFullYear()}-${String(next.getMonth()+1).padStart(2,'0')}-01`;return{start,end};}
  function currentMonth(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;}
  function today(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
  function monthRange(date=new Date()){return monthRangeFromInput(`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}`);}
  function escapeHtml(v=''){return String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
  function fmtDate(v){if(!v)return'—';return new Intl.DateTimeFormat(i18n.getLanguage()==='en'?'en-GB':i18n.getLanguage()==='ar'?'ar':'he-IL',{day:'2-digit',month:'2-digit',year:'numeric'}).format(new Date(`${v}T12:00:00`));}
  function fmtMoney(v,currency='ILS'){return new Intl.NumberFormat(i18n.getLanguage()==='en'?'en-US':i18n.getLanguage()==='ar'?'ar':'he-IL',{style:'currency',currency,maximumFractionDigits:2}).format(Number(v||0));}
  function calcHours(start,end){if(!start||!end)return 0;const [sh,sm]=start.slice(0,5).split(':').map(Number),[eh,em]=end.slice(0,5).split(':').map(Number);let mins=(eh*60+em)-(sh*60+sm);if(mins<0)mins+=1440;return Math.round((mins/60)*100)/100;}
  function showModal(id){document.getElementById(id)?.classList.add('open');document.body.classList.add('modal-open');}
  function hideModal(id){document.getElementById(id)?.classList.remove('open');document.body.classList.remove('modal-open');}
  function wireModalClose(root=document){root.querySelectorAll('[data-modal-close]').forEach(b=>b.addEventListener('click',()=>hideModal(b.closest('.modal')?.id)));root.querySelectorAll('.modal').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)hideModal(m.id)}));}
  async function initApp(){const session=await auth.requireAuth();if(!session)return null;const membership=await businessApi.resolveBusiness();if(!membership){location.replace('onboarding.html');return null;}const settings=await businessApi.getSettings(membership.business_id);appNav.renderNav(membership.businesses?.name||'',membership.role);return{session,membership,business:membership.businesses,businessId:membership.business_id,settings,role:membership.role};}
  window.appCommon={toast,setButtonLoading,monthRange,currentMonth,monthRangeFromInput,today,escapeHtml,fmtDate,fmtMoney,calcHours,showModal,hideModal,wireModalClose,initApp};
})();
