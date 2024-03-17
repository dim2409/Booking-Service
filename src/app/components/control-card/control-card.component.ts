import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import {MatChipsModule} from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-control-card',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
    MatButtonModule,
    MatChipsModule,
    MatPaginatorModule
  ],
  templateUrl: './control-card.component.html',
  styleUrl: './control-card.component.less'
})
export class ControlCardComponent {
  chips = [
    {label: 'Day created', value: 'day_created',selected: false},
    {label: 'Alphabetical', value: 'Alphabetical',selected: false},
    {label: 'Date', value: 'date',selected: false},
  ]
  @Output() bookingUpdated: EventEmitter<any> = new EventEmitter<any>();
  @Output() onPageChange: EventEmitter<any> = new EventEmitter<any>();

  @Input() buttons!: any;
  @Input() someSelect!: boolean;
  @Input() params!: any;

  selectAll: boolean = false;
  buttonAction(action: string) {
    this.bookingUpdated.emit({action: action});
  }

  toggleSelect(){
    this.selectAll = !this.selectAll
  }
  toggleSorter(chip: any){
    chip.selected = !chip.selected
    this.chips.filter((x)=>x.value != chip.value).forEach((x)=>{
      x.selected = false
    });
  }

  pageChange(event: PageEvent): void {
   this.onPageChange.emit(event)
  }
}
