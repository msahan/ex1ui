import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, throwError } from 'rxjs'; //
import { BowlingGame } from './shared/bowlinggame.model';
import { BowlinggameService } from './shared/bowlinggame.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup , MinValidator, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
// import { stringify } from '@angular/compiler/src/util';
//import { debounceTime, retry, switchMap, takeUntil } from 'rxjs/operators';

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
  // public static jsonLib : JSON  ;
  // private gameForms1:  FormGroup  = new FormGroup({});
  private unsubscribe = new Subject<void>();

  constructor(private bowlingGameService : BowlinggameService , private fb: FormBuilder ) {
    // this.gameForms = fb.group({ games :  this.bowlingGames } ) ;
    this.gameForms = this.fb.group({ } ) ;

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
      },
      (error: HttpErrorResponse ) => {
        this.handleError(error);
      }
    );

  }
  
  get gamesArray() {
    var instgamesArray = this.gameForms.get('gamesArray') as FormArray;
    return instgamesArray;

  }
  get gamerPersonasCurr() {
    return this.gameForms.get('gamesArray')?.get('gamerPersonas') as FormArray;

  }
  private createGameForm(pBowlingGames : BowlingGame[]): FormGroup {

    var fgrp : FormGroup = this.fb.group( { gamesArray :  this.fb.array([]) as FormArray } );  

    if( pBowlingGames != undefined ){ 
      pBowlingGames.forEach(
        (bowlingGame, index) => { 
          let bGameGroup =       this.fb.group( { 
              // key:            index,
              id:             new FormControl(bowlingGame.id),
              laneID:         new FormControl(bowlingGame.laneID),
              groupName:      new FormControl(bowlingGame.groupName , [ Validators.required, Validators.maxLength(40)] ),
              gameDate:       new FormControl(bowlingGame.gameDate), 
              created:        new FormControl(bowlingGame.created), 
              gamerPersonas:  this.fb.array( [] ) as FormArray
            } );
            if( bowlingGame.gamerPersonas != undefined  && bowlingGame.gamerPersonas != null ){
              bowlingGame.gamerPersonas.forEach( (gamer, index2) => {
                    let bGamer = this.fb.group({
                      playOrder:      new FormControl(gamer.playOrder ,  Validators.required ),
                      name:           new FormControl(gamer.name ,  Validators.required ),
                      bowlingFrames:  this.fb.array( [] ) as FormArray
                      }
                    );
                    if( gamer.bowlingFrames != undefined && gamer.bowlingFrames != null ){
                        gamer.bowlingFrames.forEach( ( bowlingFrame, index3)  => {
                          let bFrame = this.fb.group( 
                            { 
                              // controlsConfig : {
                                frameNumber : new FormControl(bowlingFrame.frameNumber),
                                // frameAttemptId : number,
                                scores: this.fb.array( [] ) as FormArray , // bowlingFrame.scores 
                                frameScore: bowlingFrame.frameScore,
                                // IsInvalidated : boolean;
                              // }
                              // , options : {} 
                            } ,
                            {  validators: frameScoreValidator, updateOn: 'blur' }
                          );
                          // let bFrame = this.fb.group( {
                          //       frameNumber : new FormControl(bowlingFrame.frameNumber),
                          //       // frameAttemptId : number,
                          //       scores: this.fb.array( [] ) as FormArray , // bowlingFrame.scores 
                          //       frameScore: bowlingFrame.frameScore,
                          //       // IsInvalidated : boolean;
                          //   }
                          // );
                          if( bowlingFrame.scores != undefined && bowlingFrame.scores != null ){
                              const frameMaxScore : number = 10;
                              let frameRawScoreTotal : number = 0;
                              let frameRemainderScore : number = 0;
                              let isTurnAllowed: boolean = false;

                              bowlingFrame.scores.forEach( ( scoreValue , index4) => {
                                frameRemainderScore = frameMaxScore - frameRawScoreTotal;
                                isTurnAllowed = frameRemainderScore > 0 ? true : false;
                                let bFrameScore = this.fb.group({
                                    ballIndex : new FormControl(index4),
                                    // score     : new FormControl( scoreValue,  [ Validators.required, Validators.min(0), Validators.max(frameRemainderScore), Validators.maxLength(2) ]    ),
                                    // score     : new FormControl( scoreValue,  [ Validators.required, Validators.min(2), 
                                    //                                             ( frmControlInput : AbstractControl) => Validators.max( frameRemainderScore )( frmControlInput )
                                    //                                             , Validators.maxLength(2) ]    ),
                                    //                                             remainderScore : frameRemainderScore,
                                    score     : [ scoreValue
                                                  // , { Validators: [ Validators.required, Validators.min(0), 
                                                  //                         ( frmControlInput : AbstractControl) => Validators.max( frameRemainderScore )( frmControlInput )
                                                  //                         , Validators.maxLength(2) ] 
                                                  //               // , updateOn: 'blur'
                                                  //             }
                                                ],
                                    remainder: frameRemainderScore,
                                    isEditable: isTurnAllowed
                                    // validators: [ Validators.max(frameRemainderScore) ]
                                  });
                                  (bFrame.controls.scores as FormArray).push(bFrameScore);
                                  frameRawScoreTotal = frameRawScoreTotal + scoreValue;
                              } );
                              //TODO - repeated logic - modularize
                              const remainingBallTurns : number = 2 - ( bFrame.controls.scores as FormArray ).length ;
                              isTurnAllowed = frameRemainderScore > 0 ? true : false;
                              for (let index5 = 0; remainingBallTurns > 0 && index5 < remainingBallTurns; index5++) {
                                frameRemainderScore = frameMaxScore - frameRawScoreTotal;
                                const bFrameScore = this.fb.group({
                                  ballIndex : new FormControl(remainingBallTurns-1-index5),
                                score     : [ null 
                                              // , [ Validators.required, Validators.min(0), 
                                              //     ( frmControlInput : AbstractControl) => Validators.max( frameRemainderScore )( frmControlInput )
                                              //     , Validators.maxLength(2) ]    
                                            ],
                                  remainder : frameRemainderScore,
                                  isEditable : isTurnAllowed 
                                });
                                //frameRawScoreTotal = frameRawScoreTotal + scoreValue;
                                (bFrame.controls.scores as FormArray).push(bFrameScore);
                              }
                            }

                          (bGamer.controls.bowlingFrames as FormArray).push(bFrame);
                        });

                    }

                    // (bgame.controls.gamerPersonas as FormArray).push(bGamer);
                    (bGameGroup.controls.gamerPersonas as FormArray).push(bGamer as FormGroup );
                }
              );
            }
            // (fgrp.controls.gamesArray as FormArray).push(bgame);
            (fgrp.controls.gamesArray as FormArray).push( bGameGroup as FormGroup );
          }
      ) ;
    }    

    // fgrp.valueChanges.pipe(
    //   debounceTime(500), // wait for 500 ms after last change before initiating save
    //   switchMap( formValue => this.bowlingGameService.save(formValue)), //use mergeMap instead of switchMap
    //   takeUntil(this.unsubscribe)
    // ).subscribe(() => console.log('Saved'))   

    // console.log(JSON.stringify(fgrp) );

    return fgrp;



  }


  // public  typeOfForComp(value : any ) {

    
  //   return AppComponent.toStringObj(value); 
  // }
  // private static toStringObj( value: any ){
  //   return JSON.stringify(value);
  // }
  
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



export const frameScoreValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const scoreCntrlArray =  ( control.get('scores') as FormArray).controls ;
  let rawScoreTotal : number = 0;
  let isError : boolean = false ;
  const currentFrameNumber = control.get('frameNumber')?.value;
  const maxScoreAlloweForFrame = currentFrameNumber == 10 ? 30 : 10;
  
  for( let ballScore  of scoreCntrlArray ){
    let currBallScoreValue = ( ballScore as FormGroup).controls.score.value;
    rawScoreTotal = rawScoreTotal + currBallScoreValue;
    isError = rawScoreTotal > maxScoreAlloweForFrame || currBallScoreValue < 0 ? true : false;
    if(isError) break;
  }
  return {frameScoreValidator: isError} ;
};