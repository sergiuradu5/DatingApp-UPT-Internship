import { Component, OnInit } from '@angular/core';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { User } from '../../_models/user';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
 
  users: User[];
  user: User = JSON.parse(localStorage.getItem('user'));
  genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}, {value: 'other', display: 'Other' }];
  userParams: any = {};
  pagination: Pagination;

 
  constructor(private userService: UserService,
          private alertify: AlertifyService,
          private route: ActivatedRoute)
          { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
    });

    if (this.user.gender === 'female')
    {
      this.userParams.gender = 'male';
    }
    if(this.user.gender === 'male')
    {
      this.userParams.gender = 'female';
    }
    if(this.user.gender === 'other')
    {
      this.userParams.gender = 'other';
    }

    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.userParams.orderBy = 'lastActive';
  }

  resetFilters()
  {
    if (this.user.gender === 'female')
    {
      this.userParams.gender = 'male';
    }
    if(this.user.gender === 'male')
    {
      this.userParams.gender = 'female';
    }
    if(this.user.gender === 'other')
    {
      this.userParams.gender = 'other';
    }
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;

    this.loadUsers();
  }

  pageChanged(event: any) : void {
    this.pagination.currentPage = event.page;
    console.log(this.pagination.currentPage);
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams)
    .subscribe((res: PaginatedResult<User[]>) => {
      console.log(this.userParams);
      this.users = res.result;
      this.pagination = res.pagination;
    }, error => {
      this.alertify.error(error);
    });
  }

}
