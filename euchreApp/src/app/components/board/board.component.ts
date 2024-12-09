import { Component, inject } from '@angular/core';
import { GameService, Game, Round, Card, Player } from '../../services/game.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-board',
  imports: [RouterLink],
  standalone: true,
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {
  gameService = inject(GameService);
  game: Game = this.gameService.initializeGame(["John Calvin", "Dancing Baby", "Norman", "Rick Astley"]);
  players = this.game.players;
  currentPlayer: Player = this.players[0];
  round: Round = this.gameService.createRound(this.currentPlayer);
  cardsPlayedThisRound: Card[] = [];

  playCard(card: Card) {
    console.log(card.rank + card.suit);
    console.log(this.game.currentRound.hands);
    this.gameService.playCard(this.game, this.currentPlayer, card);
    this.cardsPlayedThisRound.push(card);
  }
}
