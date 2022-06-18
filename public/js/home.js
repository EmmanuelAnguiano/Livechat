$(document).ready(function() {
    var socket = io();
    var idsala = 0;
    
    $.post( "/home/getRooms", function(data) {
        var sala = '';
        var ban = 0;
        var isactive;
        var title;

        if(data){
            data.forEach(element => {

                if(ban == 0){
                    isactive = 'is-active';
                    title = '<h6><span>Mensajes</span> / '+ element.nombre +'<svg class="feather feather-chevron-down" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></h6>';
                    ban = 1;
                    salaActiva(element.nombre, element.id);
                    idsala = element.id;
                }else{
                    isactive = '';
                }
;
                sala += '<li id="'+ element.id +'" class="salasmenu"><a id="'+ element.id +'" class="sidebar-link '+ isactive +'"><div class="menu-icon"><svg class="feather feather-book" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg></div><div class="menu-link"><span class="nomSala">' + element.nombre +'</span></div></a></li>';
            });
        }else{
            var nombre = 'Sin salas';
            title = '<h6 class="nada"><span>Mensajes</span> / '+ nombre +' <svg class="feather feather-chevron-down" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></h6>';
            sala += '<li id="0" class="nada"><a class="sidebar-link"><div class="menu-icon"></div><div class="menu-link"><span class="nomSala">'+ nombre +'</span></div></a></li>';
        }
        
        $('.list-unstyled').append(sala);
        $('.left-header-title').append(title);
        
    });
    
    $('#sendRoom').click(function(){
        var newSala = '';
        var nom = $('#nameRoom').val();
        var algo = $('.nada').attr('id');
        var title = '';
        var isactive;

        if(nom){
            $.post("/home/addRoom", { name : nom } ,function(data){
                if(algo == 0){
                    $('.nada').remove()
                    title = '<h6><span>Mensajes</span> / '+ nom +' <svg class="feather feather-chevron-down" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></h6>';
                    $('.left-header-title').append(title);
                    isactive = 'is-active';
                }

                newSala += '<li id="'+ data['insertId'] +'"><a class="sidebar-link '+ isactive +'""><div class="menu-icon"><svg class="feather feather-book" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg></div><div class="menu-link"><span class="nomSala">' + nom +'</span></div></a></li>';

                $('#mRooms').modal('hide');
                $('#nameRoom').val('');
                $('.list-unstyled').append(newSala);
            });  
        }
    });
    
    $(document).on('click', 'li', function(){

        var ant = $('a.is-active').attr('id');
        idsala = $(this).attr('id');
        var nomSala = $(this).text();

        $("a").removeClass('is-active');
        $(this).children('a').addClass('is-active');

        $('.chat-area').empty();
        $('#msgnw').val("");

        salaActiva(nomSala, parseInt(idsala));
    });

    function salaActiva(nombre, id) {
        socket.emit('salaActiva', {
          idSala: id,
          nombreSala: nombre
        });
    }

    socket.on('mensaje', ({usuario, mensaje}) =>{
        var time = hora();
        var pr;
        var nameU = usuario;

        if(nameU != 'BotChat'){
            pr = nameU.charAt(0);
        }else{
            pr = 'BC';
        }
        pr = pr.toUpperCase(); 

        varchatmsg = `<div class="chat-msg"><div class="chat-smg-img"><div class="img bg-color"><span class="img-color" >${pr}</span></div></div><div class="chat-msg-content"><div class="chat-msg-name"><div class="msg-name"><h6>${usuario}</h6></div><div class="msg-time"><span>${time}</span></div></div><div class="chat-msg-text"><p>${mensaje}</p></div></div></div>`;

      $('.chat-area').append(varchatmsg);
      $('#msgnw').val("");
    });

    $("#msgnw").keypress(function(e) {
        if(e.which == 13) {
            var text = $("#msgnw").val();
          if(text){
            socket.emit('mjsNuevo', text); // Enviamos el nuevo mensaje a la función de mensaje nuevo.
          }else{
            alert('Favor de escribir un mensaje....')
          }
        }
      });

    function hora() {
        const d = new Date();
        let hr = d.getHours();
        var min = d.getMinutes();

        if (min < 10) {
            min = "0" + min;
        }

        var ampm = "am";
        if( hr > 12 ) {
            hr -= 12;
            ampm = "pm";
        }

        var hora = hr + ':' + min + ampm;

        return  hora;
    }

});