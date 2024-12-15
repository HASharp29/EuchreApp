import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Game } from '../../services/game.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-pause',
  standalone: true,
  imports: [RouterModule],
  template: `
    <body>
      <div>Paused</div>
      <button (click)="resumeGame()">Resume</button>
      <button (click)="saveGame()">Save and Quit</button>
      <button [routerLink]="['/']">Quit</button>
    </body>
  `,
  styleUrl: './pause.component.css'
})
export class PauseComponent {
  game: Game | null = null;

  constructor(
    private router: Router, 
    private storageService: StorageService,
  ) {
    // Access the state object from the router
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { game: Game };

    if (state?.game) {
      this.game = state.game;
      console.log("Game passed to PauseComponent:", this.game);
    } else {
      console.error("No game found in state. Returning to start screen.");
      this.router.navigate(['/']);
    }

    
  }

  async saveGame() {
    // Save the game to Firestore
    await this.storageService.saveGame(this.game!);

    // Simulate save delay and navigate to the start screen
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 3000);
  }

  resumeGame() {
    // Navigate back to the board and pass the game object back as state
    this.router.navigate(['/board'], {
      state: { game: this.game }
    });
  }
}
