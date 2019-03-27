import { HttpService, Injectable } from '@nestjs/common';

@Injectable()
export class StravaService {
    constructor(private readonly httpService: HttpService) {}

    getActivity(): string {
        return '';
    }    
}
