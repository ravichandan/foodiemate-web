import { Component } from '@angular/core';
import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons/faFacebookSquare';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons/faWhatsapp';
import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy';
import { faPinterest } from '@fortawesome/free-brands-svg-icons/faPinterest';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';

@Component({
  selector: 'app-sharing-buttons',
  standalone: true,
  imports: [ShareButtonsModule],
  templateUrl: './sharing-buttons.component.html',
  styleUrl: './sharing-buttons.component.scss',
})
export class SharingButtonsComponent {
  fbIcon = faFacebookSquare;
  whatsappIcon = faWhatsapp;
  copyIcon: any = faCopy;
  pinIcon: any = faPinterest;
}
