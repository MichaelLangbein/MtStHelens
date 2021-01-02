import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { OlService } from '../services/ol/rendering/ol.service';
import 'ol/ol.css';

@Component({
  selector: 'app-polygon-web-gl',
  templateUrl: './polygon-web-gl.component.html',
  styleUrls: ['./polygon-web-gl.component.scss']
})
export class PolygonWebGLComponent implements OnInit, AfterViewInit {

  @ViewChild('map') map: ElementRef;
  @ViewChild('fpsContainer') fpsContainer: ElementRef;

  sliderForm: FormGroup;

  constructor(private olSvc: OlService) { }
  
  ngOnInit(): void {
    this.sliderForm = new FormGroup({
      xControl: new FormControl(100),
      yControl: new FormControl(100),
    });

    this.sliderForm.valueChanges.subscribe(newVal => {
      console.log(newVal)
    })
  }

  ngAfterViewInit(): void {
    this.olSvc.init(this.map.nativeElement, this.fpsContainer.nativeElement, 'webgl');
  }

  submit() {
    const newVal = this.sliderForm.value;
    this.olSvc.updateData(newVal.xControl, newVal.yControl);
  }

}
