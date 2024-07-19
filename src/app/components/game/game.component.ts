import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Track } from 'src/app/models/Track';
import fetchFromSpotify from 'src/services/api';

import { GeneralServicesService } from 'src/services/general-services.service';

const TOKEN_KEY = "whos-who-access-token";
const PLAYLIST_ID = "50ozhW6x8mS6r64G4Dru0c"

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  points: number = 0; 
  currentTrackId: string; // Add this property
  currentCorrectAnswer: string;
  constructor(private service:GeneralServicesService,private router:Router) {this.currentTrackId = '';
    this.currentCorrectAnswer = ''; }


  authLoading: boolean = false;
  token: String = "";
  playlistObject: any; //Spotify API's response of playlist with tracks
  trackNames: Array<String> = []; //List of track names, these will be randomly pulled from for our other answer choices
  trackPoolMap: Map<String, Track> = new Map<String, Track>(); //Map of all of our available tracks. Key=ID, Value=Track object
  trackChoices: Array<String> = []; //Pool of track IDs to choose from. This will reduce over time as questioned are answered
  fullTrackChoices: Array<String> = []; //Initial, constant pool of track ids. This should not change.
  songPreviewUrl: String = "";
  choice1: string = "Choice 1";
  choice2: string = "Choice 2";
  choice3: string = "Choice 3";
  choice4: string = "Choice 4";
  startQuiz: boolean = false; //This flag marks when the quiz starts

  async ngOnInit(): Promise<void> {
    this.resetPoints();
    this.resetLives();
    const storedLives = localStorage.getItem('lives');
    if (storedLives !== null) {
      this.lives = parseInt(storedLives, 10);
    }
    this.lives = this.service.getLives();
    try {
      //First, set our spotify token.
      this.authLoading = true;
      const storedTokenString = localStorage.getItem(TOKEN_KEY);
      if (storedTokenString) {
        const storedToken = JSON.parse(storedTokenString);
        if (storedToken.expiration > Date.now()) {
          console.log("Token found in localstorage");
          this.authLoading = false;
          this.token = storedToken.value;
        }
      } else {
        console.log("Issues loading token (no auth)")
      }

      //Fetch and store our entire playlist response
      this.playlistObject = await fetchFromSpotify({
        token: this.token, 
        endpoint: `playlists/${PLAYLIST_ID}/tracks`, //Hard coded endpoint call to fetch playlist 6i2Qd6OpeRBAzxfscNXeWp  (Top 100 songs of all time)
      });

      this.createTrackVariables(); //Generate our necessary data structures to start the quiz.
    } catch (error) {
      console.error('Error fetching data: Could not Initialize Game component.', error);
    }
    this.startGame() //Instantly start quiz once we are all ready to go
  }

  createTrackVariables() {
    //Iterate through playlistObject's items
    for (const item of this.playlistObject.items) {
      if (item.track["preview_url"] !== null) { //Continue only If a track has a 30 second preview to listen to (some tracks do not have this)
        this.trackPoolMap.set(item.track.id, {title: item.track.name, id: item.track.id, previewUrl: item.track["preview_url"]}); //Building out our map with id as the key and track object as our value
        this.trackNames.push(item.track.name)
        this.trackChoices.push(item.track.id)
      }
      this.fullTrackChoices = this.trackChoices; //Copy our track pool to maintain a record of the entire list (used later for refilling the pool)

    }
  }

  nextQuestion() { //This method will summon the next question
    const randomTrackId = this.grabRandomTrack().toString(); //Id of our randomly chosen track
    this.currentTrackId = randomTrackId; // Store the current track ID
    this.currentCorrectAnswer = this.trackPoolMap.get(randomTrackId)?.title ?? '';
    let answerChoices = [this.trackPoolMap.get(randomTrackId)?.title, "", "", ""] //4 size array of our answer choices, first index is correct answer
    
    for (let index = 1; index < 4; index++) { //For the remaining 3 elements of our answerChoices array
      while (answerChoices[index] === "") { //While our current index contains an empty string
        let randomTrackTitle = this.trackNames[Math.floor(Math.random() * this.trackNames.length)]; //Fetch a random track name
        
        //Check to make sure we have not already stored the track name in our array of choices
        if (answerChoices[0] !== randomTrackTitle && answerChoices[1] !== randomTrackTitle && answerChoices[2] !== randomTrackTitle && answerChoices[3] !== randomTrackTitle) {
          answerChoices[index] = randomTrackTitle as string;
        }
      }
    }
    
    //Fisher-Yates sorting algorithm to shuffle our array
    for (let i = answerChoices.length - 1; i > 0; i--) { 
      const j = Math.floor(Math.random() * (i + 1)); 
      [answerChoices[i], answerChoices[j]] = [answerChoices[j], answerChoices[i]]; 
    } 

    //Assign our shuffled answers to the answer choices
    this.choice1 = answerChoices[0] || "No Answer Available"
    this.choice2 = answerChoices[1] || "No Answer Available"
    this.choice3 = answerChoices[2] || "No Answer Available"
    this.choice4 = answerChoices[3] || "No Answer Available"

  }

  grabRandomTrack() {
    if (!this.trackChoices.length) { //If trackChoices is empty (out of tracks), refill it with track names again.
      this.trackChoices = this.fullTrackChoices //refill track options
    }
    const randomIndex = Math.floor(Math.random() * this.trackChoices.length); //Generate a random index within our track pool array
    const randomTrackId = this.trackChoices[randomIndex] //Fetch a random track id
    this.trackChoices.splice(randomIndex, 1); //Cut out the random track fetched from our track pool
    this.songPreviewUrl = this.trackPoolMap.get(randomTrackId)?.previewUrl ?? ""; //Fetch and set the audio url of our randomly chosen song (or an empty string if undefined)

    //Force reload our audio component
    setTimeout(() => {
      const audioPlayer = document.getElementById('audioPlayer') as HTMLAudioElement; //Grab our audio player element (div containing audio)
      if (audioPlayer) {
        audioPlayer.load(); //Set load time to 0, so it loads instantly
      }
    }, 0);
    return randomTrackId; //When done, return ID of track we loaded.
  }

  processAnswer(answer: string) {
    // Check if the user's answer is correct
    if (answer === this.currentCorrectAnswer) {
      this.addPoint();
    } else {
      this.decreaseLives();
      console.log(`Incorrect answer. The correct answer is ${this.currentCorrectAnswer}.`);
      console.log(answer);
      if(this.lives===0){
        this.router.navigate(['/end-game']);
      }
    }
    
    // Call nextQuestion to move on to the next question
    this.nextQuestion();
  }

  startGame() {
    //Logic needed to initialize/reset the game goes here
    this.resetPoints();
    this.resetLives();

    this.nextQuestion(); //Prepare next question
    this.startQuiz = true; //Set flag to true to render quiz after the next question is prepared
  }
  addPoint(): void {
    this.service.addPoint();
    this.points = this.service.getPoints();
  }

  resetPoints(): void {
    this.service.resetPoints();
    this.points = this.service.getPoints();
  }

  lives: number=0;

  

  decreaseLives() {
    if (this.lives != 0) {
      this.lives -= 1;
 // Update the value in local storage
    } else {
      // Handle the case when lives reach 0
      this.router.navigate(['/end-game']);
    }
  }

  increaseLives() {
    this.lives += 1;
    this.service.setLives(this.lives);
  }  
  resetLives(){
    this.service.getLives();
  }
}