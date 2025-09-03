import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DataItem {
  title: string;
  description: string;
  source: 'github' | 'other';
  author: string;
  created_at: string;
  url: string;
  score?: number;
  tags: string[];
  data_type: string;
  external_id: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const items: DataItem[] = [];

    // Collect data from Reddit
    console.log('Fetching data from Reddit...');
    try {
      const redditResponse = await fetch('https://www.reddit.com/r/programming/hot.json?limit=10');
      const redditData = await redditResponse.json();
      
      if (redditData.data?.children) {
        for (const post of redditData.data.children) {
          const data = post.data;
          items.push({
            title: data.title || 'No title',
            description: data.selftext || data.title || 'No description',
            source: 'reddit',
            author: data.author || 'unknown',
            created_at: new Date(data.created_utc * 1000).toISOString(),
            url: `https://reddit.com${data.permalink}`,
            score: data.score || 0,
            tags: [data.subreddit || 'programming', ...(data.link_flair_text ? [data.link_flair_text.toLowerCase()] : [])],
            data_type: 'post',
            external_id: data.id
          });
        }
        console.log(`Collected ${redditData.data.children.length} items from Reddit`);
      }
    } catch (error) {
      console.error('Error fetching Reddit data:', error);
    }

    // Collect data from GitHub
    console.log('Fetching data from GitHub...');
    try {
      const githubResponse = await fetch('https://api.github.com/search/repositories?q=javascript+language:javascript&sort=stars&order=desc&per_page=10');
      const githubData = await githubResponse.json();
      
      if (githubData.items) {
        for (const repo of githubData.items) {
          items.push({
            title: repo.name || 'No title',
            description: repo.description || 'No description',
            source: 'github',
            author: repo.owner?.login || 'unknown',
            created_at: repo.created_at,
            url: repo.html_url,
            score: repo.stargazers_count || 0,
            tags: [repo.language?.toLowerCase() || 'unknown', ...(repo.topics || [])],
            data_type: 'repository',
            external_id: repo.id.toString()
          });
        }
        console.log(`Collected ${githubData.items.length} items from GitHub`);
      }
    } catch (error) {
      console.error('Error fetching GitHub data:', error);
    }

    // Store items in database (avoiding duplicates)
    let insertedCount = 0;
    for (const item of items) {
      try {
        // Check if item already exists
        const { data: existing } = await supabaseClient
          .from('data_items')
          .select('id')
          .eq('external_id', item.external_id)
          .eq('source', item.source)
          .maybeSingle();

        if (!existing) {
          const { error } = await supabaseClient
            .from('data_items')
            .insert([item]);

          if (error) {
            console.error('Error inserting item:', error);
          } else {
            insertedCount++;
            console.log(`Inserted new ${item.source} item: ${item.title}`);
          }
        } else {
          console.log(`Skipped duplicate ${item.source} item: ${item.title}`);
        }
      } catch (error) {
        console.error('Error checking/inserting item:', error);
      }
    }

    console.log(`Successfully inserted ${insertedCount} new items`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Data collection completed. Inserted ${insertedCount} new items.`,
        total_collected: items.length,
        new_items: insertedCount
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in collect-data function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to collect data',
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});