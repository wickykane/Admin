import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/index';

@Injectable()
export class DebitMemoService {

    constructor(private API: ApiService) { }
}
