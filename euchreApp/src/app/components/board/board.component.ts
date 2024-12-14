import { Component, inject } from '@angular/core';
import { GameService, Game, Round, Card, Player, Trick } from '../../services/game.service';
import { RouterLink } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-board',
  imports: [RouterLink],
  standalone: true,
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})

export class BoardComponent {
  gameService = inject(GameService);
  activatedRoute = inject(ActivatedRoute);
  game: Game = this.gameService.initializeGame(['','','','']);
  currentPlayer: Player = this.game.players[0];
  playerHasPlayed: boolean = false;

  constructor() {
    // Get player names from query parameters
    this.activatedRoute.queryParams.subscribe((params) => {
      const playerNames = JSON.parse(params['players'] || '[]');
      console.log("Player Names from Query Params:", playerNames);

      // Initialize the game with player names
      if (playerNames.length === 4) {
        this.game = this.gameService.initializeGame(playerNames);
        this.currentPlayer = this.game.players[0]; // Set the first player as the current player
      } else {
        console.error("Invalid player names provided");
      }
    });
  }
  playCard(card: Card) {
    console.log(card.rank + card.suit);
    console.log(this.game.currentRound.hands);
    this.gameService.playCard(this.game, this.currentPlayer, card);
    this.playerHasPlayed = true;
  }

  changePlayer() {
    const nextPlayerIndex = (this.currentPlayer.index + 1); // Move to next player
    this.currentPlayer = this.game.players[nextPlayerIndex];
    this.playerHasPlayed = false;
  }

  calculateScore() {
    const winner = this.gameService.determineTrickWinner(this.game);
    alert(winner.name + " is the winner!");
  }
}
