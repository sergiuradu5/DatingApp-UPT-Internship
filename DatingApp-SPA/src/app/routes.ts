import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MessagesComponent } from './messages/messages.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MatchesComponent } from './matches/matches.component';
import { AuthGuard } from './_guards/auth.guard';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberDetailResolver } from './_resolver/member-detail.resolver';
import { MemberListResolver } from './_resolver/member-list.resolver';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberEditResolver } from './_resolver/member-edit.resolver';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';
import { MatchesResolver } from './_resolver/matches.resolver';
import { MessagesResolver } from './_resolver/messages.resolver';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { PhotosForModerationResolver } from './_resolver/photos-for-moderation.resolver';
import { PhotoManagementComponent } from './admin/photo-management/photo-management.component';
import { UserManagementComponent } from './admin/user-management/user-management.component';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'messages', component: MessagesComponent, resolve: {messages: MessagesResolver} },
      
      { path: 'members/:id', component: MemberDetailComponent, resolve: {user: MemberDetailResolver} },
      { path: 'member/edit', component: MemberEditComponent , resolve: {user: MemberEditResolver}, canDeactivate: [PreventUnsavedChanges]},
      { path: 'members', component: MemberListComponent, resolve: {users: MemberListResolver} },
      { path: 'matches', component: MatchesComponent, resolve: {users: MatchesResolver } },
      { path: 'admin', component: AdminPanelComponent, resolve: {photos: PhotosForModerationResolver}, data: {roles: ['Admin', 'Moderator'] } }
       
    ],
  },

  { path: '**', redirectTo: '', pathMatch: 'full' },
];
