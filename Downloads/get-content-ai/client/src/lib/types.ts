// Social platform types
export type Platform = "instagram" | "twitter" | "facebook" | "linkedin";

export type SocialPlatform = {
  id: Platform;
  name: string;
  icon: string;
};

// Content types optimized for each platform's popular formats
export type ContentType = "post" | "carousel" | "story" | "thread" | "reel" | "article";

// Content response type
export interface ContentResponse {
  title: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
}

// Content variation type
export interface ContentVariation {
  title?: string;
  content: string;
}

// Content history type
export interface ContentHistory {
  id: string;
  title: string;
  platform: Platform;
  createdAt: string;
}

// Generation request type
export interface GenerationRequest {
  topic: string;
  tone: string;
  keywords?: string;
  audience: string;
  platform: Platform;
  contentType: ContentType;
}

// Generation response type
export interface GenerationResponse {
  mainContent: ContentResponse;
  variations: ContentVariation[];
}
