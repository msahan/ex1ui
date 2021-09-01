
export interface BowlingFrame{
    frameNumber : number;
    frameAttemptId : number; //should be 1, only needed if game allows for retries
    scores: Int32Array ;
    frameScore: number;
    IsInvalidated : boolean;
}