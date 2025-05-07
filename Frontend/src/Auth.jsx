export const login = (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
  };
  
  export const logout = () => {
    localStorage.clear();
  };
  
  export const getRole = () => localStorage.getItem('role');
  export const isAuthenticated = () => !!localStorage.getItem('token');
  