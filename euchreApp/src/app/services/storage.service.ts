import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, serverTimestamp, doc, setDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Game } from './game.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  firestore: Firestore = inject(Firestore);
  gameCollection = collection(this.firestore, 'games'); // Firestore collection for games.

  // Fetch all games from Firestore as an Observable.
  getGames(): Observable<Game[]> {
    return collectionData(this.gameCollection, { idField: 'id' }) as Observable<Game[]>;
  }

  // Add a new game to the Firestore collection.
  async saveNewGame(game: Game): Promise<void> {
    try {
      // Add a timestamp to the game object for ordering purposes.
      const gameWithTimestamp = {
        ...game,
        timestamp: serverTimestamp(),
      };

      await addDoc(this.gameCollection, gameWithTimestamp);
      console.log('Game saved successfully!');
    } catch (error) {
      console.error('Error saving game:', error);
    }
  }

  // Update an existing game in Firestore by document ID.
  async updateGame(gameId: string, updatedGame: Game): Promise<void> {
    try {
      const gameDoc = doc(this.firestore, `games/${gameId}`);
      await setDoc(gameDoc, updatedGame, { merge: true }); // Merge updates to avoid overwriting fields.
      console.log('Game updated successfully!');
    } catch (error) {
      console.error('Error updating game:', error);
    }
  }
}
