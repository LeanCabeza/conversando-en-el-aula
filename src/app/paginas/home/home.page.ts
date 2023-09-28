import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild('content', { static: false }) content: ElementRef;
  mensaje:string ="";
  elemento: any;
  usuario:any = {}
  sala = "";
  showChat = false;
  showSpinner:boolean = false;
  audio = new Audio("/assets/sounds/pop.mp3");
  


  constructor( public firebaseService: FirebaseService,public navCtrl: NavController) {
   }

  ngOnInit(): void {
    this.elemento = document.getElementById("chat-mensajes");
    this.firebaseService.cargarMensajes("chats_4a")
      .subscribe(() => {
        setTimeout(() => {
          this.scrollChatToBottom();
        }, 5);
      });
  }

  ngAfterViewInit(): void {
    if (this.content) {
      this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
    }
  }

  scrollChatToBottom() {
    if (this.content) {
      this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
    }
  }

  enviarMensaje() {
    if (this.mensaje.length === 0) {
      return;
    }
    this.firebaseService.agregarMensaje(this.mensaje);
    this.mensaje = "";
    this.audio.play();
    setTimeout(() => {
      this.scrollChatToBottom();
    }, 500);
  }

  cargarSala(sala: string) {
    this.sala = sala;
    console.log(this.sala);
    this.firebaseService.cargarMensajes(sala)
      .subscribe(() => {
        setTimeout(() => {
          this.scrollChatToBottom();
        }, 20);
      });
    this.showChat = true;
    this.showSpinner = true;
    setTimeout(() => {
      this.showSpinner = false;
    }, 2000);
  }
  

}