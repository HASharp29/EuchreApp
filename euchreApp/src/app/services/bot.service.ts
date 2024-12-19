import { Injectable } from '@angular/core';
import { GameService, Game, Round, Card, Player, Trick } from './game.service';

@Injectable({
  providedIn: 'root'
})
export class BotService {

  constructor() { }

  pickCard(game: Game): Card {
    const playerI: number = game.currentRound.currentTrick.currentPlayer.index;
    const hand: Card[] = game.currentRound.hands[playerI];
    let handsize: number = hand.length;

    const leadS: "hearts" | "diamonds" | "clubs" | "spades" | undefined = game.currentRound.currentTrick.cardLed?.suit;
    const trumpS: "hearts" | "diamonds" | "clubs" | "spades" | null = game.currentRound.trumpSuit;

    // play random card of lead suit
    for (let i = 0; i < handsize; i++) {
      if (hand[i].suit == leadS) {
        return hand[i];
      }
    }

    // play trump suit
    for (let i = 0; i < handsize; i++) {
      if (hand[i].suit == trumpS) {
        return hand[i];
      }
    }
    
    const randomN = Math.floor(Math.random() * (handsize - 1));
    return hand[randomN];
  }
}
