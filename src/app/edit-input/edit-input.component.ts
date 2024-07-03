import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutofocusDirective } from '../directives/autofocus.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons/faPencil';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-edit-input',
  standalone: true,
  templateUrl: './edit-input.component.html',
  styleUrls: ['./edit-input.component.scss'],
  imports: [DecimalPipe, FormsModule, AutofocusDirective, FaIconComponent],
})
export class EditInputComponent implements OnInit {
  protected readonly faPencil = faPencil;

  @Input() data: any | undefined;
  @Input('aria-describedby') ariaDescribedby!: any;
  @Input() type!: any;
  @Input() readonly!: boolean;
  @Input() name!: string;
  @Input() label!: any;

  @Output() focusOut: EventEmitter<any> = new EventEmitter<any>();

  appService= inject(AppService);

  editMode = false;
  config: any;
  constructor() {
    this.config = this.appService.getConfig();
  }

  ngOnInit() {}

  onFocusOut() {
    this.editMode = false;
    this.focusOut.emit(this.data);
  }

  onKeyDown($event: any) {
    console.log('In onKeyDown(), $event.target:: ', $event.target);
    $event.target?.blur();
  }

  stripSpace(str: string) {
    return str.replace(/\s/g, '');
  }
}
