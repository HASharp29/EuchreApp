import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-pause',
  standalone: true,
  imports: [RouterModule],
  template: `
    <body>
      <div>Paused</div>
      <button [routerLink]="['/board']">Resume</button>
      <button (click)="savegame()">Save and Quit</button>
      <button [routerLink]="['/']">Quit</button>
      <p>Test words: {{word}}</p>
  `,
  styleUrl: './pause.component.css'
})
export class PauseComponent {
  constructor(private router: Router) {}

  public word = '';

  // TODO: storage = inject(StorageService)

  savegame() {
    // test to see if function is called
    this.word = "Ey!";

    // TODO: call function in storage service to save game to firebase
      // it's called saveGame() for now
    // this.storage.saveGame();

    // wait 3 seconds before going back to start screen
      // (for debugging purposes)
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 3000);
  }
}
