import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BasededatosService {

  API_URI = environment.apiBack;

  constructor(private http:HttpClient) { }

  resetBot(){
    return this.http.get(`${this.API_URI}/reset`);
  }

  getAlertas(){
    return this.http.get(`${this.API_URI}/alertas`);
  }

  getOpciones(){
    return this.http.get(`${this.API_URI}/opciones`);
  }

  getOpcionById(id: string | number){
    return this.http.get(`${this.API_URI}/opciones/${id}`);
  }

  getOpcionesBot(){
    return this.http.get(`${this.API_URI}/opciones-bot`);
  }

  saveOpcion(formOpcion:any){
    return this.http.post(`${this.API_URI}/opciones`, formOpcion);
  }

  updateOpcion(id: string | number, updatedOpcion:any){
    return this.http.put(`${this.API_URI}/opciones/${id}`, updatedOpcion);
  }

  deleteAlertas(id: string|number){
    return this.http.delete(`${this.API_URI}/alertas/${id}`);
  }

  deleteTodasAlertas(){
    return this.http.delete(`${this.API_URI}/alertas`);
  }

}
