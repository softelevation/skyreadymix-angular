import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppServiceService } from './../app-service.service';

@Component({
  selector: 'app-colors',
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.css']
})
export class ColorsComponent implements OnInit {

  colorForm: FormGroup;
  colors: Colors;
  error: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private appService: AppServiceService
  ) { }

  ngOnInit(): void {

    this.colorForm = this.fb.group({
      manufacturer: ['', Validators.required],
      color: ['', Validators.required],
      rate: ['', Validators.required]
    });


    this.appService.getColors().subscribe(
      (data: Colors) => this.colors = data['data'],
      error => this.error = error
    );
  }


  addNewColor()
  {
    this.colorForm.controls.manufacturer.setValue('');
    this.colorForm.controls.color.setValue('');
    this.colorForm.controls.rate.setValue('');
  }


  get manufacturer() { return this.colorForm.get('manufacturer'); }
  get color() { return this.colorForm.get('color'); }
  get rate() { return this.colorForm.get('rate'); }


  addColor() {
    let obj = {
      manufacturer : this.manufacturer.value,
      color : this.color.value,
      rate : this.rate.value
    }
    this.appService.addColor(obj).subscribe(
      (data: Colors) => {
        this.colors = data['data'];
      }
    );

}

}

interface Colors {
  id: number;
  manufacturer: string;
  color: string;
  rate: string;
}
