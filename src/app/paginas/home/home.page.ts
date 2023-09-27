import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  mensaje:string ="";
  elemento: any;
  usuario:any = {}

  constructor( public firebaseService: FirebaseService) {
  
    this.firebaseService.cargarMensajes("chats_4B")
                     .subscribe( ()=>{
                        setTimeout( ()=>{
                          this.elemento.scrollTop = this.elemento.scrollHeight;
                        },20);
                     });
   }

  ngOnInit(): void {
    this.elemento = document.getElementById("chat-mensajes");
  }

  enviarMensaje(){
    if(this.mensaje.length === 0){
      return;
    }
    this.firebaseService.agregarMensaje(this.mensaje);
    this.mensaje = "";
  }

}