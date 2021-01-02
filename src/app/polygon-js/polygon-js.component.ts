import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { OlService } from '../services/ol/rendering/ol.service';
import 'ol/ol.css';


@Component({
  selector: 'app-polygon-js',
  templateUrl: './polygon-js.component.html',
  styleUrls: ['./polygon-js.component.scss']
})
export class PolygonJsComponent implements OnInit, AfterViewInit {

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
    this.olSvc.init(this.map.nativeElement, this.fpsContainer.nativeElement, 'standard');
  }

  submit() {
    const newVal = this.sliderForm.value;
    this.olSvc.updateData(newVal.xControl, newVal.yControl);
  }

}
