const sidebarToggleButton = document.getElementById('toggleSidebarButton');

function showSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggleButton = document.querySelector('.sidebar-toggle-button');
    const closeBtn = document.querySelector('.close-button');

    sidebar.classList.remove('hidden');
    sidebarToggleButton.style.display = 'none';

    $(sidebar).draggable({
        handle: closeBtn,
        containment: "body"
    });
}

function hideSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar.classList.contains('hidden')) {
        sidebar.classList.add('hidden');
        sidebarToggleButton.classList.add('active');
        sidebarToggleButton.style.display = '';
    }
}
