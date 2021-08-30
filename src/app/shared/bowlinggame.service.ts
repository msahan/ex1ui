import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Observable } from 'rxjs';
import { BowlingGame } from './bowlinggame.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BowlinggameService {
  private apiServerUrl = 'http://localhost:8080';  //environment.apiBaseUrl; //'
  private http : HttpClient;

  constructor( iHttp: HttpClient ) { 
    this.http = iHttp;
  }

  public getBowlingGames(): Observable<BowlingGame[]> {
    return this.http.get<BowlingGame[]>(`${this.apiServerUrl}/api/v1/bowling`) ; //.toPromise( )
  }

  public addBowlingGames( bowlingGame : BowlingGame): Observable<BowlingGame> {
    return this.http.post<BowlingGame>(`${this.apiServerUrl}/api/v1/bowling/modify`, bowlingGame ) ; //.toPromise( )
  }




}
