import { Component, inject } from '@angular/core';
import { GameService, Game, Round, Card, Player, Trick } from '../../services/game.service';
import { RouterLink, Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { ActivatedRoute } from '@angular/router';
import { NgClass } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-board',
  imports: [RouterLink, NgClass, MatCardModule],
  standalone: true,
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})

export class BoardComponent {
  gameService = inject(GameService);
  activatedRoute = inject(ActivatedRoute);
  game: Game = this.gameService.initializeGame(['', '', '', '']); //game initialized with empty strings (will be reset later)
  gameOver: boolean = false;
  trumpBid: boolean = false;
  tCandidates: ("hearts" | "diamonds" | "spades" | "clubs" | null)[] = ["hearts", "diamonds", "clubs", "spades"];

  constructor(private router: Router) {
    // Access the state object from the router
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { game: Game };

    if (state?.game) {
      this.game = state.game;
      console.log("Game passed to BoardComponent:", this.game);

    } else {
      console.error("No game found in state. Returning to start screen.");
      this.router.navigate(['/']);
    }
  }

  bidTrump(bid: boolean): void {
    if (bid) {
      this.game.currentRound.trumpSuit = this.game.currentRound.kittyCard['suit'];
      this.game.currentRound.caller = this.game.currentRound.currentTrick.currentPlayer;
      this.game.currentRound.currentTrick.currentPlayer = this.game.currentRound.currentTrick.leadPlayer;
      this.game.currentRound.hands[this.game.currentRound.dealer.index][5] = this.game.currentRound.kittyCard;
      this.game.currentRound.switchTime = true;
      this.game.currentRound.currentTrick.currentPlayer = this.game.currentRound.dealer;
    } else {
      this.game.currentRound.passTrumpCount++;
      this.game.currentRound.currentTrick.currentPlayer = this.game.players[(this.game.currentRound.currentTrick.currentPlayer!.index + 1) % 4]
      this.game.currentRound.switchTime = true;
    }
  }

  getTcandidates(): ("hearts" | "diamonds" | "spades" | "clubs" | null)[] {
    let notTrump = this.game.currentRound.kittyCard['suit'];
    this.tCandidates = this.tCandidates.filter(item => item !== notTrump);

    return this.tCandidates;
  }

  setTrump(suit: "hearts" | "diamonds" | "spades" | "clubs" | null) {
    this.game.currentRound.trumpSuit = suit;
    this.game.currentRound.caller = this.game.currentRound.currentTrick.currentPlayer;
    this.game.currentRound.currentTrick.currentPlayer = this.game.currentRound.currentTrick.leadPlayer;
    this.game.currentRound.switchTime = true;
    this.trumpBid = true;
  }

  discard(card: Card, dealer: Player): void { // ALlows the dealer to discard one card after picking up kitty card
    this.game.currentRound.hands[dealer.index].splice(this.game.currentRound.hands[dealer.index].indexOf(card), 1);
    this.trumpBid = true;
    this.game.currentRound.switchTime = true;
    this.game.currentRound.currentTrick.currentPlayer = this.game.currentRound.currentTrick.leadPlayer;
    console.log("Card was successfully removed from player's hand.")
  }

  nextPlayer() {
    this.game.currentRound.switchTime = false;
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

    if (this.game.currentRound.trickCounter === 5) {
      this.scoreRound();
    }
  }

  scoreRound() {
    const winningTeam = this.gameService.scoreRound(this.game);
    if (winningTeam === 0) {
      this.gameOver = true;
    }
    else if (winningTeam === 1) {
      this.gameOver = true;
    }
  }

  pauseGame() {
    // Navigate to the PauseComponent and pass the current game state
    this.router.navigate(['/pause'], {
      state: { game: this.game }
    });
  }
}
