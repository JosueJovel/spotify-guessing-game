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

  constructor() {
    this.loadFromLocalStorage();
    this.leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    this.points = parseInt(localStorage.getItem('points') || '0');
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

 


  private leaderboard: { name: string; score: number }[] = []; //Leaderboard is an array of objects, starting empty

  addPlayerToLeaderboard(player: { name: string; score: number }): void {
    this.leaderboard.push(player);
    localStorage.setItem('leaderboard', JSON.stringify(this.leaderboard));
  }

  getLeaderboard(): { name: string; score: number }[] {
    return this.leaderboard;
  }
  getSortedLeaderboard(): { name: string; score: number }[] {
    return this.leaderboard.sort((a, b) => a.score < b.score ? 1 : a.score > b.score ? -1 : 0); //Sorted version of the leaderboard
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