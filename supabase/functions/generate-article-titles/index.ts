
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, keywords, audience, tone, titleType } = await req.json();

    if (!topic) {
      return new Response(
        JSON.stringify({ error: 'Topic is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `You are an expert content strategist and SEO specialist. Your task is to generate compelling, click-worthy article titles that are optimized for both search engines and human engagement.

Guidelines for title generation:
- Create titles that are 40-60 characters for optimal SEO
- Include power words and emotional triggers
- Make titles specific and actionable
- Consider the target audience and tone
- Incorporate keywords naturally when provided
- Use proven headline formulas (how-to, lists, questions, etc.)
- Focus on benefits and value proposition

Title Types and Formulas:
- How-to: "How to [Achieve Benefit] in [Timeframe]"
- Listicle: "[Number] [Adjective] Ways to [Achieve Goal]"
- Question: "Why Do [People] Struggle with [Problem]?"
- Ultimate: "The Ultimate Guide to [Topic]"
- Controversial: "Why [Common Belief] is Wrong"
- Comparison: "[Option A] vs [Option B]: Which is Better?"`;

    let userPrompt = `Generate 8 compelling article titles for the topic: "${topic}"`;
    
    if (keywords) {
      userPrompt += `\nIncorporate these keywords naturally: ${keywords}`;
    }
    
    if (audience) {
      userPrompt += `\nTarget audience: ${audience}`;
    }
    
    userPrompt += `\nTone: ${tone}`;
    
    if (titleType !== 'general') {
      const typeInstructions = {
        howto: 'Focus on how-to and tutorial style titles',
        listicle: 'Create numbered list-style titles (e.g., "5 Ways to...", "10 Tips for...")',
        question: 'Generate question-based titles that spark curiosity',
        controversial: 'Create thought-provoking, debate-worthy titles',
        ultimate: 'Focus on comprehensive, authoritative guide titles'
      };
      userPrompt += `\nTitle style: ${typeInstructions[titleType as keyof typeof typeInstructions]}`;
    }
    
    userPrompt += `\n\nReturn exactly 8 titles as a JSON array with no additional text or formatting.`;

    // Using Open Router's free API with a free model
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer sk-or-v1-free`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://lovableproject.com',
        'X-Title': 'Article Title Generator'
      },
      body: JSON.stringify({
        model: 'google/gemma-2-9b-it:free',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      console.error('Open Router API error:', response.status, await response.text());
      throw new Error(`Open Router API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    let titles;
    try {
      titles = JSON.parse(generatedContent);
      if (!Array.isArray(titles)) {
        throw new Error('Invalid response format');
      }
    } catch (parseError) {
      // Fallback: extract titles from text if JSON parsing fails
      const lines = generatedContent.split('\n').filter((line: string) => line.trim());
      titles = lines.map((line: string) => line.replace(/^\d+\.\s*/, '').replace(/^[-*]\s*/, '').trim())
        .filter((title: string) => title.length > 0)
        .slice(0, 8);
    }

    return new Response(
      JSON.stringify({ titles }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-article-titles function:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate titles', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
