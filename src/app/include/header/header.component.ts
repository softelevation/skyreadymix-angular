import { Component, OnInit } from '@angular/core';
import { from } from 'rxjs';
import { AuthService } from './../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userInfo: usersInfo;
  username: string;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
      this.userInfo = JSON.parse(this.authService.userInfo());
      if(this.userInfo){
          this.username = this.userInfo.name;
      }else{
          this.username = 'John';
      }
  }
}


interface usersInfo {
  name: string;
  email: string;
  displayName: string;
}
