function mostrarPopUp(mensaje) {
    const fondo = document.createElement('div');
    fondo.className = 'popup-fondo';

    const contenedor = document.createElement('div');
    contenedor.className = 'popup-contenedor';

    const texto = document.createElement('p');
    texto.textContent = mensaje;

    const botonCerrar = document.createElement('button');
    botonCerrar.textContent = 'Cerrar';
    botonCerrar.addEventListener('click', function() {
        fondo.remove();
    });

    fondo.addEventListener('click', function(evento) {
        if (evento.target === fondo) {
            fondo.remove();
        }
    });

    contenedor.appendChild(texto);
    contenedor.appendChild(botonCerrar);
    fondo.appendChild(contenedor);
    document.body.appendChild(fondo);
}