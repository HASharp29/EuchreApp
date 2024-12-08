import { Component, inject } from '@angular/core';
import { GameService, Game, Round } from '../../services/game.service';
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
  game: Game = this.gameService.initializeGame(["John Calvin", "Dancing Baby", "Norman", "Rickroll Astley"]);
  players = this.gameService.initializeGame(["John Calvin", "Dancing Baby", "Norman", "Rickroll Astley"]).players;
  currentPlayer = this.players[0];
  cards = this.gameService.createDeck();
  round: Round = this.gameService.createRound(this.currentPlayer);
}
