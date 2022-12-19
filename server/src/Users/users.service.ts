import { Injectable, ForbiddenException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpService } from "@nestjs/axios";
import { map, catchError, Observable, BehaviorSubject } from 'rxjs';
import { firstValueFrom } from 'rxjs';

export interface  Users {
  name: string;
  height: string
  mass: string
  hair_color: string
  skin_color: string
  eye_color: string
  birth_year: string
  gender: string
  homeworld: string
  films: [string]
  species: [string]
  vehicles: [string]
  starships: [string]

  created: string;
  edited: string;
  url: string;
}


@Injectable()
export class UsersService {
  constructor(private http: HttpService) {}


  async getUserList(page=1) {
    return this.http
      .get(`https://swapi.dev/api/people/?page=${page}&format=json`)
      .pipe(
        map((res) => res.data),
       
      )
      .pipe(
        catchError(() => {
          throw new ForbiddenException('API not available');
        }),
      );
  }

  async getUserSearch(name) {
    return this.http
      .get(`https://swapi.dev/api/people/?search=${name}&format=json`)
      .pipe(
        map((res) => res.data),     
      )
      .pipe(
        catchError(() => {
          throw new ForbiddenException('API not available');
        }),
      );
  }



  async getUserDetials(id): Promise<Users> {
    const { data } = await firstValueFrom(
      this.http.get<Users>(`https://swapi.dev/api/people/${id}/?format=json`).pipe(
        catchError((error) => {
          throw new ForbiddenException('API not available');
        }),
      ),
    );
    return data;
  }


  async getUserhomeWorld(url): Promise<Users> {
    const { data } = await firstValueFrom(
      this.http.get<Users>(`${url}?format=json`).pipe(
        catchError((error) => {
          throw new ForbiddenException('API not available');
        }),
      ),
    );
    return data;
  }
  async getUserFilms(url): Promise<Users> {
    const { data } = await firstValueFrom(
      this.http.get<Users>(`${url}?format=json`).pipe(
        catchError((error) => {
          throw new ForbiddenException('API not available');
        }),
      ),
    );
    return data;
  }



}
