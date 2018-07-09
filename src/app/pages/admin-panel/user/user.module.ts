import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UserCreateComponent } from './user-create.component';
import { UserComponent } from './user.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [UserComponent, UserCreateComponent]
})
export class UserModule { }
