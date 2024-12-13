import { Component } from '@angular/core';
import { GameService, Game } from '../../services/game.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StorageService } from '../../services/storage.service';


@Component({
  selector: 'app-game',
  standalone: true,
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  imports: [FormsModule, RouterLink],
})
export class GameComponent {
  game: Game | null = null;
  playerNames: string[] = ['', '', '', '']; // Array to bind to input fields

  constructor(
    private gameService: GameService,
    private storageService: StorageService,
    private router: Router,
  ) { }

  async startGame(playerNames: string[]) {
    console.log("submitted");
    this.game = this.gameService.initializeGame(playerNames);
    console.log('Game initialized:', this.game);

    if (this.game && true) {
      // Save the game to Firestore
      await this.storageService.saveGame(this.game!);
      // const tempGame: Game | null = await this.storageService.getGame('U8lCnEkdAl8sq0WBiVza');
      // console.log(tempGame);
    }

    // Navigate to the board after initializing the game
    this.router.navigate(['/board']);
  }
}



