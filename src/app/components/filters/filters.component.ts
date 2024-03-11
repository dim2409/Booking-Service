import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule,
    MatSelectModule],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.less'
})
export class FiltersComponent implements OnInit {
  @Output() filterUpdated: EventEmitter<any> = new EventEmitter<any>();

  @Input() rooms: any[] = [];
  ngOnInit(): void {
    console.log(this.rooms);
  }
  selectRoom(event: MatSelectChange) {
    this.filterUpdated.emit(event.value);
  }
}
