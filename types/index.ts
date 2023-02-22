export interface SpotifyData {
    is_playing: boolean;
    item: {
      name: string;
      album: {
        name: string;
        artists: Array<{ name: string }>;
        images: [{ url: string }];
      };
      external_urls: {
        spotify: string;
      };
    };
    currently_playing_type: string;
}