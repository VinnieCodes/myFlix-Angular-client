import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent implements OnInit {
  userData: any = {};
  favoriteMovies: any[] = [];
  constructor(public fetchApiData: FetchApiDataService, public router: Router) {
    this.userData = JSON.parse(localStorage.getItem('user') || '');
  }

  ngOnInit(): void {
    this.getUser();
    this.getfavoriteMovies();
  }

  updateUser(): void {
    this.fetchApiData.editUser(this.userData.Username, this.userData).subscribe(
      (res: any) => {
        this.userData = {
          ...res,
          id: res._id,
          password: this.userData.password,
          token: this.userData.token,
        };
        localStorage.setItem('user', JSON.stringify(this.userData));
        this.getfavoriteMovies();
      },
      (err: any) => {
        console.error(err);
      }
    );
  }
  resetUser(): void {
    this.userData = JSON.parse(localStorage.getItem('user') || '');
  }
  backToMovie(): void {
    this.router.navigate(['movies']);
  }

  getfavoriteMovies(): void {
    const token = localStorage.getItem('token');
    this.fetchApiData.getAllMovies(token).subscribe(
      (res: any) => {
        this.favoriteMovies = res.filter((movie: any) => {
          return this.userData.FavoriteMovies.includes(movie._id);
        });
      },
      (err: any) => {
        console.error(err);
      }
    );
  }

  getUser(): void {
    this.fetchApiData.getUser(this.userData.Username).subscribe((res: any) => {
      this.userData = {
        ...res,
        id: res._id,
        password: this.userData.password,
        token: this.userData.token,
      };
      localStorage.setItem('user', JSON.stringify(this.userData));
      this.getfavoriteMovies();
    });
  }

  removeFromFavorite(movie: any): void {
    this.fetchApiData
      .removeFavoriteMovie(this.userData.Username, movie._id)
      .subscribe(
        (res) => {
          console.log('remove success');
          console.log(res);
          this.userData.FavoriteMovies = res.FavoriteMovies;
          localStorage.setItem('user', JSON.stringify(this.userData));
          location.reload();
        },
        (err) => {
          console.error(err);
        }
      );
  }

  logout(): void {
    this.router.navigate(['welcome']);
    localStorage.removeItem('user');
  }

  redirectProfile(): void {
    this.router.navigate(['movies']);
  }
}
