import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { LeaderboardComponent } from "./components/leaderboard/leaderboard.component";

import { NavbarComponent } from "./components/navbar/navbar.component";
import { ConfigurationComponent } from "./components/configuration/configuration.component";
import { CountdownComponent } from "./components/countdown/countdown.component";
import { GameComponent } from "./components/game/game.component";
import { EndGameComponent } from './components/end-game/end-game.component';


const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "leaderboard", component: LeaderboardComponent },
  { path: "configuration", component: ConfigurationComponent },
  { path: "game", component: GameComponent },
  {path:"end-game",component:EndGameComponent}
]; //Insert Routes Here

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LeaderboardComponent,
    NavbarComponent,
    ConfigurationComponent,
    CountdownComponent,
    GameComponent,
    EndGameComponent,
    
  ],
  imports: [BrowserModule, FormsModule, RouterModule.forRoot(routes)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
