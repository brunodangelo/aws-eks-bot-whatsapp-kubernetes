import { Component, } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  templateUrl: './about.component.html'
})
export class AboutComponent {

  urlQR=environment.apiBot;
  
  constructor() {
  }

  refresh(){
    window.location.reload();
  }

}
