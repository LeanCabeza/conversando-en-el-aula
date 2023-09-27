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
  sala = "";
  showChat = false;
  showSpinner:boolean = false;


  constructor( public firebaseService: FirebaseService) {
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

  cargarSala(sala: string){
    this.firebaseService.cargarMensajes(sala)
    .subscribe( ()=>{
       setTimeout( ()=>{
         this.elemento.scrollTop = this.elemento.scrollHeight;
       },20);
    });
    this.showChat = true;
    this.sala == sala;

    this.showSpinner=true;
    setTimeout(() => {
      this.showSpinner=false;
    }, 2000);
  }
  

}