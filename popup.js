document.getElementById('submitText').addEventListener('click', async () => {
  const inputText = document.getElementById('inputText').value;
  const output = document.getElementById('output');
  
  if (!inputText.trim()) {
    output.textContent = 'Please enter some text.';
    return;
  }
  
  output.textContent = 'Processing...';
  
  try {
    const response = await fetch('http://localhost:3000/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: inputText })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }
    
    output.textContent = data.answer;
  } catch (error) {
    console.error('Error fetching AI response:', error);
    output.textContent = error.message || 'Error fetching AI response';
    
    if (error.message.includes('quota limits')) {
      output.textContent += ' Please try again later or contact support.';
    }
  }
});