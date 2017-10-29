import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.css']
})
export class LicenseComponent implements OnInit {

  constructor(
    private titleService: Title,
  ) { }

  ngOnInit() {
    this.titleService.setTitle('CycloLibre - Licence')
  }

}
