import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MessagesComponent } from './messages/messages.component';
import { MemberListComponent } from './member-list/member-list.component';
import { MatchesComponent } from './matches/matches.component';
import { AuthGuard } from './_guards/auth.guard';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'messages', component: MessagesComponent,
      },
      { path: 'members', component: MemberListComponent },
      { path: 'matches', component: MatchesComponent }
    ],
  },

  { path: '**', redirectTo: '', pathMatch: 'full' },
];
