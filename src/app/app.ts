import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./layout/header/header";
import { AuthTab } from './layout/auth-tab/auth-tab';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, AuthTab],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('CanchaSystem');
}
