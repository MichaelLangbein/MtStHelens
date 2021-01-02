import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MtStHelensJsComponent } from './mt-st-helens-js/mt-st-helens-js.component';
import { MtStHelensWasmComponent } from './mt-st-helens-wasm/mt-st-helens-wasm.component';
import { PolygonJsComponent } from './polygon-js/polygon-js.component';
import { PolygonWebGLComponent } from './polygon-web-gl/polygon-web-gl.component';



const routes: Routes = [
  {
    path: '',
    redirectTo: '/polygonJs',
    pathMatch: 'full'
  }, {
    path: 'polygonJs',
    component: PolygonJsComponent
  }, {
    path: 'polygonWebGL',
    component: PolygonWebGLComponent
  }, {
    path: 'wasm',
    component: MtStHelensWasmComponent
  },  {
    path: 'js',
    component: MtStHelensJsComponent
  }
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
