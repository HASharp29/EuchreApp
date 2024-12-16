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
    console.log("re;jogh;aerhgeslrhglserhgls;rsez")
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
        dealer: game.currentRound.dealer,
        caller: game.currentRound.caller || null,
        outPlayer: game.currentRound.outPlayer || null,
        trumpSuit: game.currentRound.trumpSuit,
        trickCounter: game.currentRound.trickCounter,
        tricksWon: game.currentRound.tricksWon,
        tricksWonPlayer: [...game.currentRound.tricksWonPlayer],
        tester: 3
      });

      // Save the current trick as a subcollection
      const tricksCollection = collection(roundDocRef, 'tricks');
      await addDoc(tricksCollection, {
        leadPlayer: game.currentRound.currentTrick.leadPlayer || null,
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
        currentPlayer: game.currentRound.currentTrick.currentPlayer,
        playedCounter: game.currentRound.currentTrick.playedCounter,


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

  async getGame(gameId: string): Promise<void>/*Promise<Game | null>*/ {
    /*try {
      // Reference the game document
      const gameDocRef = doc(this.firestore, `games/${gameId}`);
      const gameDoc = await getDoc(gameDocRef);

      // Check if the game exists
      if (!gameDoc.exists()) {
        console.error(`Game with ID ${gameId} does not exist.`);
        return null;
      }

      const gameData = gameDoc.data() as { roundCounter: number; score: [number, number] }; // Type-cast game data

      // Retrieve players subcollection
      const playersCollection = collection(gameDocRef, 'players');
      const playersSnapshot = await getDocs(playersCollection);
      const players: Player[] = playersSnapshot.docs.map((playerDoc) => playerDoc.data() as Player);

      // Retrieve round document (assuming only one round exists)
      const roundsCollection = collection(gameDocRef, 'rounds');
      const roundsSnapshot = await getDocs(roundsCollection);
      const roundDoc = roundsSnapshot.docs[0];

      if (!roundDoc) {
        console.error('No round found for the game.');
        return null;
      }

      const roundData = roundDoc.data() as {
        kittyCard: Card;
        dealer: Player;
        caller: Player | null;
        outPlayer: Player | null;
        trumpSuit: Card["suit"] | null;
        trickCounter: number;
        tricksWon: [number, number];
        tricksWonPlayer: [number, number, number, number];
      };

      // Retrieve each player's hand from the subcollection
      const handsCollection = collection(roundDoc.ref, 'hands');
      const handsSnapshot = await getDocs(handsCollection);
      const hands: [Card[], Card[], Card[], Card[]] = [[], [], [], []]; // Assuming 4 players

      for (const handDoc of handsSnapshot.docs) {
        const handData = handDoc.data();

        // Assuming the Firestore document for each player's hand has a 'cards' field with an array of Card objects
        const playerIndex = parseInt(handDoc.id, 10); // Ensure the document ID corresponds to the player's index
        if (isNaN(playerIndex) || playerIndex < 0 || playerIndex > 3) {
          console.warn(`Invalid player index '${handDoc.id}' in hands collection.`);
          continue;
        }

        hands[playerIndex] = (handData['cards'] || []).map((card: any) => ({
          suit: card.suit,
          rank: card.rank,
          photo: card.photo,
        })) as Card[];
      }

      // Retrieve the single trick document
      const tricksCollection = collection(roundDoc.ref, 'tricks');
      const tricksSnapshot = await getDocs(tricksCollection);
      const trickDoc = tricksSnapshot.docs[0];

      if (!trickDoc) {
        console.error('No trick found for the round.');
        return null;
      }

      const trickData = trickDoc.data();

      const cardsPlayed: [Card | null, Card | null, Card | null, Card | null] = trickData['cardsPlayed'].map((card: any, idx: number) =>
        card ? { suit: card.suit, rank: card.rank, photo: card.photo } : null
      ) as [Card | null, Card | null, Card | null, Card | null];

      const currentTrick: Trick = {
        cardsPlayed,
        leadPlayer: trickData['leadPlayer'],
        cardLed: trickData['cardLed'] ? { suit: trickData['cardLed'].suit, rank: trickData['cardLed'].rank, photo: trickData['cardLed'].photo } : null,
        currentPlayer: trickData['currentPlayer'],
        playedCounter: trickData['playedCounter'],
      };

      // Build the Round object
      const currentRound: Round = {
        hands,
        kittyCard: roundData['kittyCard'],
        dealer: roundData['dealer'],
        caller: roundData['caller'],
        outPlayer: roundData['outPlayer'],
        trumpSuit: roundData['trumpSuit'],
        trickCounter: roundData['trickCounter'],
        currentTrick,
        tricksWon: roundData['tricksWon'],
        tricksWonPlayer: roundData['tricksWonPlayer'],
      };

      // Build and return the Game object
      const game: Game = {
        players,
        roundCounter: gameData['roundCounter'],
        currentRound,
        score: gameData['score'],
      };

      return game;

    } catch (error) {
      console.error('Error retrieving game:', error);
      return null;
    }*/
  }


  async getAllGames(): Promise<{ gameId: string, timestamp: any, players: Player[] }[]> {
    try {
      // Reference to the 'games' collection
      const gamesCollection = collection(this.firestore, 'games');

      // Retrieve all game documents from Firestore
      const gamesSnapshot = await getDocs(gamesCollection);

      const gamesList: { gameId: string, timestamp: any, players: Player[] }[] = [];

      // Iterate through all the games in the snapshot
      for (const gameDoc of gamesSnapshot.docs) {
        const gameData = gameDoc.data();

        // Get the game ID
        const gameId = gameDoc.id;

        // Get the timestamp of the game
        const timestamp = gameData['timestamp'];

        // Retrieve players subcollection for each game
        const playersCollection = collection(gameDoc.ref, 'players');
        const playersSnapshot = await getDocs(playersCollection);

        const players: Player[] = [];
        playersSnapshot.forEach(playerDoc => {
          players.push(playerDoc.data() as Player);
        });

        // Add the game information to the list
        gamesList.push({ gameId, timestamp, players });
      }

      return gamesList;
    } catch (error) {
      console.error('Error retrieving games:', error);
      return [];
    }
  }

}