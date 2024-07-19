import { Component, OnInit } from '@angular/core';
import { GeneralServicesService } from 'src/services/general-services.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  leaderboard: { name: string; score: number }[] = [];
  newPlayer: { name: string; score: number } = { name: '', score: 0 };



  constructor(private service: GeneralServicesService) { }

  ngOnInit(): void {
    this.leaderboard = this.service.getSortedLeaderboard();
  }
  clearLeaderboard(): void {
    this.service.clearLeaderboard();
    this.leaderboard = [];
  }
}