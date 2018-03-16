import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../../router.animations';
import { AuthenticationService } from '../../services/index';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {

    nameForm: FormGroup;

    constructor( public router: Router,
        public authenticationService: AuthenticationService,
        public fb: FormBuilder) {
        this.nameForm = fb.group({
            username: ["", Validators.required],
            password: ["", Validators.required],
        });
    }

    ngOnInit() {

    }

    onLoggedin() {
        let _data = {
            login: this.nameForm.value.username,
            password: this.nameForm.value.password
        };

        this.authenticationService.doLogin(_data).subscribe(
            res => {
            },
            err => {
                console.log(err);
                localStorage.setItem('isLoggedin', 'true');
                this.router.navigate(['/dashboard']);


            },
            () => {}

        );

    }



}
