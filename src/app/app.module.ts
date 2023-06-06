import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { VuelosComponent } from './components/vuelos/vuelos.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './components/register/register.component';
import { AngularMaterialModule } from './shared/angular-material/angular-material.module';
import { FiltradorComponent } from './components/vuelos/filtrador/filtrador.component';

import { MatNativeDateModule } from '@angular/material/core';
import { AdminComponent } from './components/admin/admin.component';
import { AdmUsuariosComponent } from './components/admin/adm-usuarios/adm-usuarios.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AddEditUsuarioComponent } from './components/admin/adm-usuarios/add-edit-usuario/add-edit-usuario.component';
import { ConfirmacionComponent } from './shared/confirmacion/confirmacion.component';
import { AdmAvionesComponent } from './components/admin/adm-aviones/adm-aviones.component';

import { AdmVuelosComponent } from './components/admin/adm-vuelos/adm-vuelos.component';
import { AddEditVueloComponent } from './components/admin/adm-vuelos/add-edit-vuelo/add-edit-vuelo.component';
import { AddEditAvionComponent } from './components/admin/adm-aviones/add-edit-avion/add-edit-avion.component';
import { AdmAeropuertosComponent } from './components/admin/adm-aeropuertos/adm-aeropuertos.component';
import { AddEditAeropuertoComponent } from './components/admin/adm-aeropuertos/add-edit-aeropuerto/add-edit-aeropuerto.component';
import { DatePipe } from '@angular/common';
import { AdmTipoasientosComponent } from './components/admin/adm-tipoasientos/adm-tipoasientos.component';
import { AddEditTipoasientosComponent } from './components/admin/adm-tipoasientos/add-edit-tipoasientos/add-edit-tipoasientos.component';
import { AdmAsientosComponent } from './components/admin/adm-asientos/adm-asientos.component';
import { AddEditAsientoComponent } from './components/admin/adm-asientos/add-edit-asiento/add-edit-asiento.component';
import { DetalleVueloComponent } from './components/detalle-vuelo/detalle-vuelo.component';
import { AdmReservasComponent } from './components/admin/adm-reservas/adm-reservas.component';
import { AddEditReservaComponent } from './components/admin/adm-reservas/add-edit-reserva/add-edit-reserva.component';
import { AuthInterceptor } from './auth.interceptor';
import { SeatDialogComponent } from './components/admin/adm-reservas/seat-dialog/seat-dialog.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { ElegirAsientoVueloComponent } from './components/detalle-vuelo/elegir-asiento-vuelo/elegir-asiento-vuelo.component';
import { AddReservaComponent } from './components/detalle-vuelo/add-reserva/add-reserva.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    VuelosComponent,
    LoginComponent,
    RegisterComponent,
    FiltradorComponent,
    AdminComponent,
    AdmUsuariosComponent,
    AddEditUsuarioComponent,
    ConfirmacionComponent,
    AdmAvionesComponent,
    AddEditAvionComponent,
    AdmVuelosComponent,
    AddEditVueloComponent,
    AdmAeropuertosComponent,
    AddEditAeropuertoComponent,
    AdmTipoasientosComponent,
    AddEditTipoasientosComponent,
    AdmAsientosComponent,
    AddEditAsientoComponent,
    ElegirAsientoVueloComponent,
    DetalleVueloComponent,
    AdmReservasComponent,
    AddEditReservaComponent,
    SeatDialogComponent,
    PerfilComponent,
    AddReservaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    MatNativeDateModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
