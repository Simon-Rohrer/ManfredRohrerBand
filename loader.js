//TODO ENTFERNE
// Component Loader - Lädt Header und Footer in alle Seiten
document.addEventListener('DOMContentLoaded', function () {
    // Header laden
    fetch('components/header.html')
        .then(response => response.text())
        .then(data => {
            const headerPlaceholder = document.getElementById('header-placeholder');
            if (headerPlaceholder) {
                headerPlaceholder.innerHTML = data;
            }
        })
        .catch(error => console.error('Error loading header:', error));

    // Footer laden
    fetch('components/footer.html')
        .then(response => response.text())
        .then(data => {
            const footerPlaceholder = document.getElementById('footer-placeholder');
            if (footerPlaceholder) {
                footerPlaceholder.innerHTML = data;
            }
        })
        .catch(error => console.error('Error loading footer:', error));
});
