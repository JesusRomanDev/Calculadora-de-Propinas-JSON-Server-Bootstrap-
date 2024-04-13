let cliente = {
    mesa: '',
    hora: '',
    pedido: []
}

const btnGuardarCliente = document.querySelector('#guardar-cliente');
//Tambien jala de la manera de leer primero el valor y ya solo hacemos destructuring en la funcion guardarCliente();
const mesaInput = document.querySelector('#mesa');
const horaInput = document.querySelector('#hora');
btnGuardarCliente.addEventListener('click', guardarCliente);
mesaInput.addEventListener('change', leerValor);
horaInput.addEventListener('change', leerValor);

function leerValor(e){
    cliente[e.target.name] = e.target.value;
    console.log(cliente);
}

function guardarCliente(){
    // const mesa = document.querySelector('#mesa').value;
    // const hora = document.querySelector('#hora').value;
    //Se le asignan estos valores y ya los podemos usar mas abajo para llenar el objeto
    const {mesa, hora} = cliente;
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
}