import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
export interface InstagramMediaItem {
  id: string;
  caption: string;
  media_type: string; // <-- not mediaType
  media_url: string;
  timestamp: string;
  permalink: string;
  thumbnail_url?: string;
}


@Injectable({
  providedIn: 'root',
})
export class InstagramService {
  private apiUrl = environment.apiUrl+'/instagram/feed';

  constructor(private http: HttpClient) {}

 getInstagramFeed(): Observable<InstagramMediaItem[]> {
  return this.http.get<InstagramMediaItem[]>(this.apiUrl).pipe(
    map(items => items.map(item => ({
      ...item,
      mediaType: item.media_type,
      mediaUrl: item.media_url
    })))
  );
}



}
