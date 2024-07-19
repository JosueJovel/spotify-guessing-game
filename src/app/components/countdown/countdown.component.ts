import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.css']
})
export class CountdownComponent implements OnInit {
  ngOnInit(): void {
    this.startCountdown();
  }
  constructor(private router:Router){}

  minutes = 1;
  seconds = 1;
  intervalId: any;
  isCountdownRunning = false;

  startCountdown(): void {
    if (!this.isCountdownRunning) {
      this.isCountdownRunning = true;
      this.intervalId = setInterval(() => {
        if (this.seconds === 0) {
          if (this.minutes === 0) {
            this.stopCountdown();
            this.timeIsUp(); // call the timeIsUp method when the countdown reaches 0
          } else {
            this.minutes--;
            this.seconds = 59;
          }
        } else {
          this.seconds--;
        }
      }, 1000);
    }
  }

  stopCountdown() {
    clearInterval(this.intervalId);
    this.isCountdownRunning = false;
  }

  resetCountdown() {
    this.stopCountdown();
    this.minutes = 1;
    this.seconds = 1;
    this.startCountdown();
  }

  timeIsUp(): void {
    // Add your logic here when the countdown reaches 0
   this.router.navigate(['/end-game'])
    // You can also call a function or navigate to another page, etc.
  }
}
