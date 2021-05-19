import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './authorizations/auth-guard.service';
import { HomeGuardService } from './authorizations/homeGuard/home-guard.service';
import { ChatComponent } from './components/chat/chat/chat.component';
import { RoomComponent } from './components/chat/chat/room/room.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: 'login', canActivate: [AuthGuardService], canLoad: [AuthGuardService], component: LoginComponent },
  { path: 'login/:credential', canActivate: [AuthGuardService], canLoad: [AuthGuardService], component: LoginComponent },
  { path: 'home', canActivate: [HomeGuardService], canLoad: [HomeGuardService], component: HomeComponent },
  { path: 'chat', canActivate: [HomeGuardService], canLoad: [HomeGuardService], component: ChatComponent },
  { path: 'private-chat', canActivate: [HomeGuardService], canLoad: [HomeGuardService], component: RoomComponent },
]

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
