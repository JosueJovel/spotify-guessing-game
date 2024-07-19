import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralServicesService } from 'src/services/general-services.service';

@Component({
  selector: 'app-name-entry',
  templateUrl: './end-game.component.html',
  styleUrls: ['./end-game.component.css']
})
export class EndGameComponent implements OnInit {
  name: string = '';
  points: number = 0;
  leaderboardData: { name: string; score: number }[] = [];

  constructor(private router: Router, private service: GeneralServicesService) { }

  ngOnInit(): void {
    this.points = parseInt(localStorage.getItem('points') || '0');
    this.name = localStorage.getItem('name') || '';
  }

  saveName(): void {
    localStorage.setItem('name', this.name);
    this.service.addPlayerToLeaderboard({ name: this.name, score: this.points });
  }

  goToLeaderBoard(): void {
    this.router.navigate(['/leaderboard'])
  }

  wrapUpGame() {
    this.saveName()
    this.goToLeaderBoard()
  }
}
