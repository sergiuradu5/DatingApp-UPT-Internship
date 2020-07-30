import { Directive, ViewContainerRef, TemplateRef, Input, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit {
  @Input() appHasRole: string[];
  isVisible = false;
  constructor(private viewContainerRef: ViewContainerRef,
              private templateRef: TemplateRef<any>, //Refers to the element in the HTML component to which we apply this directive to
              private authService: AuthService) { }

  ngOnInit()
  {
  const userRoles = this.authService.decodedToken.role as Array<string>;
  //if no roles clear the viewContainerRef
  if(!userRoles) {
    this.viewContainerRef.clear();
  }

  //if user has role need then render the element
  if(this.authService.roleMatch(this.appHasRole))
  {
    if (!this.isVisible) {
      this.isVisible = true; //This method adds the '/admin' element to the DOM making it visible if the roles match
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      this.isVisible = false;
      this.viewContainerRef.clear(); //if not, then it doesn't even exist for the 'Member'user
    }
  }

  }
}
