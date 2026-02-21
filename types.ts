
export type AppStage = 'intro-1' | 'intro-2' | 'countdown' | 'video-reveal' | 'growing' | 'messages' | 'bond' | 'final';

export interface PhotoData {
  id: number;
  url: string;
  caption: string;
}

export interface MessageData {
  id: number;
  title: string;
  content: string;
  color: 'pink' | 'purple';
}
