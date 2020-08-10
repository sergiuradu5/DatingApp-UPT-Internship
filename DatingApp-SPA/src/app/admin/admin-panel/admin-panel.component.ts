import { Component, OnInit, ViewChild } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { AuthService } from 'src/app/_services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  @ViewChild('staticTabs', { static: false }) staticTabs: TabsetComponent;
  userRoles = this.authService.getRoles()
  constructor(private authService: AuthService,
              private route: ActivatedRoute,
              private adminService: AdminService,
              private alertify: AlertifyService
    ) { }

  ngOnInit() {
    
    
  }
  ngAfterViewInit()
  {
    const userRoles = this.authService.getRoles();
    if(!this.userIsAdmin(userRoles) && this.userIsModerator(userRoles))
    {
      this.staticTabs.tabs[1].active = true;
    }
  }

  userIsModerator(userRoles : Array<string>) : boolean{
    
    if(userRoles.includes('Moderator'))
      {
        
        return true;
        
      }
    
    return false;
  }

  userIsAdmin(userRoles : Array<string>) : boolean{
     
    if(userRoles.includes('Admin'))
      {
        return true;
      }
    
    return false;
  }

 

  clickOnDisabledTab(id : number)
  {
    if(this.staticTabs.tabs[id].disabled === true)
    {
    this.alertify.message('You do not have access to this feature');
    }
  }

  

}
