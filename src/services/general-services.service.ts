import { Injectable } from '@angular/core';

interface Leaderboard {
  name: string;
  score: number;
}
const LeaderBoard_Data = [
  { name: 'Jacob', score: 100 },
  { name: 'Josue', score: 90 },
  { name: 'Bob', score: 80 },
  
];

@Injectable({
  providedIn: 'root'
})
export class GeneralServicesService {
  private gameMode!: string;
  private lives!: number;
  private leaderboard: { name: string; score: number }[] = []; //Leaderboard is an array of objects, starting empty
  private easyLeaderboard: { name: string; score: number }[] = [];  
  private mediumLeaderboard: { name: string; score: number }[] = [];
  private hardLeaderboard: { name: string; score: number }[] = [];

  constructor() {
    this.loadFromLocalStorage();
    this.leaderboard = JSON.parse(localStorage.getItem('leaderboard') ?? '[]');
    this.easyLeaderboard = JSON.parse(localStorage.getItem('easyLeaderboard') ?? '[]');
    this.mediumLeaderboard = JSON.parse(localStorage.getItem('mediumLeaderboard') ?? '[]');
    this.hardLeaderboard = JSON.parse(localStorage.getItem('hardLeaderboard') ?? '[]');


    this.points = parseInt(localStorage.getItem('points') ?? '0');
  }

  // Save data to local storage
  save(key: string, data: any): void {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(key, serializedData);
    } catch (error) {
      console.error("Error saving to local storage", error);
    }
  }

  load(key: string): string | null {
    return localStorage.getItem(key);
  }

  addLeaderboardEntry(entry: Leaderboard): void {
    const leaderboard: Leaderboard[] = this.getLeaderboard();
    leaderboard.push(entry);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
  }



 

  loadFromLocalStorage() {
    this.gameMode = this.load('gameMode') || 'medium'; // default to 'easy' if not found
    this.lives = parseInt(this.load('lives') || '5',5)||5; // default to 0 if not found
  }

  getLives(): number {
    return parseInt(localStorage.getItem('lives') || '10');
  }

  setLives(lives: number): void {
    this.lives = lives;
    this.save('lives', lives);
  }

 



  addPlayerToLeaderboard(player: { name: string; score: number }): void {
    //Check for current difficulty, and push to easy/medium leaderboard (leaderboards are saved HERE)
    switch (this.load('gameMode')) {
      case 'easy':
        this.easyLeaderboard.push(player);
        localStorage.setItem('easyLeaderboard', JSON.stringify(this.easyLeaderboard)); 
        break;

      case 'medium':
        this.mediumLeaderboard.push(player);
        localStorage.setItem('mediumLeaderboard', JSON.stringify(this.mediumLeaderboard)); 
        break;

      case 'hard':
        this.hardLeaderboard.push(player);
        localStorage.setItem('hardLeaderboard', JSON.stringify(this.hardLeaderboard)); 
        break;

      default:
        break;
    }
    // this.leaderboard.push(player);
    // localStorage.setItem('leaderboard', JSON.stringify(this.leaderboard));
  }

  //GETTERS
  getLeaderboard(): { name: string; score: number }[] {
    return this.leaderboard;
  }
  getEasyLeaderboard(): { name: string; score: number }[] {
    return this.easyLeaderboard;
  }
  getMediumLeaderboard(): { name: string; score: number }[] {
    return this.mediumLeaderboard;
  }
  getHardLeaderboard(): { name: string; score: number }[] {
    return this.hardLeaderboard;
  }

  getSortedLeaderboard(): { name: string; score: number }[] {
    //Check for current difficulty, and fetch the correct sorted leaderboards
    switch (this.load('gameMode')) {
      case 'easy':
        return this.easyLeaderboard.sort((a, b) => a.score < b.score ? 1 : a.score > b.score ? -1 : 0); //Sorted version of the leaderboard
        break;

      case 'medium':
        return this.mediumLeaderboard.sort((a, b) => a.score < b.score ? 1 : a.score > b.score ? -1 : 0); //Sorted version of the leaderboard
        break;

      case 'hard':
        return this.hardLeaderboard.sort((a, b) => a.score < b.score ? 1 : a.score > b.score ? -1 : 0); //Sorted version of the leaderboard
        break;

      default:
        return this.leaderboard.sort((a, b) => a.score < b.score ? 1 : a.score > b.score ? -1 : 0); //Sorted version of the leaderboard
        break;
    }
  }

  sortLeaderboard(leaderboardToSort: { name: string; score: number }[]): { name: string; score: number }[] {
    return leaderboardToSort.sort((a, b) => a.score < b.score ? 1 : a.score > b.score ? -1 : 0); //Sorted version of the leaderboard
  }

  clearLeaderboard(): void {
    this.leaderboard = [];
    localStorage.removeItem('leaderboard');
  }

  private points: number = 0;

  

  addPoint(): void {
    this.points=this.points+10;
    localStorage.setItem('points', this.points.toString());
  }

  getPoints(): number {
    return this.points;
  }

  resetPoints(): void {
    localStorage.setItem('points', '0');
    this.points = 0;
  }
  resetLives(): void {
    
    this.getLives();
  }
}