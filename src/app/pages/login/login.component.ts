import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../../router.animations';
import { AuthenticationService } from '../../services/index';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

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
        public fb: FormBuilder,
        public toastr: ToastsManager, vcr: ViewContainerRef) {
        this.nameForm = fb.group({
            username: ["", Validators.required],
            password: ["", Validators.required],
        });
         this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {

    }

    onLoggedin() {
        let _data = {
            login: this.nameForm.value.username,
            password: this.nameForm.value.password
        };

        this.authenticationService.login(_data).subscribe(
            res => {
                this.router.navigate(['/dashboard']);
            },
            err => {
                console.log(err);
                this.toastr.error(err, 'Oops!');

            },
            () => {}

        );


    }



}
