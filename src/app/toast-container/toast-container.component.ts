import { Component, inject } from '@angular/core';

import { ToastService } from '../services/toast.service';
import { NgTemplateOutlet } from '@angular/common';
import { NgbToastModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-toasts',
  standalone: true,
  imports: [NgbToastModule, NgTemplateOutlet, NgbTooltipModule],
  template: `
    @for (toast of toastService.toasts; track toast) {
			<ngb-toast
				[class]="toast.classname"
				[autohide]="true"
				[delay]="toast.delay || 5000"
				(hidden)="toastService.remove(toast)"
			>
				<ng-template [ngTemplateOutlet]="standardTpl" [ngTemplateOutletContext]="{$implicit: toast.content}"></ng-template>
			</ngb-toast>
		}


    <ng-template #standardTpl let-content> {{ content }}</ng-template>

<!--    <ng-template #successTpl> I'm a success toast</ng-template>-->

    <ng-template #dangerTpl>
      <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" width="24" height="24" viewBox="0 0 24 24">
        <path
          d="M10.872 6.831l1.695 3.904 3.654-1.561-1.79 3.426 3.333.954-3.417 1.338 2.231 4.196-4.773-2.582-2.869 2.287.413-3.004-3.792-.726 2.93-1.74-1.885-2.512 3.427.646.843-4.626zm-.786-6.831l-1.665 9.119-6.512-1.228 3.639 4.851-5.548 3.294 7.108 1.361-.834 6.076 5.742-4.577 9.438 5.104-4.288-8.064 6.834-2.677-6.661-1.907 3.25-6.22-6.98 2.982-3.523-8.114z"
        />
      </svg>
      Danger Danger !
    </ng-template>
	`,
  host: { class: 'toast-container position-fixed top-0 end-0 p-3', style: 'z-index: 1200' },
})
export class ToastContainerComponent {
  toastService = inject(ToastService);

  constructor() {
    console.log('in toast-container.component, ', this.toastService.toasts.length);
  }
}
