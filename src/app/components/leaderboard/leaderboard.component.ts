import { Component, OnInit } from '@angular/core';
import { GeneralServicesService } from 'src/services/general-services.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  // leaderboard: { name: string; score: number }[] = [];
  easyLeaderboard: { name: string; score: number }[] = [];
  mediumLeaderboard: { name: string; score: number }[] = [];
  hardLeaderboard: { name: string; score: number }[] = [];
  newPlayer: { name: string; score: number } = { name: '', score: 0 };



  constructor(private service: GeneralServicesService) { }

  ngOnInit(): void {
    // this.leaderboard = this.service.getSortedLeaderboard();
    this.easyLeaderboard = this.service.sortLeaderboard(this.service.getEasyLeaderboard());
    this.mediumLeaderboard = this.service.sortLeaderboard(this.service.getMediumLeaderboard());
    this.hardLeaderboard = this.service.sortLeaderboard(this.service.getHardLeaderboard());
  }
  // clearLeaderboard(): void {
  //   this.service.clearLeaderboard();
  //   this.leaderboard = [];
  // }
}