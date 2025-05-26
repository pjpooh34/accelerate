export type Platform = "instagram" | "twitter" | "facebook" | "linkedin";

export interface PostContent {
  text: string;
  imageUrl?: string;
  imageBase64?: string;
}

export interface PostResult {
  success: boolean;
  postId?: string;
  platformUrl?: string;
  error?: string;
}

/**
 * Instagram Business API posting
 */
export async function postToInstagram(content: PostContent): Promise<PostResult> {
  if (!process.env.INSTAGRAM_ACCESS_TOKEN) {
    return { success: false, error: "Instagram access token not configured" };
  }

  try {
    const mediaData: any = {
      caption: content.text,
      access_token: process.env.INSTAGRAM_ACCESS_TOKEN
    };

    // Add image if provided
    if (content.imageUrl) {
      mediaData.image_url = content.imageUrl;
    }

    // Create media container
    const containerResponse = await fetch(
      `https://graph.facebook.com/v18.0/${process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID}/media`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mediaData)
      }
    );

    const containerData = await containerResponse.json();
    
    if (!containerResponse.ok) {
      return { success: false, error: containerData.error?.message || 'Failed to create Instagram media container' };
    }

    // Publish the media
    const publishResponse = await fetch(
      `https://graph.facebook.com/v18.0/${process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID}/media_publish`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: containerData.id,
          access_token: process.env.INSTAGRAM_ACCESS_TOKEN
        })
      }
    );

    const publishData = await publishResponse.json();

    if (!publishResponse.ok) {
      return { success: false, error: publishData.error?.message || 'Failed to publish Instagram post' };
    }

    return {
      success: true,
      postId: publishData.id,
      platformUrl: `https://www.instagram.com/p/${publishData.id}/`
    };

  } catch (error: any) {
    return { success: false, error: `Instagram posting failed: ${error.message}` };
  }
}

/**
 * Twitter/X API v2 posting
 */
export async function postToTwitter(content: PostContent): Promise<PostResult> {
  if (!process.env.TWITTER_BEARER_TOKEN) {
    return { success: false, error: "Twitter Bearer token not configured" };
  }

  try {
    const tweetData: any = {
      text: content.text
    };

    // Handle image upload if provided
    if (content.imageBase64) {
      // First upload media
      const mediaResponse = await fetch('https://upload.twitter.com/1.1/media/upload.json', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          media_data: content.imageBase64,
          media_category: 'TWEET_IMAGE'
        })
      });

      const mediaData = await mediaResponse.json();
      
      if (mediaResponse.ok && mediaData.media_id_string) {
        tweetData.media = { media_ids: [mediaData.media_id_string] };
      }
    }

    // Post tweet
    const response = await fetch('https://api.twitter.com/2/tweets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tweetData)
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.detail || 'Failed to post to Twitter' };
    }

    return {
      success: true,
      postId: data.data.id,
      platformUrl: `https://twitter.com/user/status/${data.data.id}`
    };

  } catch (error: any) {
    return { success: false, error: `Twitter posting failed: ${error.message}` };
  }
}

/**
 * Facebook Pages API posting
 */
export async function postToFacebook(content: PostContent): Promise<PostResult> {
  if (!process.env.FACEBOOK_PAGE_ACCESS_TOKEN) {
    return { success: false, error: "Facebook page access token not configured" };
  }

  try {
    const postData: any = {
      message: content.text,
      access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN
    };

    if (content.imageUrl) {
      postData.link = content.imageUrl;
    }

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${process.env.FACEBOOK_PAGE_ID}/feed`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error?.message || 'Failed to post to Facebook' };
    }

    return {
      success: true,
      postId: data.id,
      platformUrl: `https://www.facebook.com/${data.id}`
    };

  } catch (error: any) {
    return { success: false, error: `Facebook posting failed: ${error.message}` };
  }
}

/**
 * LinkedIn API posting
 */
export async function postToLinkedIn(content: PostContent): Promise<PostResult> {
  if (!process.env.LINKEDIN_ACCESS_TOKEN) {
    return { success: false, error: "LinkedIn access token not configured" };
  }

  try {
    const postData = {
      author: `urn:li:person:${process.env.LINKEDIN_PERSON_ID}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: content.text
          },
          shareMediaCategory: content.imageUrl ? 'IMAGE' : 'NONE',
          ...(content.imageUrl && {
            media: [{
              status: 'READY',
              description: {
                text: 'Shared via Get Content AI'
              },
              media: content.imageUrl,
              title: {
                text: 'AI Generated Content'
              }
            }]
          })
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      }
    };

    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      },
      body: JSON.stringify(postData)
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message || 'Failed to post to LinkedIn' };
    }

    return {
      success: true,
      postId: data.id,
      platformUrl: `https://www.linkedin.com/feed/update/${data.id}/`
    };

  } catch (error: any) {
    return { success: false, error: `LinkedIn posting failed: ${error.message}` };
  }
}

/**
 * Main posting function that routes to the appropriate platform
 */
export async function postToSocialMedia(
  platform: Platform,
  content: PostContent
): Promise<PostResult> {
  switch (platform) {
    case 'instagram':
      return postToInstagram(content);
    case 'twitter':
      return postToTwitter(content);
    case 'facebook':
      return postToFacebook(content);
    case 'linkedin':
      return postToLinkedIn(content);
    default:
      return { success: false, error: `Unsupported platform: ${platform}` };
  }
}