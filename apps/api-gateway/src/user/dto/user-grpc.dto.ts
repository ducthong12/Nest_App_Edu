import { UserModel } from '@generated/prisma/models';
import { Observable } from 'rxjs';

export class UserGrpcDto {
  getUserInfo: (data: { id: number }) => Observable<UserModel>;
}
