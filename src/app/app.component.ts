import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RenderingService } from './services/rendering/rendering.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas') canvas: ElementRef;

  constructor(private renderSvc: RenderingService) {}
  
  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
    this.renderSvc.init(this.canvas.nativeElement);
    this.renderSvc.render();
  }

}
