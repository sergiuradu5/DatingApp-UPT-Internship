import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/_services/admin.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Photo } from 'src/app/_models/photo';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-photo-management',
  templateUrl: './photo-management.component.html',
  styleUrls: ['./photo-management.component.css']
})
export class PhotoManagementComponent implements OnInit {
  photos: Photo[];
  photoParams: any = {};
  pagination: Pagination;
  constructor(private adminService: AdminService,
    private authService: AuthService,
    private alertify: AlertifyService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.photos = data['photos'].result;
      this.pagination = data['photos'].pagination;
     
    });
  }

  pageChanged(event: any) : void {
    this.pagination.currentPage = event.page;
    console.log(this.pagination.currentPage);
    this.loadPhotosForModeration();
  }
  loadPhotosForModeration() {
    this.adminService.getPhotosForModeration(this.pagination.currentPage, this.pagination.itemsPerPage, this.photoParams)
    .subscribe((res: PaginatedResult<Photo[]>) => {
      console.log(this.photoParams);
      this.photos = res.result;
      this.pagination = res.pagination;
    }, error => {
      this.alertify.error(error);
    });
  }
  approvePhoto(id : number)
  {
    this.adminService.approvePhoto(id).subscribe( () => {
      this.alertify.success('Photo has been approved');
      this.photos.splice(this.photos.findIndex(p => p.id == id), 1);
    }, error=> {
      this.alertify.error(error);
    });
  }

  deletePhoto(id: number)
  {
    this.adminService.deletePhoto(id).subscribe( () => {
      this.alertify.message('Photo has been deleted');
      this.photos.splice(this.photos.findIndex(p => p.id == id), 1);
    }, error=> {
      this.alertify.error(error);
    });
  }

}
