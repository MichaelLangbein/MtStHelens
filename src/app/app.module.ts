import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { ReactiveFormsModule } from '@angular/forms';
import { MtStHelensWasmComponent } from './mt-st-helens-wasm/mt-st-helens-wasm.component';
import { MtStHelensJsComponent } from './mt-st-helens-js/mt-st-helens-js.component';
import { AppRoutingModule } from './app-routing.module';
import { PolygonJsComponent } from './polygon-js/polygon-js.component';
import { PolygonWebGLComponent } from './polygon-web-gl/polygon-web-gl.component';

@NgModule({
  declarations: [
    AppComponent,
    MtStHelensWasmComponent,
    MtStHelensJsComponent,
    PolygonJsComponent,
    PolygonWebGLComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatGridListModule,
    MatSidenavModule,
    MatCardModule,
    MatSliderModule,
    NgxSliderModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatFormFieldModule,
    MatButtonToggleModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
