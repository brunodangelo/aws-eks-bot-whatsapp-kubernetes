import { Component, OnInit } from '@angular/core';
import {topcard,topcards} from './top-cards-data';
import { BasededatosService } from '../../../services/basededatos.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-top-cards',
  templateUrl: './top-cards.component.html'
})
export class TopCardsComponent implements OnInit {

  topcards:topcard[];

  urlQR=environment.apiBack+"/qr";

  constructor(private basededatosService:BasededatosService) { 
    this.topcards=topcards;
  }

  async ngOnInit(): Promise<void> {
    let alertas:any = await this.basededatosService.getAlertas().toPromise();
    this.topcards[0].title=alertas.length;
  }

  displayStyle = "none";
  
  openPopup() {
    this.displayStyle = "block";
  }
  closePopup() {
    this.displayStyle = "none";
  }

}
