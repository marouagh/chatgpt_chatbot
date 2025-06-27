import apiKey from './config/open-ai.js';
import readlineSync from 'readline-sync';
import colors from 'colors';

async function main() {
  //  const userName = readlineSync.question('May I have your name ?')
  //  console.log(`Hello ${userName}`);

  console.log(colors.bold.green('Welcome to the chatbot program!'));
  console.log(colors.bold.green('Type "exit" to quit.\n'));

  const chatHistory = [] //store converstaion history

  while (true) {
    const userInput = readlineSync.question(colors.blue('You: '));

    if (userInput.toLowerCase() === 'exit') {
      console.log(colors.cyan('Goodbye! 👋'));
      break;
    }
    try {
        //construct messages by iterating over the history
        const messages = chatHistory.map(([role, content]) => ({role, content}))

        //Add latest user input 
        messages.push({ role: 'user', content: userInput})

      //Call the API with user input
      const response = await fetch(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://openrouter.ai/docs',
            'X-Title': 'Test App',
          },
          body: JSON.stringify({
            model: 'mistralai/mistral-7b-instruct',
            messages: messages,
          }),
        }
      );

      //Get the text/content
      const data = await response.json();

      if (data.choices && data.choices.length > 0) {
        const completionText = data.choices[0].message.content;
        console.log(colors.green('Bot: ') + completionText);

        //Update history with user input and assistant response 
        chatHistory.push(['user', userInput])
        chatHistory.push(['assistant', completionText])

      } else {
        console.error(colors.red('Bot: Aucune réponse.'));
      }

    } catch (error) {
              console.error(colors.red('Erreur: '), error.message);
    }
  }

  
  
}

main();
