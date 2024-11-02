import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importa Router

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';

  constructor(private router: Router) { }

  ngOnInit() {
  }

  login() {
    if (this.email === 'usuario' && this.password === 'usuario') {
      this.router.navigate(['/home']);
    } else {
      alert('Credenciales incorrectas.');
    }
  }
}
