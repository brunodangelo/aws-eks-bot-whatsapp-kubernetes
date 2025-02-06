import { Routes } from '@angular/router';
import { NgbdAlertBasicComponent } from './alert/alert.component';

import { CardsComponent } from './card/card.component';


export const ComponentsRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'opciones',
				component: CardsComponent
			},
			{
				path: 'alertas',
				component: NgbdAlertBasicComponent
			}
		]
	}
];
