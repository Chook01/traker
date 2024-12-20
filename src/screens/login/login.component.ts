import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})

export class LoginComponent implements OnInit {

  constructor(private apiService: ApiService, private router: Router) { }
  ngOnInit(): void {
    this.redirectIfAuthenticated();
  }

  public username: string | undefined;
  public password: string | undefined;

  public loginUser() {
    if (!this.username || !this.password) return;

    this.apiService.loginUser(this.username, this.password).subscribe({
      next: (user: any) => {
        this.apiService.userData.JWT_TOKEN = user['token'];
        window.localStorage.setItem('userData', JSON.stringify(this.apiService.userData));
        this.router.navigateByUrl('/');
      }
    })
  }

  public redirectIfAuthenticated(): void {
    const userData = localStorage.getItem('userData');
    if (userData) {
      this.router.navigateByUrl('/');
    }
  }
}
