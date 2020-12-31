import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MtStHelensJsComponent } from './mt-st-helens-js/mt-st-helens-js.component';
import { MtStHelensWasmComponent } from './mt-st-helens-wasm/mt-st-helens-wasm.component';



const routes: Routes = [
  {
    path: '',
    redirectTo: '/js',
    pathMatch: 'full'
  },
  {
    path: 'wasm',
    component: MtStHelensWasmComponent
  }, 
  {
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
