document.addEventListener('DOMContentLoaded', function() {
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const proyectImages = document.querySelectorAll('.proyecto-img');

    // Función para abrir el lightbox
    function openLightbox(imageSrc, imageAlt) {
        lightboxImg.src = imageSrc;
        lightboxImg.alt = imageAlt;
        lightboxModal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; 
    }

    // Función para cerrar el lightbox
    function closeLightbox() {
        lightboxModal.style.display = 'none';
        document.body.style.overflow = 'auto'; 
    }

    // Event listeners para todas las imágenes de proyectos
    proyectImages.forEach(img => {
        img.addEventListener('click', function() {
            openLightbox(this.src, this.alt);
        });
    });

    // Event listener para cerrar con el botón X
    lightboxClose.addEventListener('click', function(e) {
        e.stopPropagation();
        closeLightbox();
    });

    // Event listener para cerrar clickeando en el fondo
    lightboxModal.addEventListener('click', function(e) {
        if (e.target === lightboxModal) {
            closeLightbox();
        }
    });

    // Event listener para cerrar con la tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightboxModal.style.display === 'flex') {
            closeLightbox();
        }
    });

    // Prevenir que el click en la imagen del lightbox cierre el modal
    lightboxImg.addEventListener('click', function(e) {
        e.stopPropagation();
    });
});