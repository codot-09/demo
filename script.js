document.getElementById('searchInput').addEventListener('input', function() {
    let filter = this.value.toLowerCase();
    let apps = document.querySelectorAll('.app-card');

    apps.forEach(app => {
        let title = app.getAttribute('data-title').toLowerCase();
        if (title.includes(filter)) {
            app.style.display = "block";
        } else {
            app.style.display = "none";
        }
    });
});

function openApp(url) {
    window.open(url, '_blank');
}
