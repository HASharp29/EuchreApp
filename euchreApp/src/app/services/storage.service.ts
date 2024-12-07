import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, query, orderBy, serverTimestamp, addDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }
}
