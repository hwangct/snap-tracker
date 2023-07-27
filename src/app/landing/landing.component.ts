import { Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { SetupComponent } from '../setup/setup.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent {
  constructor(private _bottomSheet: MatBottomSheet) {}

  openSetup(): void {
    this._bottomSheet.open(SetupComponent);
  }
}
