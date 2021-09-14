
$( document ).ready(function() {
    document.getElementById('map').style.display = 'none';
    document.getElementById("error_txt_pedido").style.display = 'none';
    document.getElementById("error_txt_comercio").style.display = 'none';
    document.getElementById("error_txt_entrega").style.display = 'none';
    document.getElementById("error_txt_ciudad").style.display = 'none';
    document.getElementById("error_txt_ciudad1").style.display = 'none';
    document.getElementById("error_txt_solo_imagenes").style.display = 'none';
    document.getElementById("error_txt_5_megas").style.display = 'none';
    document.getElementById("error_txt_recibirlo").style.display = 'none';
    //document.getElementById("error_txt_tarjetas").style.display = 'none';
    document.getElementById("error_txt_hora").style.display = 'none';
    
    
});

var pagoSeleccionado;
var formaPago;

function procesarclickEfectivo(){
    pagoSeleccionado = "S";
    formaPago = "E";
}

function procesarclickTarjeta(){
    pagoSeleccionado = "S";
    formaPago = "T";
}



 //Deshabitilar y Habilitar input radio button 

function deshabilitarInput(){
    if(document.querySelector('#fecha_pedido').value !== '' || document.querySelector('#hora_pedido').value !== ''  ){
        document.querySelector('#btn_antes_posible').disabled = true; 
    } else{
        document.querySelector('#btn_antes_posible').disabled = false;
        if(document.querySelector('#btn_antes_posible').checked === true){
            document.querySelector('#fecha_pedido').disabled = true;
            document.querySelector('#hora_pedido').disabled = true;
            document.querySelector('#hora_pedido').value = '';
            document.querySelector('#fecha_pedido').value = '';
            document.querySelector('#fecha_pedido').style.cursor= 'auto';
            document.querySelector('#hora_pedido').style.cursor= 'auto';
        }
        else{
            document.querySelector('#hora_pedido').disabled = false;
            document.querySelector('#fecha_pedido').disabled = false;
            document.querySelector('#fecha_pedido').style.cursor= 'text';
            document.querySelector('#hora_pedido').style.cursor= 'text';    
        }
    }
}

// VALIDACION IMAGEN
const MAXIMO_TAMANIO_BYTES = 5000000; // 5MB         
const $imagen = document.querySelector("#imagen");
$imagen.addEventListener("change", function () {
    if (this.files.length <= 0) return;
    const archivo = this.files[0];
    var nombreArchivo = document.getElementById("imagen").value;
    var idxDot = nombreArchivo.lastIndexOf(".") + 1;
    var extFile = nombreArchivo.substr(idxDot, nombreArchivo.length).toLowerCase();
        document.getElementById("error_txt_solo_imagenes").style.display = 'none';
        document.getElementById("error_txt_5_megas").style.display = 'none';
    if (extFile=="jpg"){
        if (archivo.size > MAXIMO_TAMANIO_BYTES) {
            document.getElementById("error_txt_5_megas").style.display = 'block';
            $imagen.value = "";
        }                    
    }else{
        document.getElementById("error_txt_solo_imagenes").style.display = 'block';
        $imagen.value = "";
    }
});



//Validación de direcciones
const expresiones = {
    calle: /^[a-zA-Z0-9\s]{3,30}$/, // Letras, numeros, guion y guion_bajo
    numero: /^\d{1,5}$/,             // 1 a 5 numeros.
    calleComercio: /^[a-zA-Z0-9\s]{3,30}$/, // Letras, numeros, guion y guion_bajo
    numeroComercio: /^\d{1,5}$/             // 1 a 5 numeros.
}

const formulario = document.getElementById('formulario');
const inputs = document.querySelectorAll('#formulario input');

const campos = {
    calle: false,
    numero: false,
    calleComercio: false,
    numeroComercio: false,
}

const validarFormulario = (e) => {    
    switch(e.target.name) {
        case "calle":
            validarCampo(expresiones.calle, e.target, 'calle');
        break;
        case "numero":
            validarCampo(expresiones.numero, e.target, 'numero');
        break;
        case "calleComercio":
            validarCampo(expresiones.calleComercio, e.target, 'calleComercio');
        break;
        case "numeroComercio":
            validarCampo(expresiones.numeroComercio, e.target, 'numeroComercio');
        break;
    }
}

const validarCampo = (expresion, input, campo) =>{
    if(expresion.test(input.value)){
        document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-incorrecto');
        document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-correcto');
        document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.remove('formulario__input-error-activo');
        campos[campo] = true;
    }
    else{
        document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-incorrecto');
        document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-correcto');
        document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.add('formulario__input-error-activo');
        campos[campo] = false;
    }
}

inputs.forEach((input) => {
    input.addEventListener('keyup', validarFormulario);
    input.addEventListener('blur', validarFormulario);
});


// G-Maps ---------------------------------------------------------

// Ver coord de ubicación en consola 
//var ubicacion = new Localizacion();
//console.log(ubicacion)
google.maps.event.addDomListener(window, "load", function(){
    const ubicacion = new Localizacion(()=>{
        const myLatLng = {
                lat : ubicacion.latitude,
                lng : ubicacion.longitude
        }

        var texto = '<h4>Tu ubicación actual</h4>' + '<br><p>Aquí te encuentras actualmente</p>'

        const options = {
            center: myLatLng,
            zoom: 16
        }

        var map = document.getElementById('map');

        const mapa = new google.maps.Map(map,options);

        const marcador = new google.maps.Marker({
            position: myLatLng,
            map: mapa
            //title: "Marcador"
            
        })

        var informacion = new google.maps.InfoWindow({
            content: texto
        })

        marcador.addListener('click', function(){
            informacion.open(mapa,marcador);
        });

        var autocoplete = document.getElementById('txt_comercio');

        const search = new google.maps.places.Autocomplete(autocoplete);
        search.bindTo("bounds",mapa);

        search.addListener('place_changed', function(){
            informacion.close();
            marcador.setVisible(false);

            var place = search.getPlace();

            if(!place.geometry.viewport){
                window.alert("Error al mostrar el lugar");
                return
            }
            
            if(place.geometry.viewport){
                mapa.fitBounds(palce.geometry.viewport);
            }else{
                map.setCenter(palce.geometry.location);
                mapa.setZoom(18);
            }

            marcador.setPositiom(place.geometry.location);
            marcador.setVisible(true);

            var address = ""

            if(palce.address_components){
                address = [
                    (place.address_components[0] && place.address_components[0].short_name || ''),
                    (place.address_components[1] && place.address_components[1].short_name || ''),
                    (place.address_components[2] && place.address_components[2].short_name || '')
                ];
            }

            informacion.setContenet('<div><strong>'+place.name+'</strong><br>'+address+'</div>');
            informacion.open(map,marcador);

        });

    });

});

// G-Maps ---------------------------------------------------------

var flag = true 

function ubicacionActual(){
    document.getElementById('datos_comercio').style.display = 'none';
    document.getElementById('map').style.display = 'block';
    document.getElementById('calleComercio').value = 'calle';
    document.getElementById('calleComercio').focus();
    document.getElementById('numeroComercio').value = '1234';
    document.getElementById('numeroComercio').focus();
    document.getElementById('select').selectedIndex = 1;
    flag = false;
}

function ubicacionEspecifica(){
    document.getElementById('datos_comercio').style.display = 'block';
    document.getElementById('map').style.display = 'none';
    document.getElementById('calleComercio').value = '';
    document.getElementById('numeroComercio').value = '';
    document.getElementById('select').selectedIndex = 0;
    flag = true;
}

function desaparecerAlerta(){
    document.getElementById("pedido_enviado").style.display = 'none';
    return
}

function validar(){
    
    var txt_pedido = document.getElementById('txt_pedido').value;
    var fecha_pedido = document.getElementById('fecha_pedido').value;
    var select = document.getElementById('select').value;
    var select1 = document.getElementById('select1').value;

    if(txt_pedido == ''){
        document.getElementById("txt_pedido").focus();
        document.getElementById("error_txt_pedido").style.display = 'block';
        document.getElementById("error_txt_comercio").style.display = 'none';
        document.getElementById("error_txt_entrega").style.display = 'none';
        document.getElementById("error_txt_ciudad").style.display = 'none';
        document.getElementById("error_pagoElegido").style.display = 'none';
        document.getElementById("error_txt_recibirlo").style.display = 'none';
        document.getElementById("error_txt_ciudad1").style.display = 'none';
        //document.getElementById("error_txt_tarjetas").style.display = 'none';
        return
    }

    if(flag){
        if(campos.calleComercio == false || campos.numeroComercio == false){
            document.getElementById("calleComercio").focus();
            document.getElementById("error_txt_entrega").style.display = 'none';
            document.getElementById("error_txt_comercio").style.display = 'block';
            document.getElementById("error_txt_pedido").style.display = 'none';
            document.getElementById("error_txt_ciudad").style.display = 'none';
            document.getElementById("error_pagoElegido").style.display = 'none';
            document.getElementById("error_txt_recibirlo").style.display = 'none';
            document.getElementById("error_txt_ciudad1").style.display = 'none';
            return
        }    
    
        if(select == ''){
            document.getElementById("error_txt_ciudad").style.display = 'block';
            document.getElementById("error_txt_ciudad1").style.display = 'none';
            document.getElementById("error_txt_entrega").style.display = 'none';
            document.getElementById("error_txt_comercio").style.display = 'none';
            document.getElementById("error_txt_pedido").style.display = 'none';
            document.getElementById("error_pagoElegido").style.display = 'none';
            document.getElementById("error_txt_recibirlo").style.display = 'none';
            return
        }
    }


    
    if(campos.calle == false || campos.numero == false){
        document.getElementById("calle").focus();
        document.getElementById("error_txt_entrega").style.display = 'block';
        document.getElementById("error_txt_comercio").style.display = 'none';
        document.getElementById("error_txt_pedido").style.display = 'none';
        document.getElementById("error_txt_ciudad").style.display = 'none';
        document.getElementById("error_pagoElegido").style.display = 'none';
        document.getElementById("error_txt_recibirlo").style.display = 'none';
        document.getElementById("error_txt_ciudad1").style.display = 'none';
        return
    }

    if(select1 == ''){
        document.getElementById("error_txt_ciudad1").style.display = 'block';

        document.getElementById("error_txt_ciudad").style.display = 'none';
        document.getElementById("error_txt_entrega").style.display = 'none';
        document.getElementById("error_txt_comercio").style.display = 'none';
        document.getElementById("error_txt_pedido").style.display = 'none';
        document.getElementById("error_pagoElegido").style.display = 'none';
        document.getElementById("error_txt_recibirlo").style.display = 'none';
        return
    }

    if(pagoSeleccionado != 'S'){
        console.log("No selecciono metodo pago");
        document.getElementById("error_pagoElegido").style.display = 'block';

        document.getElementById("error_txt_ciudad").style.display = 'none';
        document.getElementById("error_txt_entrega").style.display = 'none';
        document.getElementById("error_txt_comercio").style.display = 'none';
        document.getElementById("error_txt_pedido").style.display = 'none';  
        document.getElementById("error_txt_recibirlo").style.display = 'none';
        document.getElementById("error_txt_ciudad1").style.display = 'none';
        return

    }
    else {
        if(formaPago == 'E'){
            document.getElementById("error_txt_ciudad").style.display = 'none';
            document.getElementById("error_txt_entrega").style.display = 'none';
            document.getElementById("error_txt_comercio").style.display = 'none';
            document.getElementById("error_txt_pedido").style.display = 'none';
            document.getElementById("error_pagoElegido").style.display = 'none';
            document.getElementById("error_txt_efectivo").style.display = 'none';
            document.getElementById("error_txt_ciudad1").style.display = 'none';
            //document.getElementById("error_txt_tarjetas").style.display = 'none';
            document.getElementById("error_txt_efectivo_negativo").style.display = 'none';
            
 
            //document.getElementById("error_txt_recibirlo").style.display = 'none';

            console.log("Entro efectivo");
            if(document.getElementById("txt_efectivo").value == '') {
                console.log("Campo abonar vacio");
                document.getElementById("error_txt_efectivo").style.display = 'block';
                return
            }
            else if(document.getElementById("txt_efectivo").value <= 0){
                document.getElementById("error_txt_efectivo_negativo").style.display = 'block';
                return
            }
        }
        else if(formaPago == 'T')
        {
            var num_tarjeta = document.getElementById('num_tarjeta').value;
            var n_a_titular = document.getElementById('n_a_titular').value;
            var cod_seg = document.getElementById('cod_seg').value;
            var fecha_venc = document.getElementById('fecha_venc').value;

            document.getElementById("error_txt_ciudad").style.display = 'none';
            document.getElementById("error_txt_entrega").style.display = 'none';
            document.getElementById("error_txt_comercio").style.display = 'none';
            document.getElementById("error_txt_pedido").style.display = 'none';
            document.getElementById("error_pagoElegido").style.display = 'none';
            document.getElementById("error_txt_recibirlo").style.display = 'none';
            document.getElementById("error_txt_ciudad1").style.display = 'none';
            document.getElementById("error_txt_tarjetas").style.display = 'none';
            
            if(num_tarjeta == "" || n_a_titular == "" || cod_seg == "" || fecha_venc == ""){
                document.getElementById("error_txt_tarjetas").style.display = 'block';
                return
            }
            

        }
    }
    
    if(fecha_pedido === '' && document.querySelector('#btn_antes_posible').checked === false){
        document.getElementById("error_txt_recibirlo").style.display = 'block';
        
        document.getElementById("error_txt_ciudad").style.display = 'none';
        document.getElementById("error_txt_entrega").style.display = 'none';
        document.getElementById("error_txt_comercio").style.display = 'none';
        document.getElementById("error_txt_pedido").style.display = 'none';
        document.getElementById("error_pagoElegido").style.display = 'none';
        document.getElementById("error_txt_ciudad1").style.display = 'none';
        return
    }

    if(fecha_pedido !== '' && document.querySelector('#btn_antes_posible').checked === false && document.getElementById("hora_pedido").value === '' ){
        document.getElementById("error_txt_hora").style.display = 'block';
        return
    }

    document.getElementById("error_txt_recibirlo").style.display = 'none';
    document.getElementById("error_txt_pedido").style.display = 'none';
    document.getElementById("error_txt_comercio").style.display = 'none';
    document.getElementById("error_txt_entrega").style.display = 'none';
    document.getElementById("error_txt_ciudad").style.display = 'none';
    document.getElementById("error_txt_ciudad1").style.display = 'none';
    //document.getElementById("error_txt_tarjetas").style.display = 'none';
    document.getElementById("error_txt_hora").style.display = 'none';

    document.getElementById("pedido_enviado").style.display = 'block';
    document.formLoQueSea.reset();
    setTimeout('desaparecerAlerta()',3000);
    

}