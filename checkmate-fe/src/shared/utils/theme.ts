export const enableDarkMode = () => {
  document.documentElement.classList.add('dark');
};

export const disableDarkMode = () => {
  document.documentElement.classList.remove('dark');
};

export const toggleDarkMode = () => {
  document.documentElement.classList.toggle('dark');
};
