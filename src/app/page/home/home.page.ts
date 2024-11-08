import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  enviar() {
    this.router.navigate(['/envio'], { queryParams: { refresh: new Date().getTime() } });
  }

  campanha() {
    this.router.navigate(['/ver-campanha']);
  }

  reporte() {
    this.router.navigate(['/ver-reporte']);
  }

  cerrar() {
    this.router.navigate(['/login']);
  }

}
