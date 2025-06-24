import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'No authorization code provided' }, { status: 400 });
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'LegitPoll/1.0.0'
      },
      body: `grant_type=authorization_code&code=${code}&redirect_uri=http://localhost:3000/auth/reddit/callback`
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Reddit token exchange failed:', errorText);
      return NextResponse.json({ error: 'Failed to exchange code for token' }, { status: 400 });
    }

    const tokenData = await tokenResponse.json();
    
    if (tokenData.error) {
      return NextResponse.json({ error: tokenData.error }, { status: 400 });
    }

    // Get user info from Reddit API
    const userResponse = await fetch('https://oauth.reddit.com/api/v1/me', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'User-Agent': 'LegitPoll/1.0.0'
      }
    });

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.error('Reddit user info failed:', errorText);
      return NextResponse.json({ error: 'Failed to fetch user info' }, { status: 400 });
    }

    const userData = await userResponse.json();

    // Return user data
    return NextResponse.json({
      provider: 'reddit',
      id: userData.id,
      username: userData.name,
      displayName: userData.name,
      profileUrl: `https://reddit.com/u/${userData.name}`,
      avatar: userData.icon_img ? userData.icon_img.split('?')[0] : null, // Remove query params
      verified: userData.verified || false,
      karma: {
        comment: userData.comment_karma || 0,
        link: userData.link_karma || 0,
        total: (userData.comment_karma || 0) + (userData.link_karma || 0)
      },
      accountCreated: userData.created_utc,
      accessToken: tokenData.access_token // Store for future API calls if needed
    });

  } catch (error) {
    console.error('Reddit OAuth error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}