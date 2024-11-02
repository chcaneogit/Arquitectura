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
    this.limpiarCampos();
  }

  login() {
    if (this.email === 'admin' && this.password === 'admin') {
      this.router.navigate(['/admin']);
    } else if (this.email === 'user' && this.password === 'user') {
      this.router.navigate(['/home']);
    } else {
      alert('Credenciales incorrectas.');
    }
  }


  limpiarCampos() {
    this.email = '';
    this.password = '';
  }
}
