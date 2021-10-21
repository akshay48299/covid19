import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  base_uri = environment.baseURL;

  getCovid19Data(countries: string) {
    return this.http.get(this.base_uri + countries);
  }
}
