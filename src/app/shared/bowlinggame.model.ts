import { GamerPersona } from "./gamerpersona.model";

export interface BowlingGame{
    // key: number;
    id: string;
    laneID: number;
    groupName: string;
    gameDate: Date;
    created: Date;
    gamerPersonas: GamerPersona[]
}