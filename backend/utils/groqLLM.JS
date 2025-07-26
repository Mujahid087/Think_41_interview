const axios = require('axios');

const groqLLM = async (messageHistory) => {
  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-70b-8192', // or 'mixtral-8x7b-32768'
        messages: messageHistory,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Groq API Error:', error.message);
    return 'Sorry, something went wrong while generating a response.';
  }
};

module.exports = groqLLM;
