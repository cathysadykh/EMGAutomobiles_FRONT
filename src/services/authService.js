const authService = {
    login: async (credentials) => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('token', data.token);
          return true;
        }
        return false;
      } catch (error) {
        console.error('Erreur de connexion:', error);
        return false;
      }
    },
  
    logout: () => {
      localStorage.removeItem('token');
    },
  
    isAuthenticated: () => {
      return !!localStorage.getItem('token');
    },
  };
  
  export default authService;
  