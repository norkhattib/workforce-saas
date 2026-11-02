(async () => {
  try {
    const session = await window.auth.requireAuth();
    if (!session) return;

    const membership = await window.businessApi.resolveBusiness();
    if (!membership) {
      location.replace('onboarding.html');
      return;
    }

    const business = membership.businesses;
    const businessId = membership.business_id;
    const settings = await window.businessApi.getSettings(businessId);
    if (!localStorage.getItem('workforce_lang') && settings?.default_language) {
      window.i18n.setLanguage(settings.default_language);
    }

    window.appNav.renderNav(business?.name || '', membership.role);
    document.querySelector('[data-business-name]').textContent = business?.name || '';
    const roleBadge=document.querySelector('[data-role-badge]'); if(roleBadge){roleBadge.dataset.i18n='role_'+membership.role;}

    const displayName = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '';
    document.querySelector('[data-user-name]').textContent = displayName;

    const { start, end } = window.appCommon.monthRange();
    const [employeesRes, shiftsRes, paymentsRes, providersRes, recentRes] = await Promise.all([
      window.db.from('employees').select('id', { count: 'exact', head: true }).eq('business_id', businessId).eq('is_active', true),
      window.db.from('shifts').select('id', { count: 'exact', head: true }).eq('business_id', businessId).gte('event_date', start).lt('event_date', end),
      window.db.from('employee_payments').select('amount').eq('business_id', businessId).eq('payment_type', 'advance').gte('payment_date', start).lt('payment_date', end),
      window.db.from('advance_providers').select('id', { count: 'exact', head: true }).eq('business_id', businessId).eq('is_active', true),
      window.db.from('shifts').select('id,title,event_date,start_time,clients(name),locations(name)').eq('business_id', businessId).order('event_date', { ascending: false }).limit(5)
    ]);

    [employeesRes, shiftsRes, paymentsRes, providersRes, recentRes].forEach(r => { if (r.error) throw r.error; });

    document.querySelector('[data-stat-employees]').textContent = employeesRes.count ?? 0;
    document.querySelector('[data-stat-shifts]').textContent = shiftsRes.count ?? 0;
    document.querySelector('[data-stat-providers]').textContent = providersRes.count ?? 0;

    const totalAdvances = (paymentsRes.data || []).reduce((sum, row) => sum + Number(row.amount || 0), 0);
    document.querySelector('[data-stat-advances]').textContent = new Intl.NumberFormat(window.i18n.getLanguage() === 'en' ? 'en-US' : 'he-IL', {
      style: 'currency', currency: settings?.currency || 'ILS', maximumFractionDigits: 0
    }).format(totalAdvances);

    renderRecent(recentRes.data || []);
    document.querySelector('[data-page-loading]')?.remove();
    document.querySelector('[data-dashboard-content]').hidden = false;
  } catch (error) {
    console.error(error);
    window.appCommon.toast(error.message || window.i18n.t('error_generic'), 'error');
  }

  function renderRecent(rows) {
    const host = document.querySelector('[data-recent-shifts]');
    if (!rows.length) {
      host.innerHTML = `<div class="empty-state" data-i18n="no_shifts"></div>`;
      window.i18n.applyLanguage();
      return;
    }
    host.innerHTML = rows.map(row => {
      const title = row.title || row.clients?.name || row.locations?.name || '—';
      const meta = [row.locations?.name, row.start_time?.slice(0,5)].filter(Boolean).join(' • ');
      return `<div class="recent-row"><div><strong>${escapeHtml(title)}</strong><small>${escapeHtml(meta)}</small></div><time>${formatDate(row.event_date)}</time></div>`;
    }).join('');
  }

  function formatDate(value) {
    if (!value) return '';
    return new Intl.DateTimeFormat(window.i18n.getLanguage() === 'en' ? 'en-GB' : 'he-IL', { day:'2-digit', month:'2-digit', year:'2-digit' }).format(new Date(`${value}T12:00:00`));
  }
  function escapeHtml(value='') { return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
})();
