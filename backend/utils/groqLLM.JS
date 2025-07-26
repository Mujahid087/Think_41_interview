const axios = require('axios');

const groqLLM = async (messageHistory) => {
  try {
    // Debug: Log the API key (first few characters only)
    const apiKey = process.env.GROQ_API_KEY;
    console.log('🔑 API Key exists:', !!apiKey);
    console.log('🔑 API Key preview:', apiKey ? `${apiKey.substring(0, 8)}...` : 'NOT SET');
    
    // Debug: Log message history
    console.log('📝 Message History:', JSON.stringify(messageHistory, null, 2));

    if (!apiKey) {
      console.error('❌ GROQ_API_KEY is not set in environment variables');
      return 'Configuration error: API key not found.';
    }

    // Validate message history format
    if (!Array.isArray(messageHistory) || messageHistory.length === 0) {
      console.error('❌ Invalid message history format');
      return 'Invalid message format.';
    }

    // Ensure all messages have required fields
    const validatedMessages = messageHistory.map(msg => ({
      role: msg.role || 'user',
      content: msg.content?.toString() || ''
    })).filter(msg => msg.content.trim() !== '');

    if (validatedMessages.length === 0) {
      console.error('❌ No valid messages found');
      return 'No valid messages to process.';
    }

    console.log('🚀 Making Groq API call...');
    console.log('📊 Request payload:', {
      model: 'llama3-70b-8192',
      messages: validatedMessages,
      temperature: 0.7,
      max_tokens: 1000 // Add max tokens limit
    });

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-70b-8192', // Try different models if this doesn't work
        messages: validatedMessages,
        temperature: 0.7,
        max_tokens: 1000,
        stream: false
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000 // 30 second timeout
      }
    );

    console.log('✅ Groq API Response Status:', response.status);
    console.log('📦 Groq API Response Data:', JSON.stringify(response.data, null, 2));

    // Check if response has the expected structure
    if (!response.data || !response.data.choices || response.data.choices.length === 0) {
      console.error('❌ Invalid response structure from Groq API');
      console.log('🔍 Full response:', response.data);
      return 'Invalid response from AI service.';
    }

    const messageContent = response.data.choices[0]?.message?.content;
    
    if (!messageContent) {
      console.error('❌ No message content in response');
      console.log('🔍 Choice data:', response.data.choices[0]);
      return 'Empty response from AI service.';
    }

    const trimmedContent = messageContent.trim();
    console.log('✅ AI Response:', trimmedContent);
    
    return trimmedContent || 'I apologize, but I couldn\'t generate a proper response.';

  } catch (error) {
    console.error('❌ Groq API Error Details:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    
    if (error.response) {
      // Server responded with error status
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
      console.error('Response headers:', error.response.headers);
      
      // Handle specific error cases
      switch (error.response.status) {
        case 401:
          return 'Authentication failed. Please check your API key.';
        case 429:
          return 'Rate limit exceeded. Please try again later.';
        case 500:
          return 'Groq service is temporarily unavailable.';
        default:
          return `API error (${error.response.status}): ${error.response.data?.error?.message || 'Unknown error'}`;
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Request details:', error.request);
      return 'Network error: Could not reach AI service.';
    } else {
      // Something else happened
      console.error('Setup error:', error.message);
      return 'Configuration error occurred.';
    }
  }
};

module.exports = groqLLM;
