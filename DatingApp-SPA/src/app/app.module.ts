import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';
import {appRoutes} from './routes';
import { JwtModule } from '@auth0/angular-jwt';

import { AppComponent } from './app.component';
import { ValueComponent } from './value/value.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { AuthService } from './_services/auth.service';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { MatchesComponent } from './matches/matches.component';
import { MemberCardComponent } from './members/member-card/member-card.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberDetailResolver } from './_resolver/member-detail.resolver';
import { MemberListResolver } from './_resolver/member-list.resolver';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { HasRoleDirective } from './directives/has-role.directive';

import { ErrorInterceptorProvider } from './_services/error.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import { NgxGalleryModule } from 'ngx-gallery-9';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberEditResolver } from './_resolver/member-edit.resolver';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';
import { PhotoEditorComponent } from './members/photo-editor/photo-editor.component';
import { FileUploadModule } from 'ng2-file-upload';
import { TimeAgoExtendsPipe } from './_helpers/time-ago-extends.pipe';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { MatchesResolver } from './_resolver/matches.resolver';
import { MessagesResolver } from './_resolver/messages.resolver';
import { MemberMessagesComponent } from './members/member-messages/member-messages.component';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { PhotoManagementComponent } from './admin/photo-management/photo-management.component';
import { AdminService } from './_services/admin.service';
import { RolesModalComponent } from './admin/roles-modal/roles-modal.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PhotosForModerationResolver } from './_resolver/photos-for-moderation.resolver';







export function tokenGetter() {
   return localStorage.getItem('token');
}


@NgModule({
   declarations: [
      AppComponent,
      ValueComponent,
      NavBarComponent,
      HomeComponent,
      RegisterComponent,
      MemberListComponent,
      MessagesComponent,
      MatchesComponent,
      MemberCardComponent,
      MemberDetailComponent,
      MemberEditComponent,
      PhotoEditorComponent,
      TimeAgoExtendsPipe,
      MemberMessagesComponent,
      AdminPanelComponent,
      HasRoleDirective,
      UserManagementComponent,
      PhotoManagementComponent,
      RolesModalComponent
   ],
   imports: [
      BrowserModule,
      HttpClientModule,
      FormsModule,
      BrowserAnimationsModule,
      NgxGalleryModule,
      ModalModule.forRoot(),
      ButtonsModule.forRoot(),
      PaginationModule.forRoot(),
      BsDatepickerModule.forRoot(),
      BsDropdownModule.forRoot(),
      TabsModule.forRoot(),
      RouterModule.forRoot(appRoutes),
      FileUploadModule,
      ReactiveFormsModule,
      JwtModule.forRoot({
            config: {
               tokenGetter: tokenGetter,
               whitelistedDomains: ['localhost:5000'],
               blacklistedRoutes: ['localhost:5000/api/auth']
            }
      })
   ],
   providers: [
      AuthService,
      ErrorInterceptorProvider,
      MemberDetailResolver,
      MemberListResolver,
      MemberEditResolver,
      PreventUnsavedChanges,
      MatchesResolver,
      MessagesResolver,
      AdminService,
      PhotosForModerationResolver
   ],
   entryComponents: [
      RolesModalComponent
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
