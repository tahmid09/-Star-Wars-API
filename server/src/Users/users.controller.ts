import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BehaviorSubject, Observable, first } from 'rxjs';
import { User } from './entities/user.entity';
import { cachedDataVersionTag } from 'v8';


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

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
 userData = {}

  @Get("list/:page")
  getuserList(@Param('page') page) {
    return this.usersService.getUserList(page);
  }

  @Get("get-user/:name")
  getUserSearchDetials(@Param('name') name) {
    let user = this.usersService.getUserSearch(name);
    return user
  }



@Get("user/:id" )
async getUserDetials(@Param('id') id) {
 let user: Users = await this.usersService.getUserDetials(id);
 
 let homeWorld = await this.usersService.getUserhomeWorld(user.homeworld);
 
let filimData = []
for(let i=0; i< user.films.length; i++) {
  filimData.push( await this.usersService.getUserFilms(user.films[i]))
}
let species = []
for(let i=0; i< user.species.length; i++) {
  species.push( await this.usersService.getUserFilms(user.species[i]))
}


return   {homeWorld, filimData, species, user}
}








}
