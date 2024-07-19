import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { GeneralServicesService } from "src/services/general-services.service";

@Component({
	selector: "app-configuration",
	templateUrl: "./configuration.component.html",
	styleUrls: ["./configuration.component.css"],
})
export class ConfigurationComponent implements OnInit {
  gameModes = [
    { label: 'Easy', value: 'easy' },
    { label: 'Medium', value: 'medium' },
    { label: 'Hard', value: 'hard' }
  ];
  difficulty: string='';
  lives: number=0;

  constructor(private service: GeneralServicesService,private router:Router) { }

  ngOnInit(): void {
    this.difficulty = this.service.load('gameMode') || ('easy');
    localStorage.setItem('gameMode', this.difficulty); //Ensures current difficulty is saved in local storage
    this.lives = this.service.getLives();
  }

  onChangeGameMode(event: any) {
    this.difficulty = event.target.value;
    this.setLivesBasedOnDifficulty();
  }

  setLivesBasedOnDifficulty() {
    switch (this.difficulty) {
      case 'easy':
        this.lives = 10;
        break;
      case 'medium':
        this.lives = 5;
        break;
      case 'hard':
        this.lives = 1;
        break;
      default:
        this.lives = 10; // default to easy mode
    } 
    localStorage.setItem('gameMode', this.difficulty); //Ensures current difficulty is saved in local storage
    this.service.setLives(this.lives);
  }

  saveConfiguration() {
    localStorage.setItem('gameMode', this.difficulty);
    localStorage.setItem('lives', this.lives.toString());
  }

  startGame() {
    this.router.navigate(['/game']);
  }}