let cliente = {
    mesa: '',
    hora: '',
    pedido: []
}

const categorias = {
    1: 'Comida',
    2: 'Bebidas',
    3: 'Postres'
}

const btnGuardarCliente = document.querySelector('#guardar-cliente');
btnGuardarCliente.addEventListener('click', guardarCliente);

function guardarCliente(){
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;
    //Se le asignan estos valores y ya los podemos usar mas abajo para llenar el objeto
    console.log(mesa);
    console.log(hora);

    //Revisar si hay campos vacios
    //El if de toda la vida para comprobar
    // if(mesa === '' || hora === ''){
    //     console.log('nohay nada we');
    // }
    //Pero ahora le intentaremos con el metodo SOME
    const camposVacios = [mesa, hora].some(campo => campo === ''); //convertimos a un arreglo mesa y hora, le aplicamos un arrayMetod
    //va a verificar que al menos 1 cumpla esa condicion
    if(camposVacios){
        //Verificar si ya hay una alerta
        const existeAlerta = document.querySelector('.invalid-feedback');
        if(!existeAlerta){
            const alerta = document.createElement('div');
            alerta.classList.add('invalid-feedback', 'd-block', 'text-center');
            alerta.textContent = 'Todos los campos son obligatorios';
            document.querySelector('.modal-body form').appendChild(alerta); //seleccionamos el form del modal body y le inyectamos la alerta

            setTimeout(()=> {
                alerta.remove();
            },3000);
        }
        return;
    }
    //Asignar datos del formulario a cliente
    cliente = {...cliente, mesa, hora}
    console.log(cliente);

    //Ocultar Modal
    //mFormulario y mBootstrap estan ligados, entonces para poder ocultarlo al darle click, seleccionamos y lo instanciamos y usamos
    //una funcion del modal de bootstrap
    const modalFormulario = document.querySelector('#formulario');
    const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario);
    modalBootstrap.hide();

    //Mostrando el Modal con la informacion(en el HTML tenemos una clase de NONE)
    
    //Mostrar Secciones
    mostrarSecciones();

    //Obtener plastillos de la API de JSON-SERVER
    //Para que jale tenemos que abrir la terminal en el proyecto estipulado y escribir
    //json-server --watch db.json --port 4000
    obtenerPlatillos();
}

function mostrarSecciones(){
    // const seccionesOcultas = document.querySelector('#platillos');
    // const seccionesOcultas2 = document.querySelector('#resumen');
    // seccionesOcultas.classList.remove('d-none');
    // seccionesOcultas.classList.add('display');

    // seccionesOcultas2.classList.remove('d-none');
    // seccionesOcultas2.classList.add('display');

    //Otra manera de hacerlo a la de arriba con menos codigo es 
    const seccionesOcultas = document.querySelectorAll('.d-none'); //querySelectorAll
    seccionesOcultas.forEach(seccion => seccion.classList.remove('d-none'));
}

function obtenerPlatillos(){
    const url = `http://localhost:3000/platillos`; //CAMBIO DE PUERTO DE REPENTE DEL 4000 al 3000 

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => mostrarPlatillos(resultado))
        .catch(error => console.log(error))
}

function mostrarPlatillos(platillos){
    const contenido = document.querySelector('#platillos .contenido'); //seleccionamos el id platillos entonces la clase de .contenido

    platillos.forEach(platillo =>{ //va a ir generando uno por uno de los resultados que tenemos en el arreglo
        console.log(platillo);
        const row = document.createElement('div');
        row.classList.add('row');

        const nombre = document.createElement('div');
        nombre.classList.add('col-md-4', 'py-3', 'border-top');
        nombre.textContent = platillo.nombre;

        const precio = document.createElement('div');
        precio.classList.add('col-md-3', 'fw-bold');
        precio.textContent = `$${platillo.precio}`;

        const categoria = document.createElement('div');
        categoria.classList.add('col-md-3');
        categoria.textContent = categorias[platillo.categoria]; //platillo.categoria nos imprime 1,2 o 3,
        //entonces como si nos dijeran categorias[1] va a ser comida, computa ese valor para que se busque en el objeto la LLAVE que sea igual al VALOR DE LA EXPRESION
        // const categorias = {
        //     1: 'Comida',
        //     2: 'Bebidas',
        //     3: 'Postres'
        // }
        //NOTA IMPORTANTE: ARRIBA SOLO UTILIZAMOS LOS [], A DIFERENCIA DE LOS TEMPLATE STRINGS `${}` es por eso que accesamos con punto
        //y no por la variable

        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.min = 0; //no puede ser menos de 0 lo que solicitan
        inputCantidad.value = 0;
        inputCantidad.id = `producto-${platillo.id}`;
        inputCantidad.classList.add('form-control');

        //Funcion que detecta la cantidad y el platillo que se esta agregando
        inputCantidad.onchange = function (){
            //Pero tambien queremos saber cuantas cantidades seleccionamos
            const cantidad = parseInt(inputCantidad.value);
            console.log(cantidad);
            //Tambien queremos que cantidad sea propiedad del objeto platillo y sea 1 solo objeto, no separados
            //Recordemos que el SPREAD lo que hace es DISTRIBUIR LOS ELEMENTOS DEL ARRAY/OBJETO, NO EL OBJETO EN SI
            //Es por eso que si ponemos agregarPlatillo({platillo, cantidad}) eso se agregara como un objeto y luego una cantidad
            //para hacerlos SOLO 1 OBJETO usamos el spread en platillo para distribuir lo elementos y que cantidad sea propiedad
            //de ese objeto
            //Ahora bien, para que son los {} AQUI EN EL ARGUMENTO, bueno, es para crear un objeto del objeto platillo, suena raro
            //pero el objeto de platillo se describiria asi 
            // {
            //     id: tal,
            //     nombre: tal,
            //     precio: tal,
            //     categoria: tal
            // }
            //pero al ponerle los {} en el argumento es como si se fuera hacia afuera, tendriamos
            //platillo: {
            //     id: tal,
            //     nombre: tal,
            //     precio: tal,
            //     categoria: tal
            // }
            //como vemos ahora nos dice el nombre del objeto y adentro tiene el objeto, es por eso que ya podemos usar 
            //spread operator, para DISTRIBUIR SUS ELEMENTOS, de otra forma no podriamos
            agregarPlatillo({...platillo, cantidad}); //con la sintaxis de object literal, ESTO SE CONVIERTE EN UN OBJETO NUEVO
            //
        }

        //Hay que agregarlo a un div el input para que nos funcione las columnas del bootstrap
        const agregar = document.createElement('div');
        agregar.classList.add('col-md-2');
        agregar.appendChild(inputCantidad);

        row.appendChild(nombre);
        row.appendChild(precio);
        row.appendChild(categoria);
        row.appendChild(agregar);
        contenido.appendChild(row);
    })
}

function agregarPlatillo(producto){ //producto es el ultimo producto que agregamos, entonces tenemos que mantener la referencia de pedido
    console.log(producto); //producto es un objeto
    //Extraer el pedido actual almacenado
    let {pedido} = cliente; //pedido es un array
    console.log(pedido);
    //REVISAR que la cantidad sea mayor a 0 para agregarlo en el arreglo de pedido
    //Si es menor a 0 que no lo agregue
    //Si es mayor a 0 queremos ir colocandolo en el arreglo del pedido del objeto cliente
    if(producto.cantidad > 0){
        //Si tenemos elementos que ya estan en el arreglo de pedido, ACTUALIZAMOS LA CANTIDAD
        //Some nos va a comprobar si ya existe en el arreglo
        if(pedido.some(articulo => articulo.id === producto.id)){ //nos retorna un true o false
            //Entonces el articulo ya existe, actualizemos la cantidad con un map retornando un nuevo arreglo
            const pedidoActualizado = pedido.map(articuloMap => {
                //Comprobar cual es el elemento que vamos a actualizar
                if(articuloMap.id === producto.id){ //aqui estamos en el elemento cuya cantidad tenemos que actualizar
                    articuloMap.cantidad = producto.cantidad; //la cantidad del arreglo de pedido sera igual a la cantidad del nuevo producto. porque la cantidad la estamos leyendo DEL INPUT (const cantidad = parseInt(inputCantidad.value))
                }
                return articuloMap; //se lo asigna al nuevo arreglo que es pedidoActualizado(este comparte linea abajo y arriba
                //la constante pedidoActualizado y )
            });
            //Se le asigna el nuevo array a cliente.pedido
            //Reescribimos totalmente el arreglo de pedido
            cliente.pedido = [...pedidoActualizado];
        }else{
            //El articulo no existe, lo agregamos al array de pedido
            cliente.pedido = [...pedido, producto];
        }
    }else{
        //Eliminar elementos cuando la cantidad es 0
        //Digamos que seleccionamos 4, y bajamos de cantidad 1 a 0, entonces ya solo tenemos 3 platillos, para esto nos 
        //sirve este codigo
        //En resumen, SI LE DAMOS CLICK Y SU CANTIDAD ES 0 SE EJECUTA ESTE CODIGO
        //Porque obviamente no queremos algun platillo que este en 0
        console.log('No es mayor a 0');
        const resultado = pedido.filter(productoEnCero => productoEnCero.id !== producto.id);
        console.log(resultado);
        cliente.pedido = [...resultado]; //le pasamos una copia con sus elementos separados del array resultado a cliente.pedido
        //La razon de arriba de ponerle el spread es porque si lo dejaramos como cliente.pedido=[resultado], le estariamos dejando asi
        //cliente.pedido = [[{id:tal, nombre: tal, precio: tal}]], es tener un arreglo dentro de un arreglo, no tiene mucho sentido
        console.log(cliente.pedido);
    }
    //Mostrar el Resumen
    console.log(cliente);
    limpiarHtml();

    //Comprobamos que el arreglo de pedido no este vacio
    if(cliente.pedido.length){
        actualizarResumen();   
    }else{
        mensajePedidoVacio();
    }
}

function actualizarResumen(){
    //    limpiarHtml(); aqui tambien puede ir el limpiarHTML, puedes ir siempre que sea antes de que se haga el appendchild y los
    //textContents
    const contenido = document.querySelector('#resumen .contenido');
    
    const resumen = document.createElement('div');
    resumen.classList.add('col-md-6', 'card', 'py-2', 'px-3', 'shadow');

    const mesa = document.createElement('p');
    mesa.textContent = 'Mesa: ';
    mesa.classList.add('fw-bold');

    const mesaSpan = document.createElement('span');
    mesaSpan.classList.add('fw-normal');
    mesaSpan.textContent = cliente.mesa;

    const hora = document.createElement('p');
    hora.textContent = 'Hora: ';
    hora.classList.add('fw-bold');

    const horaSpan = document.createElement('span');
    horaSpan.classList.add('fw-normal');
    horaSpan.textContent = cliente.hora;

    //Titulo de la seccion
    const heading = document.createElement('H3');
    heading.classList.add('my-4', 'text-center');
    heading.textContent = 'Platillos Consumidos'

    //Iterar sobre el array de pedidos e inyectarlo en el HTML
    const grupo = document.createElement('ul');
    grupo.classList.add('list-grpup');
    //Comenzamos a iterar sobre el array de pedido en nuestro objeto
    const {pedido} = cliente;
    pedido.forEach(articulo => {
        const {nombre, cantidad, precio, id} = articulo;

        const lista = document.createElement('li');
        lista.classList.add('list-group-item');

        //Nombre del Articulo
        const nombreEl = document.createElement('h4');
        nombreEl.classList.add('my-4');
        nombreEl.textContent = nombre;

        //Cantidad del Articulo
        const cantidadEl= document.createElement('p');
        cantidadEl.classList.add('fw-bold');
        cantidadEl.textContent = 'Cantidad: ';

        const cantidadValor = document.createElement('span');
        cantidadValor.classList.add('fw-normal');
        cantidadValor.textContent = cantidad;
        cantidadEl.appendChild(cantidadValor); //cantidadValor estara al lado de cantidadEl

        //Precio del Articulo
        const precioEl= document.createElement('p');
        precioEl.classList.add('fw-bold');
        precioEl.textContent = 'Precio: ';
        precioEl.onclick = function(){
            precioOnClick(precio)
        }

        const precioValor = document.createElement('span');
        precioValor.classList.add('fw-normal');
        precioValor.textContent = `$${precio}`; //template literals
        precioEl.appendChild(precioValor);

        
        //Subtotal del Articulo
        const subtotalEl= document.createElement('p');
        subtotalEl.classList.add('fw-bold');
        subtotalEl.textContent = 'Subtotal: ';

        const subtotalValor = document.createElement('span');
        subtotalValor.classList.add('fw-normal');
        subtotalValor.textContent = calcularSubtotal(precio, cantidad);
        subtotalEl.appendChild(subtotalValor);

        //Boton para eliminar
        const btnEliminar = document.createElement('button');
        btnEliminar.classList.add('btn', 'btn-danger');
        btnEliminar.textContent = 'Eliminar del Pedido'
        //Funcion para eliminar el pedido
        btnEliminar.onclick = function(){
            eliminarProducto(id); //como queremos pasarle un parametro entonces lo anidamos en esta funcion, de otra manera
            //si no necesitaramos un parametro quedaria: btnEliminar.onclick = eliminarProducto;
        }

        //Agregar Elementos al LI
        lista.appendChild(nombreEl);
        lista.appendChild(cantidadEl);
        lista.appendChild(precioEl);
        lista.appendChild(subtotalEl);
        lista.appendChild(btnEliminar);

        //Agregar lista al grupo principal
        grupo.appendChild(lista);
    });

    mesa.appendChild(mesaSpan);
    hora.appendChild(horaSpan);
    resumen.appendChild(heading);
    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(grupo);

    contenido.appendChild(resumen);

    //Mostrar Formulario de Propinas
    formularioPropinas();
}

function calcularSubtotal(precio, cantidad){
    return `$ ${precio * cantidad}`;
}

//Eliminando TODOOO ESE PRODUCTO
function eliminarProducto(id){
    console.log(id);
    const {pedido} = cliente;
    const resultado = pedido.filter(productoEnCero => productoEnCero.id !== id); //traeme todas menos el de este ID
    cliente.pedido = [...resultado]; //le pasamos una copia con sus elementos separados del array resultado a cliente.pedido
    
    console.log(cliente.pedido);
    limpiarHtml();
    //actualizarResumen();
    //Aun ya teniendo eliminado todo, aun en nuestra pagina nos queda el texto con la mesa, hora y el titulo de platillos consumidos
    //Podemos crear una funcion para que nos elimine todo eso, la funcion mensajePedidoVacio junto con un IF junto con actualizarResumen
    if(cliente.pedido.length){
        actualizarResumen();
    }else{
        mensajePedidoVacio();
    }

    //El producto se elimino, por lo tanto regresamos la cantidad a 0 en el formulario
    const productoEliminado = `#producto-${id}`;
    console.log(productoEliminado);
    const inputEliminado = document.querySelector(productoEliminado);
    inputEliminado.value = 0;
}

function mensajePedidoVacio(){
    const contenido = document.querySelector('#resumen .contenido');
    const texto = document.createElement('p');
    texto.classList.add('text-center');
    texto.textContent = 'Añade los elementos del pedido';

    contenido.appendChild(texto);
}

function formularioPropinas(){
    const contenido = document.querySelector('#resumen .contenido'); //queremos acceder al row para ponerlo en el resto de la pantalla
    const formulario = document.createElement('div');
    formulario.classList.add('col-md-6', 'formulario');

    const divFormulario = document.createElement('div');
    divFormulario.classList.add('card','py-2', 'px-3', 'shadow')

    const heading = document.createElement('H3');
    heading.classList.add('my-4', 'text-center');
    heading.textContent = 'Propina';

    //Agregando los 3 Radio Button para las Propinas
    
    //Radio Button 10%
    const radio10 = document.createElement('INPUT');
    radio10.type = 'radio';
    radio10.name = 'propina'; //este name lo tendran todos los check de radio, para que asi al seleccionar uno ya no puedas seleccionar otro(osea tener 2 seleccionados) 
    radio10.value = '10';
    radio10.classList.add('form-check-input');
    
    radio10.onclick = calcularPropina;

    const radio10Label = document.createElement('label');
    radio10Label.textContent = '10%';
    radio10Label.classList.add('form-check-label');

    const radio10Div = document.createElement('div');
    radio10Div.classList.add('form-check');

    radio10Div.appendChild(radio10); //se pone uno al lado de otro
    radio10Div.appendChild(radio10Label); //se pone uno al lado de otro

    //Radio Button 25%
    const radio25 = document.createElement('INPUT');
    radio25.type = 'radio';
    radio25.name = 'propina'; //este name lo tendran todos los check de radio, para que asi al seleccionar uno ya no puedas seleccionar otro(osea tener 2 seleccionados) 
    radio25.value = '25';
    radio25.classList.add('form-check-input');

    radio25.onclick = calcularPropina;

    const radio25Label = document.createElement('label');
    radio25Label.textContent = '25%';
    radio25Label.classList.add('form-check-label');

    const radio25Div = document.createElement('div');
    radio25Div.classList.add('form-check');

    radio25Div.appendChild(radio25); //se pone uno al lado de otro
    radio25Div.appendChild(radio25Label); //se pone uno al lado de otro

    //Radio Button 50%
    const radio50 = document.createElement('INPUT');
    radio50.type = 'radio';
    radio50.name = 'propina'; //este name lo tendran todos los check de radio, para que asi al seleccionar uno ya no puedas seleccionar otro(osea tener 2 seleccionados) 
    radio50.value = '50';
    radio50.classList.add('form-check-input');

    radio50.onclick = calcularPropina;

    const radio50Label = document.createElement('label');
    radio50Label.textContent = '50%';
    radio50Label.classList.add('form-check-label');

    const radio50Div = document.createElement('div');
    radio50Div.classList.add('form-check');

    radio50Div.appendChild(radio50); //se pone uno al lado de otro
    radio50Div.appendChild(radio50Label); //se pone uno al lado de otro


    //Agregando al Div Principal
    divFormulario.appendChild(heading);
    divFormulario.appendChild(radio10Div);
    divFormulario.appendChild(radio25Div);
    divFormulario.appendChild(radio50Div);

    //Agregando al Formulario
    formulario.appendChild(divFormulario);
    contenido.appendChild(formulario);
}

function limpiarHtml(){
    const contenido = document.querySelector('#resumen .contenido'); //tenemos que volver a agregarle la variable para identificar
    //la clase porque esta misma solo se encuentra en otra funcion, si no la ponemos nos marcara como que no esta definido
    while(contenido.firstChild){
        contenido.removeChild(contenido.firstChild)
    }
};

function calcularPropina(){
    console.log('desde calcular propina');
    const {pedido} = cliente;
    let subtotal = 0;

    //Calcular el Subtotal a pagar
    pedido.forEach(articulo =>{
        subtotal += articulo.cantidad * articulo.precio;
    });

    //Aqui podemos seleccionar un radio button, cual esta seleccionado y cual es su value
    //Seleccionamos la propina que dara el cliente
    const propinaSeleccionada = document.querySelector('[name= "propina"]:checked').value;

    //Calcular la Propina
    const propina = ((subtotal * parseInt(propinaSeleccionada)) / 100);
    console.log(propina);
    //Calcular el Total
    const totalAPagar = subtotal + propina;
    
    mostrarTotalHtml(subtotal, propina, totalAPagar);
}

function mostrarTotalHtml(subtotal, propina, totalAPagar){

    //Div de Totales a pagar
    const divTotales = document.createElement('div');
    divTotales.classList.add('total-pagar', 'my-5');

    //Subtotal
    const subtotalParrafo = document.createElement('p');
    subtotalParrafo.classList.add('fs-4', 'fw-bold', 'mt-2');
    subtotalParrafo.textContent = 'Subtotal Consumo: '

    const subtotalSpan = document.createElement('span');
    subtotalSpan.classList.add('fw-normal');
    subtotalSpan.textContent = `$${subtotal}`

    subtotalParrafo.appendChild(subtotalSpan);

    //Propina
    const propinaParrafo = document.createElement('p');
    propinaParrafo.classList.add('fs-4', 'fw-bold', 'mt-2');
    propinaParrafo.textContent = 'Propina: '

    const propinaSpan = document.createElement('span');
    propinaSpan.classList.add('fw-normal');
    propinaSpan.textContent = `$${propina}`

    propinaParrafo.appendChild(propinaSpan);

    //Total a Pagar
    const totalParrafo = document.createElement('p');
    totalParrafo.classList.add('fs-4', 'fw-bold', 'mt-2');
    totalParrafo.textContent = 'Total a Pagar: '

    const totalSpan = document.createElement('span');
    totalSpan.classList.add('fw-normal');
    totalSpan.textContent = `$${totalAPagar}`

    totalParrafo.appendChild(totalSpan);

    //Eliminar el ultimo resultado
    //Para que no se nos repita el HTML al seleccionar un radio button diferente
    const totalPagarDiv = document.querySelector('.total-pagar');
    if(totalPagarDiv){ //si ya existe algo con esta clase, quitalo para que no se nos repita el codigo
        totalPagarDiv.remove();
    }

    divTotales.appendChild(subtotalParrafo);
    divTotales.appendChild(propinaParrafo);
    divTotales.appendChild(totalParrafo);

    //En la funcion formularioPropinas creamos un div con la variable de formulario
    const formulario = document.querySelector('.formulario > div'); // > div significa que seleccione el primer DIV
    formulario.appendChild(divTotales);
}

function precioOnClick(precio){
    console.log(precio);
}