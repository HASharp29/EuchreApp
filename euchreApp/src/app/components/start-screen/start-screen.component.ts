import { Component, inject } from '@angular/core';
import { GameService, Game, Player } from '../../services/game.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StorageService } from '../../services/storage.service';


@Component({
  selector: 'app-game',
  standalone: true,
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.css'],
  imports: [FormsModule, RouterLink, ReactiveFormsModule],
})
export class StartScreenComponent {
  game: Game | null = null;
  gameList: { gameId: string, timestamp: any, players: Player[] }[] | null = null;
  selectedGameId: string | null = null; // To store the selected game ID
  fb = inject(FormBuilder);
  playerForm = this.fb.group({
    player0: ["", Validators.required],
    player1: ["", Validators.required],
    player2: ["", Validators.required],
    player3: ["", Validators.required],
  })

  constructor(
    private gameService: GameService,
    private storageService: StorageService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadGames();
  }

  async loadGames() {
    // Load all games using the StorageService
    this.gameList = await this.storageService.getAllGames();
    this.gameList = this.gameList.sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate());
  }

  // Format the game display to show timestamp and player names
  formatGameDisplay(game: { gameId: string, timestamp: any, players: Player[] }): string {
    const date = game.timestamp.toDate();  // Convert Firestore Timestamp to JS Date
    const dateString = date.toLocaleString(); // Format the date as a string
    const playerNames = game.players.map(player => player.name).join(', '); // Get player names

    return `${dateString}: ${playerNames}`;
  }

  async startGame() {

    // Extract player names from the form
    const playerNames: string[] = [
    this.playerForm.get('player0')?.value || '',
    this.playerForm.get('player1')?.value || '',
    this.playerForm.get('player2')?.value || '',
    this.playerForm.get('player3')?.value || '',
  ];

    console.log("submitted");
    this.game = this.gameService.initializeGame(playerNames);
    // console.log('Game initialized:', this.game);

    // if (this.game && true) {
    //   // Save the game to Firestore
    //   // await this.storageService.saveGame(this.game!);
    //   // const tempGame: Game | null = await this.storageService.getGame('U8lCnEkdAl8sq0WBiVza');
    //   // console.log(tempGame);
    // }

    // // Navigate to the board after initializing the game
    // this.router.navigate(['/board']);

    // Navigate to the board and pass the game object as state
    this.router.navigate(['/board'], {
      state: { game: this.game }
    });
  }

  async continueGame() {
    if (!this.selectedGameId) {
      alert("Please select a game to continue.");
      return;
    }

    try {
      // Fetch the selected game data from the database
      const game = await this.storageService.getGame(this.selectedGameId);

      if (!game) {
        alert("Failed to retrieve the selected game.");
        return;
      }
      console.log(game);
      // Navigate to the board screen and pass the game object as state
      this.router.navigate(['/board'], { state: { game } });
    } catch (error) {
      console.error("Error continuing game:", error);
      alert("An error occurred while loading the game. Please try again.");
    }
  }
}




