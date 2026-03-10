document.addEventListener('DOMContentLoaded', () => {
    // 1. Interceptar formularios de eliminación para usar AJAX y mostrar éxito antes de refrescar
    const deleteForms = document.querySelectorAll('form[onsubmit*="confirm"], form[action*="eliminar"]');
    deleteForms.forEach(form => {
        // Evitar doble binding si ya tenía algo
        if (form.dataset.smartAlert) return;
        form.dataset.smartAlert = "true";

        const originalOnSubmit = form.getAttribute('onsubmit');
        let message = '¿Estás seguro de realizar esta acción?';
        if (originalOnSubmit) {
            const match = originalOnSubmit.match(/confirm\(['"](.+?)['"]\)/);
            if (match) message = match[1];
        }

        form.removeAttribute('onsubmit');

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const url = this.action;
            const method = this.method || 'POST';

            Swal.fire({
                title: message,
                text: "Esta acción no se puede deshacer y los datos se eliminarán permanentemente.",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#6366f1',
                cancelButtonColor: '#f1f5f9',
                confirmButtonText: 'Sí, confirmar',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
                customClass: {
                    popup: 'premium-popup-compact',
                    title: 'premium-title-compact',
                    htmlContainer: 'premium-text-compact',
                    confirmButton: 'premium-confirm-compact',
                    cancelButton: 'premium-cancel-compact',
                    icon: 'premium-icon-compact'
                },
                buttonsStyling: false
            }).then((result) => {
                if (result.isConfirmed) {
                    // Mostrar estado de carga (opcional)
                    Swal.fire({
                        title: 'Procesando...',
                        allowOutsideClick: false,
                        didOpen: () => { Swal.showLoading(); },
                        customClass: { popup: 'premium-popup-compact' }
                    });

                    // Realizar la eliminación vía AJAX
                    fetch(url, {
                        method: method,
                        headers: { 'X-Requested-With': 'XMLHttpRequest' }
                    })
                        .then(response => {
                            if (response.ok || response.redirected) {
                                // Mostrar cuadro de EXCELENTE antes de recargar
                                Swal.fire({
                                    title: 'Excelente',
                                    text: 'Eliminación completada correctamente.',
                                    icon: 'success',
                                    iconColor: '#a5dc86',
                                    timer: 1000, // Reducido a la mitad (1 segundo)
                                    showConfirmButton: false,
                                    timerProgressBar: true,
                                    customClass: {
                                        popup: 'premium-popup-compact',
                                        title: 'premium-title-compact',
                                        htmlContainer: 'premium-text-compact'
                                    }
                                }).then(() => {
                                    // RECIÉN AQUÍ SE REFRESCA LA PÁGINA
                                    window.location.reload();
                                });
                            } else {
                                throw new Error('Error en la eliminación');
                            }
                        })
                        .catch(err => {
                            Swal.fire({
                                title: 'Error',
                                text: 'No se pudo completar la eliminación.',
                                icon: 'error',
                                customClass: { popup: 'premium-popup-compact' }
                            });
                        });
                }
            });
        });
    });

    // 2. Manejar alertas por parámetros de URL (para Ajustes y otras redirecciones de formulario completo)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('success')) {
        Swal.fire({
            title: 'Excelente',
            text: urlParams.get('msg') || 'Operación completada con éxito.',
            icon: 'success',
            iconColor: '#a5dc86',
            timer: 1500, // Reducido a la mitad (1.5 segundos)
            showConfirmButton: true, // Botón opcional por si el usuario tiene prisa
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#6366f1',
            timerProgressBar: true,
            customClass: {
                popup: 'premium-popup-compact',
                title: 'premium-title-compact',
                htmlContainer: 'premium-text-compact',
                confirmButton: 'premium-confirm-compact'
            },
            buttonsStyling: false
        });
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (urlParams.has('error')) {
        Swal.fire({
            title: 'Error',
            text: urlParams.get('msg') || 'Ocurrió un error inesperado.',
            icon: 'error',
            confirmButtonColor: '#c0392b',
            confirmButtonText: 'Cerrar',
            customClass: {
                popup: 'premium-popup-compact',
                confirmButton: 'premium-confirm-compact',
                title: 'premium-title-compact'
            },
            buttonsStyling: false
        });
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});

// Estilos Premium Compactos (Inyectados)
const style = document.createElement('style');
style.innerHTML = `
    .premium-popup-compact {
        border-radius: 20px !important;
        padding: 1.5rem 1rem !important;
        width: 400px !important;
        box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.1) !important;
        border: 1px solid #f1f5f9 !important;
    }
    .premium-icon-compact {
        width: 65px !important;
        height: 65px !important;
        margin: 10px auto 20px !important;
        border: 2px solid #f1f5f9 !important;
        transform: scale(0.9);
    }
    .swal2-icon.swal2-success {
        border-color: #a5dc86 !important;
    }
    .swal2-icon.swal2-question {
        border-color: #cbd5e1 !important;
        color: #64748b !important;
    }
    .premium-title-compact {
        font-family: 'Inter', system-ui, sans-serif !important;
        font-size: 1.5rem !important;
        font-weight: 750 !important;
        color: #1e293b !important;
        margin-bottom: 10px !important;
        line-height: 1.2 !important;
    }
    .premium-text-compact {
        font-size: 1rem !important;
        color: #64748b !important;
        margin-bottom: 25px !important;
        line-height: 1.5 !important;
    }
    .premium-confirm-compact {
        background-color: #6366f1 !important;
        color: white !important;
        padding: 12px 28px !important;
        border-radius: 10px !important;
        font-weight: 700 !important;
        border: none !important;
        margin: 0 8px !important;
        cursor: pointer !important;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        font-size: 0.95rem !important;
        display: inline-block !important;
    }
    .premium-confirm-compact:hover {
        background-color: #4f46e5 !important;
        transform: translateY(-1px) !important;
        box-shadow: 0 8px 15px -3px rgba(99, 102, 241, 0.3) !important;
    }
    .premium-cancel-compact {
        background-color: #f1f5f9 !important;
        color: #475569 !important;
        padding: 12px 28px !important;
        border-radius: 10px !important;
        font-weight: 700 !important;
        border: none !important;
        margin: 0 8px !important;
        cursor: pointer !important;
        transition: all 0.2s !important;
        font-size: 0.95rem !important;
        display: inline-block !important;
    }
    .premium-cancel-compact:hover {
        background-color: #e2e8f0 !important;
        color: #1e293b !important;
    }
    .swal2-loader {
        border-color: #6366f1 transparent #6366f1 transparent !important;
    }
`;
document.head.appendChild(style);
