import { Input, Component, OnInit } from '@angular/core';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NgFor, NgIf } from '@angular/common';
import { BasededatosService } from '../../services/basededatos.service';

@Component({
  selector: 'app-ngbd-alert',
  standalone: true,
  imports: [NgbAlertModule, NgFor, NgIf],
  templateUrl: 'alert.component.html',
  styles: [
    `
      .alert-custom {
        color: #cc4dd5;
        background-color: #f0c4f3;
        border-color: #f0c4f3;
      }
    `,
  ],
})
export class NgbdAlertBasicComponent {
  // this is for the Closeable Alert
  @Input() public alerts: Array<IAlert> = [];

  alertas:any=[];

  constructor(private basededatosService:BasededatosService) { 

  }

  async ngOnInit(): Promise<void> {
    this.alertas = await this.basededatosService.getAlertas().toPromise();
  }

  async deleteAlerta(alerta_id:number){
    let a = confirm("Estas seguro/a? El bot volverá estar activo para este numero");
    if(a){
      await this.basededatosService.deleteAlertas(alerta_id).toPromise();
      this.alertas = await this.basededatosService.getAlertas().toPromise();
    }
  }
}

export interface IAlert {
  id: number;
  type: string;
  message: string;
}
