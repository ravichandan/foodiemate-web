import { Injectable, TemplateRef } from '@angular/core';

export interface Toast {
  // template: TemplateRef<any>;
  classname?: string;
  delay?: number;
  content: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: Toast[] = [];

  show(toast: Toast) {
    this.toasts.push(toast);
  }

  remove(toast: Toast) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }

  clear() {
    this.toasts.splice(0, this.toasts.length);
  }

  showStandard(content: string/*template: TemplateRef<any>*/) {
    this.show({ content });
  }

  showSuccess(content: string) {
    // console.log('in toast.service -> showSuccess, content:: ', content);
    // this.show({ content,classname: 'bg-success-subtle text-light', delay: 10000 });
    // this.show({ content,classname: 'bg-success text-light', delay: 10000 });
    this.show({ content,classname: 'bg-success-subtle text-dark', delay: 10000 });
    // this.show({ content,classname: 'bg-success text-dark', delay: 10000 });
  }

  showDanger(content: string) {
    this.show({ content, classname: 'bg-danger text-light', delay: 15000 });
    // this.show({ content, classname: 'bg-danger text-dark', delay: 15000 });
    // this.show({ content, classname: 'bg-danger-subtle text-light', delay: 15000 });
    // this.show({ content, classname: 'bg-danger-subtle text-dark', delay: 15000 });
  }
}
