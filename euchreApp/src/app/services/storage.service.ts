import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, serverTimestamp, doc, setDoc, getDoc, getDocs } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Game, Round, Trick, Card, Player } from './game.service';

//the code in this section was largely written by chatgpt
// here is the link to the firbase project:
// https://console.firebase.google.com/u/0/project/lexemwellioeuchre/overview
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  firestore: Firestore = inject(Firestore);
  
  async saveGame(game: Game): Promise<void> {
    try {
      const gameCollection = collection(this.firestore, 'games');
  
      // Add the game document (basic game details)
      const gameDocRef = await addDoc(gameCollection, {
        roundCounter: game.roundCounter,
        score: game.score,
        timestamp: serverTimestamp(), // Add the timestamp
      });
  
      console.log('Game document created:', gameDocRef.id);
  
      // Save players as a subcollection
      const playersCollection = collection(gameDocRef, 'players');
      for (const player of game.players) {
        await setDoc(doc(playersCollection, player.index.toString()), {
          name: player.name,
          index: player.index,
        });
      }
  
      // Save the current round as a subcollection
      const roundsCollection = collection(gameDocRef, 'rounds');
      const roundDocRef = await addDoc(roundsCollection, {
        kittyCard: game.currentRound.kittyCard,
        dealer: game.currentRound.dealer.index,
        caller: game.currentRound.caller?.index || null,
        outPlayer: game.currentRound.outPlayer?.index || null,
        trumpSuit: game.currentRound.trumpSuit,
        trickCounter: game.currentRound.trickCounter,
        tricksWon: game.currentRound.tricksWon,
      });
  
      // Save the current trick as a subcollection
      const tricksCollection = collection(roundDocRef, 'tricks');
      await addDoc(tricksCollection, {
        leadPlayer: game.currentRound.currentTrick.leadPlayer?.index || null,
        cardLed: game.currentRound.currentTrick.cardLed
          ? {
              suit: game.currentRound.currentTrick.cardLed.suit,
              rank: game.currentRound.currentTrick.cardLed.rank,
              photo: game.currentRound.currentTrick.cardLed.photo,
            }
          : null,
        cardsPlayed: game.currentRound.currentTrick.cardsPlayed.map((card) =>
          card
            ? {
                suit: card.suit,
                rank: card.rank,
                photo: card.photo,
              }
            : null
        ),
      });
  
      // Save each player's hand as a subcollection
      const handsCollection = collection(roundDocRef, 'hands');
      for (let playerIndex = 0; playerIndex < game.currentRound.hands.length; playerIndex++) {
        const playerHand = game.currentRound.hands[playerIndex];
        const handDocRef = doc(handsCollection, playerIndex.toString());
  
        // Save each card in the player's hand as a subcollection
        const cardsCollection = collection(handDocRef, 'cards');
        for (const card of playerHand) {
          if (card) {
            const cardRef = doc(cardsCollection);
            await setDoc(cardRef, {
              suit: card.suit,
              rank: card.rank,
              photo: card.photo,
            });
          }
        }
      }
  
      console.log('Game saved successfully.');
    } catch (error) {
      console.error('Error saving game:', error);
      throw error;
    }
  }
  

  async getGame(gameId: string): Promise<Game | null> {
    try {
      // Reference the game document
      const gameDocRef = doc(this.firestore, `games/${gameId}`);
      const gameDoc = await getDoc(gameDocRef);

      if (!gameDoc.exists()) {
        console.error(`Game with ID ${gameId} does not exist.`);
        return null;
      }

      const gameData = gameDoc.data();

      // Retrieve players subcollection
      const playersCollection = collection(gameDocRef, 'players');
      const playersSnapshot = await getDocs(playersCollection);

      const players: Player[] = [];
      playersSnapshot.forEach(playerDoc => {
        players.push(playerDoc.data() as Player);
      });

      // Retrieve rounds subcollection
      const roundsCollection = collection(gameDocRef, 'rounds');
      const roundsSnapshot = await getDocs(roundsCollection);

      const rounds: Round[] = [];
      for (const roundDoc of roundsSnapshot.docs) {
        const roundData = roundDoc.data();

        // Retrieve hands subcollection
        const handsCollection = collection(roundDoc.ref, 'hands');
        const handsSnapshot = await getDocs(handsCollection);

        const hands: [Card[], Card[], Card[], Card[]] = [[], [], [], []];
        for (const handDoc of handsSnapshot.docs) {
          const playerIndex = parseInt(handDoc.id, 10);
          const cardsCollection = collection(handDoc.ref, 'cards');
          const cardsSnapshot = await getDocs(cardsCollection);

          const playerHand: Card[] = [];
          cardsSnapshot.forEach(cardDoc => {
            playerHand.push(cardDoc.data() as Card);
          });

          if (playerIndex >= 0 && playerIndex < 4) {
            hands[playerIndex] = playerHand;
          }
        }

        // Retrieve tricks subcollection
        const tricksCollection = collection(roundDoc.ref, 'tricks');
        const tricksSnapshot = await getDocs(tricksCollection);

        const tricks: Trick[] = [];
        tricksSnapshot.forEach(trickDoc => {
          const trickData = trickDoc.data();

          const cardsPlayed: [Card | null, Card | null, Card | null, Card | null] = [
            trickData['cardsPlayed'][0] ? trickData['cardsPlayed'][0] as Card : null,
            trickData['cardsPlayed'][1] ? trickData['cardsPlayed'][1] as Card : null,
            trickData['cardsPlayed'][2] ? trickData['cardsPlayed'][2] as Card : null,
            trickData['cardsPlayed'][3] ? trickData['cardsPlayed'][3] as Card : null,
          ];

          tricks.push({
            cardsPlayed,
            leadPlayer: trickData['leadPlayer'] ? players.find(p => p.index === trickData['leadPlayer']) || null : null,
            cardLed: trickData['cardLed'] ? trickData['cardLed'] as Card : null,
          });
        });

        // Build the Round object
        const round: Round = {
          hands,
          kittyCard: roundData['kittyCard'] as Card,
          dealer: players.find(p => p.index === roundData['dealer'])!,
          caller: roundData['caller'] !== null ? players.find(p => p.index === roundData['caller']) || null : null,
          outPlayer: roundData['outPlayer'] !== null ? players.find(p => p.index === roundData['outPlayer']) || null : null,
          trumpSuit: roundData['trumpSuit'],
          trickCounter: roundData['trickCounter'],
          currentTrick: tricks[tricks.length - 1] || {
            cardsPlayed: [null, null, null, null],
            leadPlayer: null,
            cardLed: null,
          },
          tricksWon: roundData['tricksWon'],
        };

        rounds.push(round);
      }

      // Build the Game object
      const game: Game = {
        players,
        roundCounter: gameData['roundCounter'],
        currentRound: rounds[rounds.length - 1], // Assume last round is the current one
        score: gameData['score'],
      };

      return game;
    } catch (error) {
      console.error('Error retrieving game:', error);
      return null;
    }
  }

}