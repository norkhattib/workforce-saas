(() => {
  const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  function navItem(href,icon,key){const current=location.pathname.split('/').pop()||'dashboard.html';return `<a class="nav-item ${current===href?'active':''}" href="${href}"><span class="nav-icon">${icon}</span><span data-i18n="${key}"></span></a>`;}
  function renderNav(businessName='',role='owner'){
    const host=document.querySelector('[data-app-nav]');if(!host)return;
    host.innerHTML=`<aside class="sidebar"><div class="brand-block"><div class="brand-mark">W</div><div><strong>${esc(APP_CONFIG.APP_NAME)}</strong><small>${esc(businessName)}</small></div></div><div class="role-pill" data-i18n="role_${role}"></div><nav>${navItem('dashboard.html','⌂','dashboard')}${navItem('employees.html','♙','employees')}${navItem('shifts.html','◫','shifts')}${navItem('payments.html','₪','advances')}${navItem('payroll.html','▤','payroll')}${navItem('settings.html','⚙','settings')}</nav><div class="sidebar-footer"><select class="language-mini" data-language-select aria-label="Language"><option value="he">עברית</option><option value="ar">العربية</option><option value="en">English</option></select><button class="nav-logout" type="button" data-logout data-i18n="logout"></button></div></aside><nav class="bottom-nav">${navItem('dashboard.html','⌂','dashboard')}${navItem('employees.html','♙','employees')}${navItem('shifts.html','◫','shifts')}${navItem('payments.html','₪','advances')}${navItem('settings.html','⚙','settings')}</nav>`;
    host.querySelectorAll('[data-language-select]').forEach(s=>{s.value=i18n.getLanguage();s.onchange=e=>i18n.setLanguage(e.target.value)});host.querySelector('[data-logout]')?.addEventListener('click',auth.signOut);i18n.applyLanguage();
  }
  window.appNav={renderNav};
})();
