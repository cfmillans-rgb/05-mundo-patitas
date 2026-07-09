/**
 * Mundo Patitas - JavaScript Principal
 * Funcionalidad de catálogo filtrable y efectos visuales (Tilt 3D)
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Filtrado de Catálogo ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productItems = document.querySelectorAll('.product-item');
    const noResultsMsg = document.getElementById('no-results');
    const resetFilterBtn = document.querySelector('.reset-filter-btn');

    // Preferencias de accesibilidad (reducción de movimiento)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ANIMATION_DURATION = prefersReducedMotion ? 0 : 400; // ms

    function filterProducts(filterValue) {
        let visibleCount = 0;

        // Fase 1: Ocultar los que no coinciden (Animación de salida)
        productItems.forEach(item => {
            const categories = item.getAttribute('data-category');
            const isMatch = filterValue === 'all' || categories.includes(filterValue);

            if (!isMatch) {
                // Iniciar animación de salida
                item.classList.add('filtering-out');
                item.classList.remove('filtering-in');
            }
        });

        // Fase 2: Esperar que termine la animación de salida para ocultar display y mostrar los nuevos
        setTimeout(() => {
            productItems.forEach(item => {
                const categories = item.getAttribute('data-category');
                const isMatch = filterValue === 'all' || categories.includes(filterValue);

                if (!isMatch) {
                    item.classList.add('d-none');
                } else {
                    // Si coincide, lo preparamos para mostrar
                    if (item.classList.contains('d-none')) {
                        item.classList.remove('d-none');
                        // Forzar reflow para que la animación se dispare
                        void item.offsetWidth; 
                    }
                    // Animación de entrada
                    item.classList.remove('filtering-out');
                    item.classList.add('filtering-in');
                    visibleCount++;
                }
            });

            // Manejo del estado "Sin resultados"
            if (visibleCount === 0) {
                noResultsMsg.classList.remove('d-none');
                // Pequeño delay para que aplique transición de opacidad (opcional)
                setTimeout(() => {
                    noResultsMsg.style.opacity = 1;
                }, 10);
            } else {
                noResultsMsg.classList.add('d-none');
            }
        }, ANIMATION_DURATION);
    }

    // Event Listeners para botones de filtro
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Actualizar estados activos y ARIA
            filterBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');

            const filterValue = btn.getAttribute('data-filter');
            filterProducts(filterValue);
        });
    });

    // Botón de reset en estado vacío
    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', () => {
            const btnAll = document.querySelector('.filter-btn[data-filter="all"]');
            if (btnAll) btnAll.click();
        });
    }

    // --- 2. Efecto 3D Tilt en Tarjetas ---
    const tiltCards = document.querySelectorAll('.tilt-card');

    if (!prefersReducedMotion) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                // Calcular posición del mouse relativa a la tarjeta
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Calcular el centro de la tarjeta
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Calcular rotación (máximo 8 grados)
                const rotateX = ((y - centerY) / centerY) * -8;
                const rotateY = ((x - centerX) / centerX) * 8;
                
                // Aplicar transformación temporalmente sin transición suave para que siga al cursor
                card.style.transition = 'none';
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                // Restaurar transición CSS original y posición original
                card.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            });
        });
    }
});
