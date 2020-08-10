import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../_models/message';
import { Pagination, PaginatedResult } from '../_models/pagination';
import { UserService } from '../_services/user.service';
import { AuthService } from '../_services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, from } from 'rxjs/';
import {interval} from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  @Input() messages$: Observable<PaginatedResult<Message[]>>;
  messages: Message[];
  pagination: Pagination;
  messageContainer = 'Unread';
  constructor(
    private userService : UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private alertify: AlertifyService

  ) { }

  ngOnInit() {
    /* Non Real Time messages
    this.route.data.subscribe(data => {
      this.messages = data['messages'].result;
      this.pagination = data['messages'].pagination;
      
    }); */
    this.messages$ = interval(1000).pipe(
    startWith(0), switchMap( () => this.userService.getMessages(this.authService.decodedToken.nameid,
      this.pagination.currentPage,
      this.pagination.itemsPerPage, this.messageContainer)));
  }
  //Real time messages
  

   // Non-real-time messages
  loadMessages() {
    this.userService.getMessages(this.authService.decodedToken.nameid,
      this.pagination.currentPage,
      this.pagination.itemsPerPage, this.messageContainer)
        .subscribe((res: PaginatedResult<Message[]>) => {
          this.messages = res.result;
          this.pagination = res.pagination;
          console.log(this.messages);
        }, error => {
          this.alertify.error(error);
        });
  }

  deleteMessage(id: number)
  {
    this.alertify.confirm("Are you sure you want to delete this message?", () => {
      this.userService.deleteMessage(id, this.authService.decodedToken.nameid).subscribe( () => {
        this.messages.splice(this.messages.findIndex(m => m.id === id), 1); //Deleting one message from the array using splice
        this.alertify.success('Message has been deleted');
      }, error => {
        this.alertify.error(error);
      });
    });
  } 
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }

}
