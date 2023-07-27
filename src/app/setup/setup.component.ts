import { Component } from '@angular/core';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss'],
})
export class SetupComponent {
  // Calculation
  selectedDate: Date = new Date();
  current_cl: number = 0;
  current_credits: number = 0;
  current_week: number = 1;

  spotlight_caches: number = 0;
  first_spotlight_cl: number = 610;

  daily: boolean = true;
  weekly: boolean = true;
  weekend: boolean = true;
  season: boolean = true;
  conquest: boolean = true;

  daily_credits: number = 0;
  weekly_credits: number = 0;
  weekend_credits: number = 0;
  season_credits: number = 0;
  conquest_credits: number = 0;
  total_credits: number = 0;

  // Testing
  days_away: number = 0;
  weeks_away: number = 0;
  seasons_away: number = 0;
  cl_away: number = 0;

  // Form controlss
  hideRequiredControl = new FormControl(false);
  floatLabelControl = new FormControl('auto' as FloatLabelType);
  options = this._formBuilder.group({
    hideRequired: this.hideRequiredControl,
    floatLabel: this.floatLabelControl,
    predictionDate: ['', Validators.required],
  });

  constructor(private _formBuilder: FormBuilder) {}

  calculate() {
    const [weeksCount, seasonsCount] = this.getWeeksSeasonsUntilDate(
      this.selectedDate
    );
    this.daily_credits = this.getDaily(this.daily) * this.days_away;
    this.weekly_credits = this.getWeekly(this.weekly) * weeksCount;
    this.weekend_credits = this.getWeekend(this.weekend) * weeksCount;

    this.season_credits = this.getSeason(this.season) * seasonsCount;
    this.conquest_credits = this.getConquest(this.conquest) * seasonsCount;

    this.total_credits =
      this.current_credits +
      this.daily_credits +
      this.weekly_credits +
      this.weekend_credits +
      this.season_credits +
      this.conquest_credits;

    // Spotlight cache every 120 CL, starts at CL 610
    if (this.selectedDate && this.total_credits > 0) {
      const cl_obtained: number = this.total_credits / 50;
      this.cl_away = this.current_cl + cl_obtained;

      // Use the difference to calculate spotlights
      const predicted_spotlight = this.cl_away / 120;
      const current_spotlight = this.current_cl / 120;

      console.log('predicted spotlight: ' + predicted_spotlight);
      console.log('current spotlight: ' + current_spotlight);

      //this.spotlight_caches = cl_obtained / 120;
      this.spotlight_caches = predicted_spotlight - current_spotlight;
    }
  }

  getDaily(completed: boolean) {
    return completed ? 500 : 0;
  }
  setDaily(completed: boolean) {
    this.daily = completed;
    this.calculate();
  }

  getWeekly(completed: boolean) {
    return completed ? 1350 : 0;
  }
  setWeekly(completed: boolean) {
    this.weekly = completed;
    this.calculate();
  }

  getWeekend(completed: boolean) {
    return completed ? 200 : 0;
  }
  setWeekend(completed: boolean) {
    this.weekend = completed;
    this.calculate();
  }

  getSeason(completed: boolean) {
    return completed ? 2300 : 0;
  }
  setSeason(completed: boolean) {
    this.season = completed;
    this.calculate();
  }

  getConquest(completed: boolean) {
    return completed ? 900 : 0;
  }
  setConquest(completed: boolean) {
    this.conquest = completed;
    this.calculate();
  }

  setCurrentCredits(val: number) {
    this.current_credits = val;
    this.calculate();
  }
  setCurrentCollectionLevel(val: number) {
    this.current_cl = val;
    this.calculate();
  }

  // Keep track of the week in season
  setCurrentWeek(val: number) {
    this.current_week = val;
    this.calculate();
  }

  calculateDaysAway(event: MatDatepickerInputEvent<Date>) {
    if (event.value) {
      const currentDate = new Date();
      const selectedDateTime = event.value.getTime();
      const currentDateTime = currentDate.getTime();
      const timeDifference = selectedDateTime - currentDateTime;
      this.days_away = Math.ceil(timeDifference / (1000 * 3600 * 24));
      this.selectedDate = event.value;
    } else {
      this.days_away = 0;
    }
    this.calculate();
  }

  getWeeksSeasonsUntilDate(targetDate: Date): [number, number] {
    const startDate = new Date(); // Today's date
    const dayIndex = 1; // Monday is index 1 in JavaScript (0 is Sunday)
    const weeks_in_season: number = 5;
    let weekCount = this.current_week;
    let mondaysCount = 0;
    let seasonsCount = 0;

    while (startDate < targetDate) {
      if (startDate.getDay() === dayIndex) {
        // update number of weeks
        mondaysCount++;

        // update number of seasons
        if (weekCount == weeks_in_season) {
          // new season, reset week to 1
          seasonsCount++;
          weekCount = 1;
        } else {
          // update the week
          weekCount++;
        }
      }
      // set current day to the next day
      startDate.setDate(startDate.getDate() + 1);
    }

    this.weeks_away = mondaysCount;
    this.seasons_away = seasonsCount;
    return [mondaysCount, seasonsCount];
  }
}
