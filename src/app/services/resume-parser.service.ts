import { Injectable } from '@angular/core';
import {environment} from '../../config/config';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ResumeParserService {
  apiUrl = `${environment.apiUrl}/resume-parser/`;

  constructor(private http: HttpClient) {
  }

  post(body: any) {
    return this.http.post(this.apiUrl, body);
  }
}
