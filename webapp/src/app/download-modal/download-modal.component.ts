import { Component, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';


@Component({
    selector: 'app-download-modal',
    imports: [],
    templateUrl: './download-modal.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./download-modal.component.css']
})
export class DownloadModalComponent {
  @Output() closed = new EventEmitter<void>();

  readonly fileName = 'iLoveYou.txt';

  close() {
    this.closed.emit();
  }

  download() {
    const link = document.createElement('a');
    link.href = `../../../assets/pics/pdf/${this.fileName}`;
    link.download = this.fileName;
    link.click();
  }
}
