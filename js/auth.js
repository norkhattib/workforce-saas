(() => {
  async function getSession() {
    const { data, error } = await window.db.auth.getSession();
    if (error) throw error;
    return data.session;
  }

  async function requireAuth() {
    const session = await getSession();
    if (!session) {
      location.replace('login.html');
      return null;
    }
    return session;
  }

  async function redirectIfLoggedIn() {
    const session = await getSession();
    if (!session) return;
    location.replace('dashboard.html');
  }

  async function signOut() {
    await window.db.auth.signOut();
    localStorage.removeItem('workforce_business_id');
    location.replace('login.html');
  }

  window.auth = { getSession, requireAuth, redirectIfLoggedIn, signOut };
})();
