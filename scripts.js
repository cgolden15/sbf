document.addEventListener('DOMContentLoaded', function() {
  const currentYearElement = document.getElementById('current-year');
  const now = new Date();
  currentYearElement.textContent = now.getFullYear();
});
