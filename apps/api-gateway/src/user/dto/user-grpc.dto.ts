import { Observable } from 'rxjs';

export class UserGrpcDto {
  getUserInfo: (data: { id: number }) => Observable<any>;
}
