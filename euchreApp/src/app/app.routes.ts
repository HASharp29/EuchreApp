import { Routes } from '@angular/router';
import { BoardComponent } from './components/board/board.component';
import { StartScreenComponent } from './components/start-screen/start-screen.component';

export const routes: Routes = [
  { path: '', component: StartScreenComponent },
  { path: 'board', component: BoardComponent }
];
