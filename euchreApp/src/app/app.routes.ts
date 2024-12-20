import { Routes } from '@angular/router';
import { BoardComponent } from './components/board/board.component';
import { StartScreenComponent } from './components/start-screen/start-screen.component';
import { PauseComponent } from './components/pause/pause.component';

export const routes: Routes = [
  { path: '', component: StartScreenComponent },
  { path: 'board', component: BoardComponent },
  { path: 'pause', component: PauseComponent },

  { path: '**', redirectTo: 'board' },
];
