const Groq = require('groq-sdk');
const db = require('../db/connection');

// Initialize Groq SDK (Requires GROQ_API_KEY inside environment variables)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ARIA Identity - Core prompt instructing the LLM about its persona
const SYSTEM_PROMPT = `
You are ARIA, an intelligent personal AI assistant.
You were created by Ayush Pandey. You are NOT Gemini, NOT GPT, NOT Claude, NOT Llama.
If asked who made you, say: I am ARIA, built by Ayush Pandey.
When you need to perform an action, respond with a JSON tool_call object.
Always respond in the same language the user speaks.
`.trim();

async function handleChat(req, res) {
  try {
    const { session_id, message, user_id } = req.body;

    if (!session_id || !message) {
      return res.status(400).json({ error: 'session_id and message are required' });
    }

    // 1. Save user message to database
    await db.query(
      'INSERT INTO messages (session_id, role, content) VALUES (?, ?, ?)',
      [session_id, 'user', message]
    );

    // 2. Fetch total messages to auto-title the session for the first message
    const [msgCountResult] = await db.query('SELECT COUNT(*) as c FROM messages WHERE session_id = ?', [session_id]);
    if (msgCountResult[0].c === 1 || msgCountResult[0].c === 2) { 
       // On first user message, generate title from words
       const titleWords = message.split(' ').slice(0, 5);
       const title = titleWords.join(' ') + (message.split(' ').length > 5 ? '...' : '');
       await db.query('UPDATE sessions SET title = ? WHERE id = ?', [title, session_id]);
    }

    // 3. Update session last_active metadata
    await db.query('UPDATE sessions SET last_active = CURRENT_TIMESTAMP WHERE id = ?', [session_id]);

    // 4. Retrieve context history (last 10 messages)
    const [history] = await db.query(
      'SELECT role, content FROM messages WHERE session_id = ? ORDER BY created_at DESC LIMIT 10',
      [session_id]
    );
    
    // Convert to chronological order for the LLM
    history.reverse();

    // Map the payload matching the standard LLM messages object format
    const messagesForGroq = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.map(msg => ({ role: msg.role, content: msg.content }))
    ];

    // 5. Query the Groq Llama 3.3 70B interface
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: messagesForGroq,
      // tools: toolDefinitions, // To be wired during Phase 5 (Tools configuration)
      // tool_choice: 'auto',
      max_tokens: 1024,
    });

    const aiMessage = response.choices[0]?.message;
    const aiContent = aiMessage?.content || "I couldn't process that.";

    // Tool parsing checks will be instantiated here later

    // 6. Record ARIA's response recursively back tracking the context database
    await db.query(
      'INSERT INTO messages (session_id, role, content, tokens_used) VALUES (?, ?, ?, ?)',
      [session_id, 'assistant', aiContent, response.usage?.total_tokens || 0]
    );

    // Return payload to React Native Frontend
    res.json({ reply: aiContent });

  } catch (error) {
    console.error('Error in handling chat via Groq:', error);
    res.status(500).json({ error: 'Failed to process chat' });
  }
}

module.exports = {
  handleChat
};
