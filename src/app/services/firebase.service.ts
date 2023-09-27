import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2'




@Injectable({
  providedIn: 'root'
})

export class FirebaseService {

  constructor(public auth: AngularFireAuth,
              public navCtrl: NavController, 
              public alertController: AlertController,
              private firestore: AngularFirestore
              ) { }

   myDate = new Date();
   cosasLindas: any[] = [];

  login(correo:any, password:any){
        this.auth.signInWithEmailAndPassword(correo,password).then((res) => {
          let userCorreo = res.user?.email ? res.user?.email : '';
          localStorage.setItem("correo", userCorreo);
          this.navCtrl.navigateRoot('/home');
          console.log(userCorreo);
        }).catch(async (error) => {
          let errorMessage = error.message;
          if (errorMessage.includes('correo', 'password') || !correo.valid && !password.valid) {
            errorMessage = 'Debe ingresar un correo y contraseña correcta';
          } else if (errorMessage.includes('password') || !password.valid) {
            errorMessage = 'Por favor, ingrese una contraseña válida.';
          } else {
            errorMessage = "Usuario inexistente";
          }
          console.log(errorMessage);

         this.presentAlert("Error",errorMessage)
        });
    }

    async presentAlert(header: string, subHeader: string, message?: string) {
      const alert = await this.alertController.create({
        header: header,
        subHeader: subHeader,
        message: message,
        buttons: ['OK'],
      });
      await alert.present();
    }

    async guardarRegistro(email: any, foto: any, coleccion: string) {
      this.myDate = new Date();

      let fotoData = {
        email: email,
        foto: foto,
        fecha: this.myDate.toLocaleDateString() + " " + this.myDate.toLocaleTimeString(),
        likes: 0 
      }
      
      try {
        const result = await this.firestore.collection(coleccion).add(fotoData);
        console.log('Registro guardado con ID: ', result.id);
        this.presentAlert("Exito","'Registro guardado");
        return result.id;
      } catch (error) {
        this.presentAlert("Error","Error al guardar foto");
        throw error;
      }
    }

    getUserLogged(){
      return this.auth.authState;
    }

    async obtenerCosas(collection: string) {
      try {
        return this.firestore.collection(collection, ref => ref.orderBy('fecha', 'desc')).snapshotChanges().pipe(
          map(actions => {
            return actions.map(a => {
              const data = a.payload.doc.data();
              const id = a.payload.doc.id;
              return Object.assign({}, data, { id });
            });
          })
        );
      } catch (error) {
        console.error('Error al obtener las cosas lindas:', error);
        throw error;
      }
    }

    async buscarFotosPorEmail(email: any,coleccion: string) {
      try {
        return this.firestore.collection(coleccion, ref => ref.where('email', '==', email)).snapshotChanges().pipe(
          map(actions => {
            return actions.map(a => {
              const data = a.payload.doc.data();
              const id = a.payload.doc.id;
              return Object.assign({}, data, { id });
            });
          })
        );
      } catch (error) {
        console.error('Error al buscar fotos por email:', error);
        throw error;
      }
    }

    async actualizarRegistro(cosa: any, coleccion: string) {
      try {
        const docId = cosa.id; // Obtén el ID del documento
        delete cosa.id; // Elimina el campo 'id' para evitar problemas de actualización
    
        await this.firestore.collection(coleccion).doc(docId).update(cosa);
        console.log('Registro actualizado con ID: ', docId);
      } catch (error) {
        this.presentAlert('Error', 'Error al actualizar el registro');
        throw error;
      }
    }

    async logout() {

      Swal.fire({
        title: 'Estas seguro de que queres salir?',
        text: "No hay vuelta atras eh!",
        icon: 'warning',
        heightAuto: false,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, deseo salir'
      }).then((result) => {
        if (result.isConfirmed) {
          try {
            this.auth.signOut();
            localStorage.removeItem("correo"); 
            this.navCtrl.navigateRoot('/login'); 
          } catch (error) {
            console.error('Error al cerrar sesión:', error);
          }
          Swal.fire({
            title: 'Saliste con exito',
            text: "Hasta pronto",
            icon: 'success',
            heightAuto: false
          });
        }
      })
    }
    
  }