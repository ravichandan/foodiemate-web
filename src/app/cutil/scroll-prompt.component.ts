import { Component } from '@angular/core';

@Component({
  selector: 'app-scroll-prompt',
  standalone: true,
  imports: [],
  template: `<div class="scroll-prompt"  style="opacity: 1;">
    <div class="scroll-prompt-arrow-container">
        <div class="scroll-prompt-arrow"><div></div></div>
        <div class="scroll-prompt-arrow"><div></div></div>
    </div>
</div>`,
})
export class ScrollPromptComponent {

}
