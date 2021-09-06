import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { BowlingGame } from './shared/bowlinggame.model';
import { BowlinggameService } from './shared/bowlinggame.service';
import { FormArray, FormBuilder, FormControl, FormGroup , Validators} from '@angular/forms';
import { debounceTime, retry, switchMap, takeUntil } from 'rxjs/operators';
//import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit , OnDestroy {
  title = 'ex1ui';

  //to be made private 
  public bowlingGames: BowlingGame[] | undefined;
  public gameForms: FormGroup ;
  // private gameForms1:  FormGroup  = new FormGroup({});
  private unsubscribe = new Subject<void>();

  constructor(private bowlingGameService : BowlinggameService , private fb: FormBuilder ) {
    // this.gameForms = fb.group({ games :  this.bowlingGames } ) ;
    this.gameForms = fb.group({ } ) ;
  }

  // constructor(private bowlingGameService : BowlinggameService ){}

  ngOnInit() {
    this.setBowlingGames();
  } 

  private setBowlingGames() : void{
    this.bowlingGameService.getBowlingGames().subscribe( 
      ( response : BowlingGame[] ) => {
        this.bowlingGames = response;
        this.gameForms = this.createGameForm( this.bowlingGames );
        // this.gameForms1 = this.createGameForm( this.bowlingGames );
      },
      (error: HttpErrorResponse ) => {
        this.handleError(error);
      }
    );
  }
  
  get gameFormArray() {
    var instGameFormArray = this.gameForms.get('gameFormArray') as FormArray;
    return instGameFormArray;

  }

  private createGameForm(pBowlingGames : BowlingGame[]): FormGroup {

//    var fgrp : FormGroup = new FormGroup({ gameFormArray: new FormArray([]) });  
    var fgrp : FormGroup = this.fb.group( { gameFormArray: this.fb.array([]) } );  

    if( pBowlingGames != undefined ){ 
      pBowlingGames.forEach(
        (bowlingGame, index) => { 
          const bgame =       this.fb.group( { 
              // key:            index,
              id:             new FormControl(bowlingGame.id),
              laneID:         new FormControl(bowlingGame.laneID),
              groupName:      new FormControl(bowlingGame.groupName ,  Validators.required ),
              gameDate:       new FormControl(bowlingGame.gameDate), 
              created:        new FormControl(bowlingGame.created), 
              gamerPersonas:  this.fb.array( [] ) as FormArray
            } );
            if( bowlingGame.gamerPersonas != undefined  && bowlingGame.gamerPersonas != null ){
              bowlingGame.gamerPersonas.forEach( (gamer, index2) => {
                    const bGamer = this.fb.group({
                      name:           new FormControl(gamer.name ,  Validators.required ),
                      bowlingFrames:  this.fb.array( [] ) as FormArray
                      }
                    );
                    if( gamer.bowlingFrames != undefined && gamer.bowlingFrames != null ){
                        gamer.bowlingFrames.forEach( ( bowlingFrame, index3)  => {
                          const bFrame = this.fb.group({
                            frameNumber : new FormControl(bowlingFrame.frameNumber),
                            // frameAttemptId : number,
                            scores: this.fb.array( [] ) as FormArray , // bowlingFrame.scores 
                            // frameScore: number,
                            // IsInvalidated : boolean;
                          });

                          if( bowlingFrame.scores != undefined && bowlingFrame.scores != null ){
                              bowlingFrame.scores.forEach( ( scoreValue , index4) => {
                                const bFrameScore = this.fb.group({
                                    ballIndex : new FormControl(index4),
                                    score     : new FormControl( scoreValue ) 
                                  });
                                  (bFrame.controls.scores as FormArray).push(bFrameScore);
                              } );
                            }

                          (bGamer.controls.bowlingFrames as FormArray).push(bFrame);
                        });

                    }

                    // (bgame.controls.gamerPersonas as FormArray).push(bGamer);
                    (bgame.controls.gamerPersonas as FormArray).push(bGamer);
                }
              );
            }
            // (fgrp.controls.gameFormArray as FormArray).push(bgame);
            (fgrp.controls.gameFormArray as FormArray).push(bgame);
          }
      ) ;
    }    

    // fgrp.valueChanges.pipe(
    //   debounceTime(500), // wait for 500 ms after last change before initiating save
    //   switchMap( formValue => this.bowlingGameService.save(formValue)), //use mergeMap instead of switchMap
    //   takeUntil(this.unsubscribe)
    // ).subscribe(() => console.log('Saved'))   

    return fgrp;

    // this.userData.forEach(
    //   (item) => {
    
    //     const userGroup = new FormGroup({
    //       id: new FormControl(item.id),
    //       group: new FormControl(item.group),
    //       userDetails: new FormArray([])
    //     });
    
    //     item.info.forEach((info) => {
    //       const userDetail = new FormGroup({
    //         name: new FormControl(info.name),
    //         number: new FormControl(info.number),
    //         remarks: new FormControl(info.remarks),
    //         active: new FormControl(info.active)
    //       });
    //       (userGroup.controls.userDetails as FormArray).push(userDetail);
    //     });
    
    //     (this.userForm.controls.userGroups as FormArray).push(userGroup);
    //   }
    // );

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

  ngOnDestroy() {
    this.unsubscribe.next();
  }

  public trackByFn(index: any, item: any) {
    return index;
 }

}
