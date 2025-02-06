import { Component } from '@angular/core';
import { BasededatosService } from 'src/app/services/basededatos.service';
import { NgFor, NgIf } from '@angular/common';
import {FormsModule} from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  templateUrl: 'card.component.html',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule]
})
export class CardsComponent {
  opciones:any=[];
  opcion:any={};

  constructor(private basededatosService:BasededatosService) { 

  }

  async ngOnInit(): Promise<void> {
    this.opciones = await this.basededatosService.getOpciones().toPromise();
  }

  async updateOpcion(opcion_id:number,opcionForm:any){
    await this.basededatosService.updateOpcion(opcion_id,opcionForm).toPromise();
    this.closePopup();
    Swal.fire(
      'Excelente!',
      'Se ha actualizado la opción!',
      'success'
    )
    this.ngOnInit();
    await this.basededatosService.resetBot().toPromise();
  }

  displayStyle = "none";
  
  async openPopup(id: number) {
    this.displayStyle = "block";
    this.opcion = await this.basededatosService.getOpcionById(id).toPromise();
    this.opcion=this.opcion[0];
  }
  closePopup() {
    this.displayStyle = "none";
  }
}
