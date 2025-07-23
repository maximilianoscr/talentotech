document.addEventListener('DOMContentLoaded', () => {
    // Variables
    let baseDeDatos = [
        { id: 1, nombre: 'Pelota Futsal Oficial - GIVOVA', precio: 78000, imagen: './img/prod1.webp' },
        { id: 2, nombre: 'Camiseta Boca Juniors - Año 1991', precio: 30000, imagen: './img/prod2.webp' },
        { id: 3, nombre: 'Camiseta River Plate - Año 2007 ', precio: 1500, imagen: './img/prod3.webp' },
        { id: 4, nombre: 'Camiseta Afa - Argentina 78', precio: 28000, imagen: './img/prod4.webp' },
        { id: 5, nombre: 'Camiseta Independiente - Año 1990', precio: 28000, imagen: './img/prod5.webp' }
    ];

    let carrito = [];
    const moneda = '$';
    const DOMitems = document.querySelector('#items');
    const DOMcarrito = document.querySelector('#carrito');
    const DOMtotal = document.querySelector('#total');
    const DOMbotonVaciar = document.querySelector('#boton-vaciar');
    const DOMbotonComprar = document.querySelector('#boton-pagar');

    // Funciones

    function renderizarProductos() {
        baseDeDatos.forEach((info) => {
            const miNodo = document.createElement('div');
            miNodo.classList.add('card');
    
            const miNodoCardBody = document.createElement('div');
            
           // miNodoCardBody.classList.add('card');
           // miNodoCardBody.classList.add('card-body', 'd-flex', 'flex-column', 'justify-content-between');
    
            const miNodoImagen = document.createElement('img');
            miNodoImagen.classList.add('img-fluid', 'mb-3');
            miNodoImagen.setAttribute('src', info.imagen); 
            miNodoImagen.style.width = '100%'; 
            miNodoImagen.style.height = '100%'; 
    
            const miNodoTitle = document.createElement('h5');
            miNodoTitle.classList.add('card-title', 'text-center');
            miNodoTitle.textContent = info.nombre;
    
            const miNodoPrecio = document.createElement('p');
            miNodoPrecio.classList.add('card-text', 'text-center', 'mt-3');
            miNodoPrecio.textContent = `${info.precio}${moneda}`;
    
            const miNodoBoton = document.createElement('button');
            miNodoBoton.classList.add('btn', 'btn-success', 'mt-auto');
            miNodoBoton.textContent = 'Comprar';
            miNodoBoton.setAttribute('marcador', info.id);
            miNodoBoton.addEventListener('click', agregarProductoAlCarrito);
    
            miNodoCardBody.appendChild(miNodoImagen);
            miNodoCardBody.appendChild(miNodoTitle);
            miNodoCardBody.appendChild(miNodoPrecio);
            miNodoCardBody.appendChild(miNodoBoton);
    
            miNodo.appendChild(miNodoCardBody);
            DOMitems.appendChild(miNodo);
        });
    }
    

    function agregarProductoAlCarrito(evento) {
        carrito.push(parseInt(evento.target.getAttribute('marcador')));
        renderizarCarrito();
    }

    function renderizarCarrito() {
        DOMcarrito.textContent = '';
        const carritoSinDuplicados = [...new Set(carrito)];
        carritoSinDuplicados.forEach((item) => {
            const miItem = baseDeDatos.filter((itemBaseDatos) => itemBaseDatos.id === item);
            const numeroUnidadesItem = carrito.reduce((total, itemId) => itemId === item ? total += 1 : total, 0);
    
            const miNodo = document.createElement('li');
            miNodo.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center', 'mx-2');
    
            miNodo.innerHTML = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${miItem[0].precio}${moneda}`;
    
            const miBoton = document.createElement('button');
            miBoton.classList.add('btn', 'btn-danger');
            miBoton.textContent = 'x';
            miBoton.style.fontSize = '90%';
            miBoton.dataset.item = item;
            miBoton.addEventListener('click', borrarItemCarrito);
    
            miNodo.appendChild(miBoton);
            DOMcarrito.appendChild(miNodo);
        });
        DOMtotal.textContent = calcularTotal();
    }  

    function borrarItemCarrito(evento) {
        const id = parseInt(evento.target.dataset.item);  
        carrito = carrito.filter((carritoId) => carritoId !== id);
        renderizarCarrito();
    }

    function calcularTotal() {
        return carrito.reduce((total, item) => {
            const miItem = baseDeDatos.filter((itemBaseDatos) => itemBaseDatos.id === parseInt(item));
            return total + miItem[0].precio;
        }, 0).toFixed(2);
    }

    function vaciarCarrito() {
        carrito = [];
        renderizarCarrito();
    }

    function redirigirFormspree() {
        // Solicitar el email del usuario
        const email = prompt("Por favor, ingresa tu email para completar la compra:");
        
        // Validar que el usuario haya ingresado un email
        if (!email || !email.includes('@')) {
            alert("Por favor, ingresa un email válido.");
            return; // No continuar si el email no es válido
        }
        
        const form = document.createElement('form');
        form.action = 'https://formspree.io/f/xovlebqy'; // Reemplaza esta dirección con tu código de Formspree
        form.method = 'POST';
    
        // Agregar productos al formulario
        const carritoSinDuplicados = [...new Set(carrito)];
        carritoSinDuplicados.forEach(item => {
            const miItem = baseDeDatos.find(producto => producto.id === item);
            const cantidad = carrito.filter(id => id === item).length;
    
            const inputNombre = document.createElement('input');
            inputNombre.type = 'hidden';
            inputNombre.name = 'producto_nombre[]';
            inputNombre.value = miItem.nombre;
            form.appendChild(inputNombre);
    
            const inputPrecio = document.createElement('input');
            inputPrecio.type = 'hidden';
            inputPrecio.name = 'producto_precio[]';
            inputPrecio.value = miItem.precio;
            form.appendChild(inputPrecio);
    
            const inputCantidad = document.createElement('input');
            inputCantidad.type = 'hidden';
            inputCantidad.name = 'producto_cantidad[]';
            inputCantidad.value = cantidad;
            form.appendChild(inputCantidad);
        });
    
        // Agregar total al formulario
        const inputTotal = document.createElement('input');
        inputTotal.type = 'hidden';
        inputTotal.name = 'total';
        inputTotal.value = DOMtotal.textContent;
        form.appendChild(inputTotal);
    
        // Agregar el email al formulario
        const inputEmail = document.createElement('input');
        inputEmail.type = 'hidden';
        inputEmail.name = 'email';
        inputEmail.value = email;
        form.appendChild(inputEmail);
    
        document.body.appendChild(form);
        form.submit();
    }    

    DOMbotonVaciar.addEventListener('click', vaciarCarrito);
    DOMbotonComprar.addEventListener('click', redirigirFormspree);

    renderizarProductos();
    renderizarCarrito();
});

/*


Este código es un script JS para manejar un carrito de compras en un sitio web dinamicamente. 
Sus partes son:

Base de Datos: Contiene un array de productos con id, nombre, precio e imagen.
Una Función: Renderizar Productos, crea elementos HTML para mostrar los productos en la página.
La función: Agregar producto al Carrito, al hacer clic en un botón "Comprar", el producto se agrega al carrito.
La función: Renderizar Carrito, muestra los productos en el carrito, con la cantidad de cada uno y un botón para eliminarlo.
La función: Calcular Total, calcula el precio total del carrito.
La función: Vaciar Carrito, vacía el carrito cuando se hace clic en el botón "vaciar".
La función: Redirigir a Formspree, pide mediante un "prompt" un email al comprador y envía el total del carrito a un formulario en Formspree para hacer la compra añadiendo el email ingresado por el comprador como dato de contacto.
La estructura y la lógica de código es muy similar al código de carrito que compartimos en clases, sólo que este caso usamos Bootstrap para el estilo, agregamos imágenes al array y simplificamos el envío del formulario pidiendo un email al comprador. 

Hay varias alternativas gratuitas para reemplazar Formspree y  gestionar el envío de emails ilimitadamente y personalizadamente. Requieren un poco de exploración, algún traductor y algo de chatGPT para asisitirnos en la implementacion como: https://github.com/lexoyo/serverless-forms.git

*/