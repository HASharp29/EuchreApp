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
  game: Game = this.gameService.initializeGame(['', '', '', '']); //game initialized with empty strings (will be reset later)

  constructor() {
    // Get player names from query parameters
    this.activatedRoute.queryParams.subscribe((params) => {
      const playerNames = JSON.parse(params['players'] || '[]');
      console.log("Player Names from Query Params:", playerNames);

      // Initialize the game with player names
      if (playerNames.length === 4) {
        this.game = this.gameService.initializeGame(playerNames); // game reset with players
        this.game.currentRound.currentTrick.currentPlayer = this.game.players[0]; // Set the first player as the current player
      } else {
        console.error("Invalid player names provided");
      }
    });
  }
  playCard(card: Card) {
    console.log(card.rank + card.suit);
    this.gameService.playCard(this.game, this.game.currentRound.currentTrick.currentPlayer!, card);
    if (this.game.currentRound.currentTrick.playedCounter === 4) {
      this.calculateScore();
    }
  }

  calculateScore() {
    const winner = this.gameService.determineTrickWinner(this.game);
    console.log(winner)
    this.gameService.scoreTrick(this.game, winner);
    alert(winner.name + " is the winner!");
  }

  scoreRound() {
    const winningTeam = this.gameService.scoreRound(this.game);
    if (winningTeam === 0) {
      alert("Team 1 wins");
    }
    else if (winningTeam === 1) {
      alert("Team 2 wins");
    }
  }
}
