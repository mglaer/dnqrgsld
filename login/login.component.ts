import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import Validation from '../utils/validation';

import { HttpClient } from '@angular/common/http'


//import { AuthService } from '../services/auth.service';
//import { StorageService } from '../services/storage.service';
import { HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '../services/authentication.service';
import { MasterService } from '../services/master.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public ScreenHeight: number = 0;
  message: string = "";
  loading = false;
  error = '';

  //
  form: FormGroup = new FormGroup({
    login: new FormControl(''),
    password: new FormControl('')
  });
  submitted = false;
  //----
  returnUrl: string = '';
  //----------------------------------------------------
  constructor(public router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    //private tokenStorage: TokenStorageService
    //private authService: AuthService, 
    private storageService: AuthenticationService,
    private http: HttpClient,
    private service: MasterService,

  ) {

  }
  //----------------------------------------------------
  ngOnInit(): void {
    this.ScreenHeight = window.innerWidth;
    console.log(this.ScreenHeight);
    let _res = this.storageService.getUser();
    if (_res != null) {
      //
      this.router.navigate(['home']);
    }
    else {
      this.form = this.formBuilder.group(
        {
          login: ['', Validators.required],
          password: ['', [Validators.required,],
          ],
        },
      );
      //---
      // reset login status
      this.storageService.logout();
      // get return url from route parameters or default to '/'
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }
  }
  //----------------------------------------------------

  //----------------------------------------------------

  //----------------------------------------------------
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  //----------------------------------------------------
  onSubmit(): void {
    this.submitted = true;
    //
    if (this.form.invalid) {
      return;
    }
    //Y
    const Login = this.form.value.login;
    const Password = this.form.value.password;

    const headers = new HttpHeaders({ 'Content-type': 'application/json' });

    const reqObject = {
      Login: Login,
      Password: Password
    };


    this.loading = true;
    this.service.Login(reqObject).subscribe({
      next: (data: any) => {
        if (data.error === null) {
          this.storageService.saveUser(data.result);
          this.storageService.saveToken(data.jwt);
          this.router.navigate(['home']);
        }
        else {
          this.error = data.error;
          this.message = data.error;
          this.loading = false;
        }

      },
      error: err => {
        this.error = err;

        this.loading = false;
      }
    });
  }
  //----------------------------------------------------
  reloadPage(): void {
    window.location.reload();
  }
}
//------------------------------------------------------------------------------------------------------
