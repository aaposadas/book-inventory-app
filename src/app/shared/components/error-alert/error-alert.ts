import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-error-alert',
  imports: [],
  templateUrl: './error-alert.html',
  styleUrl: './error-alert.css',
})
export class ErrorAlert {
  @Input() error!: string;
  @Output() dismiss = new EventEmitter<void>();
}
