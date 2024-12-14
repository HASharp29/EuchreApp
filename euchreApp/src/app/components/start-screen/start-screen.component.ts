import { Component, inject } from '@angular/core';
import { GameService, Game } from '../../services/game.service';
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
}




