(() => {
  const BUSINESS_KEY = 'workforce_business_id';

  async function getMemberships() {
    const { data, error } = await window.db
      .from('business_users')
      .select('business_id, role, is_active, businesses(id,name,logo_url,is_active,subscription_plan,subscription_status)')
      .eq('is_active', true);
    if (error) throw error;
    return data || [];
  }

  async function resolveBusiness() {
    const memberships = await getMemberships();
    if (!memberships.length) return null;

    const saved = localStorage.getItem(BUSINESS_KEY);
    const active = memberships.find(m => m.business_id === saved) || memberships[0];
    localStorage.setItem(BUSINESS_KEY, active.business_id);
    return active;
  }

  async function getSettings(businessId) {
    const { data, error } = await window.db
      .from('business_settings')
      .select('*')
      .eq('business_id', businessId)
      .single();
    if (error) throw error;
    return data;
  }

  async function createBusiness(name, language) {
    const { data, error } = await window.db.rpc('create_business', {
      p_name: name,
      p_default_language: language
    });
    if (error) throw error;
    localStorage.setItem(BUSINESS_KEY, data);
    return data;
  }

  window.businessApi = { getMemberships, resolveBusiness, getSettings, createBusiness };
})();
