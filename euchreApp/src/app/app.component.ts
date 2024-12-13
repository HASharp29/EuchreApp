import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule, NgModel } from '@angular/forms';

import { StartScreenComponent } from './components/start-screen/start-screen.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, StartScreenComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

}
