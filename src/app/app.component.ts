import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { throwError } from 'rxjs';
import { BowlingGame } from './shared/bowlinggame.model';
import { BowlinggameService } from './shared/bowlinggame.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ex1ui';

  public bowlingGames: BowlingGame[] | undefined;

  constructor(private bowlingGameService : BowlinggameService ){}

  ngOnInit() {
    this.getBowlingGames();
  }

  public getBowlingGames() : void{
    this.bowlingGameService.getBowlingGames().subscribe( 
      ( response : BowlingGame[] ) => {
        this.bowlingGames = response;
      },
      (error: HttpErrorResponse ) => {
        this.handleError(error);
      }
    );
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }  

}
