import { Routes } from '@angular/router';
import { GameComponent } from './components/game/game.component';
import { BoardComponent } from './components/board/board.component';

export const routes: Routes = [
  { path: '', component: GameComponent },
  { path: 'board', component: BoardComponent }
];
