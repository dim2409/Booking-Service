import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import {MatChipsModule} from '@angular/material/chips';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
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
    {label: 'Day created', value: 'day_created',selected: false, asc: false},
    {label: 'Alphabetical', value: 'title',selected: false, asc: false},
    {label: 'Date', value: 'start',selected: false, asc: false},
  ]
  @Output() bookingUpdated: EventEmitter<any> = new EventEmitter<any>();
  @Output() onPageChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectAllEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() sorterUpdated: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Input() buttons!: any;
  @Input() selectCount!: number;
  @Input() params!: any;
  

  selectAll: boolean = false;
  pageIndex!: number;
  buttonAction(action: string) {
    this.bookingUpdated.emit({action: action});
  }
  
  toggleSelect(){
    this.selectAll = !this.selectAll
    this.selectAllEvent.emit(this.selectAll)
  }
  toggleSorter(chip: any){
    console.log(chip.selected)
    if(chip.selected){
      if(!chip.asc){
        chip.asc = true
      }else{
        chip.selected = false;
        chip.asc = false
      }
    }else{
      chip.selected = true;
    }
    this.chips.filter((x)=>x.value != chip.value).forEach((x)=>{
      x.selected = false
    });
    this.resetPageIndex()
    this.sorterUpdated.emit(chip)
  }

  pageChange(event: PageEvent): void {
   this.onPageChange.emit(event)
  }

  resetPageIndex() {
    this.paginator.pageIndex = 0;
  }
}
