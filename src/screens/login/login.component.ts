import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})

export class LoginComponent implements OnInit {

  private apiService = inject(ApiService);
  private router = inject(Router);

  ngOnInit(): void {
    this.redirectIfAuthenticated();
  }

  public username: string | undefined;
  public password: string | undefined;

  public loginUser() {
    if (!this.username || !this.password) return;

    this.apiService.loginUser(this.username, this.password).subscribe({
      next: (user: any | User) => {
        this.apiService.userData.JWT_TOKEN = user.token;
        this.apiService.userData.username = user.record.username;
        window.localStorage.setItem('userData2', JSON.stringify(this.apiService.userData));
        this.router.navigateByUrl('/');
      }
    })
  }

  public redirectIfAuthenticated(): void {
    const userData = localStorage.getItem('userData2');
    if (userData) {
      this.router.navigateByUrl('/');
    }
  }
}
