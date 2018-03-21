import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { UserCreateComponent } from './user-create.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [UserComponent, UserCreateComponent]
})
export class UserModule { }
