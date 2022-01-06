import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {
  cognitoUser: CognitoUser | null = null;
  token: string = '';
  email: string = '';
  userName: any  = '';
  phone: string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
    let poolData = {
      UserPoolId: environment.cognitoUserPoolId,
      ClientId: environment.cognitoAppClientId
    };
    let userPool = new CognitoUserPool(poolData);
    this.cognitoUser = userPool.getCurrentUser();

    this.userName = this.cognitoUser?.getUsername();

    this.cognitoUser?.getSession((err: any, session: any) => {
      if (err) {
        console.log(err);
      } else if (!session.isValid()) {
        console.log("Invalid session.");
      } else {
        this.token = session.getIdToken().getJwtToken();
      }
    });

    //this call must be after getSession()
    this.cognitoUser?.getUserAttributes((err: any, userData: any) => {
      if (err) {
        console.log(err);      
      } else {
        this.email = userData.filter((x: { Name: string; }) => x.Name === "email")[0].Value;
        this.phone = userData.filter((x: { Name: string; }) => x.Name === "phone_number")[0].Value;
      }
    });
  }

  onLogout(): void {
    this.cognitoUser?.signOut();
    this.router.navigate(["signin"])
  }
}

