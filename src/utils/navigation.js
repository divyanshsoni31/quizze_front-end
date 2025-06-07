// src/utils/navigation.js
export const goToDashboard = (navigate) => {
  const role = localStorage.getItem('userRole');
  navigate(role === 'creator' ? '/creator' : '/student');
};
