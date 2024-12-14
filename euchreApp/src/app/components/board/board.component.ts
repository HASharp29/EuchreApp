import { Component, inject } from '@angular/core';
import { GameService, Game, Round, Card, Player, Trick } from '../../services/game.service';
import { RouterLink } from '@angular/router';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-board',
  imports: [RouterLink],
  standalone: true,
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {
  gameService = inject(GameService);
  storageService = inject(StorageService);
  game: Game = this.gameService.initializeGame(["John Calvin", "Dancing Baby", "Norman", "Rick Astley"]);
  currentPlayer: Player = this.game.players[0];
  playerHasPlayed: boolean = false;

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
