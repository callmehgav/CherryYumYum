import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { InstagramService, InstagramMediaItem } from '../../services/instagram.service';
import {} from '@angular/common/http';

@Component({
    selector: 'app-instagram-section',
    imports: [],
    templateUrl: './instagram-section.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./instagram-section.component.css']
})
export class InstagramSectionComponent implements OnInit {
  mediaItems: InstagramMediaItem[] = [];
  itemsToShow = 8;
  playingItems = new Set<string>();

  constructor(private instagramService: InstagramService) {}

  ngOnInit(): void {
    this.instagramService.getInstagramFeed().subscribe((items: InstagramMediaItem[]) => {
      this.mediaItems = items;
    });
  }

  loadMore(): void {
    this.itemsToShow += 4;
  }

  playVideo(itemId: string, event: MouseEvent): void {
    event.preventDefault();
    this.playingItems.add(itemId);
  }
}
