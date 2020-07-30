import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-roles-modal',
  templateUrl: './roles-modal.component.html',
  styleUrls: ['./roles-modal.component.css']
})
export class RolesModalComponent implements OnInit {
  
  user: User;
  roles: any[];
 
  constructor(public bsModalRef: BsModalRef) {}
 

  ngOnInit() {
    console.log(this.user);
  }

}
