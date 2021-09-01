import { GamerPersona } from "./gamerpersona.model";

export interface BowlingGame{
    id: string;
    laneID: number;
    groupName: string;
    gameDate: Date;
    created: Date;
    gamerPersonas: GamerPersona[]
}