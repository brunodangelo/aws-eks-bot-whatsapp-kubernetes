import { Component, OnInit } from '@angular/core';
import {Product,TopSelling} from './top-selling-data';
import { BasededatosService } from '../../../services/basededatos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-top-selling',
  templateUrl: './top-selling.component.html'
})
export class TopSellingComponent implements OnInit {

  topSelling:Product[];

  alertas:any=[];

  constructor(private basededatosService:BasededatosService) { 

    this.topSelling=TopSelling;
  }

  async ngOnInit(): Promise<void> {
    this.alertas = await this.basededatosService.getAlertas().toPromise();
  }

  async deleteAlerta(alerta_id:number){
    Swal.fire({
      title: 'Estas seguro/a?',
      text:'El bot volverá a estar activo para este numero',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Confirmar',
      denyButtonText: `Cancelar`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        await this.basededatosService.deleteAlertas(alerta_id).toPromise();
        this.alertas = await this.basededatosService.getAlertas().toPromise();
        Swal.fire('Excelente!', 'La alerta fue atendida correctamente', 'success')
      } else if (result.isDenied) {
        
      }
    })
  }

  async deleteTodasAlertas(){
    Swal.fire({
      title: 'Estas seguro/a?',
      html:'Borrarás <b>TODAS</b> las alertas y el bot volverá a estar activo para TODOS los numeros',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Confirmar',
      denyButtonText: `Cancelar`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        await this.basededatosService.deleteTodasAlertas().toPromise();
        this.alertas = await this.basededatosService.getAlertas().toPromise();
        Swal.fire('Excelente!', 'Las alertas fueron atendidas correctamente', 'success');
      } else if (result.isDenied) {
        
      }
    })
  }

  refresh(){
    window.location.reload()
  }

}
