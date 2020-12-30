import { Options } from '@angular-slider/ngx-slider';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RenderingService } from './services/rendering/rendering.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  
  @ViewChild('canvas') canvas: ElementRef;

  sliderOptions: Options = {
    floor: -50,
    ceil: 50,
    translate: (val) => ''
  };

  thresholdOptions: Options = {
    floor: 0,
    ceil: 100,
    translate: (val) => ''
  }

  sliderForm: FormGroup;

  constructor(private renderSvc: RenderingService) {
    this.sliderForm = new FormGroup({
      thrSliderControl: new FormControl(0),
      lonSliderControl: new FormControl([-50, 50]),
      latSliderControl: new FormControl([-50, 50]),
    });

    this.sliderForm.valueChanges.subscribe((newVal) => {
      this.renderSvc.updateMeshData(
        newVal.lonSliderControl[0], newVal.lonSliderControl[1],
        newVal.latSliderControl[0], newVal.latSliderControl[1],
        newVal.thrSliderControl);
    })
  }
  
  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
    this.renderSvc.init(this.canvas.nativeElement);
    this.renderSvc.render();
  }

}
