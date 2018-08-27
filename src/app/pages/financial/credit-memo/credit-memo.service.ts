import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/index';

@Injectable()
export class CreditMemoService {

    constructor(private API: ApiService) { }
}
