const fetch = require('node-fetch');

const translateText = async (text, targetLang) => {
    const params = new URLSearchParams();
    params.append('auth_key', '068a0763-d0bf-81d5-a339-ae5b2da16909:fx');
    params.append('text', text);
    params.append('target_lang', targetLang);
  
    const response = await fetch('https://api-free.deepl.com/v2/translate?' + params.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });
  
    if (response.ok) {
      const data = await response.json();
      if (data.translations && data.translations.length > 0) {
        return data.translations[0].text;
      }
    } else {
      console.error('Error with translation:', await response.text());
    }
  
    return null;
  };

module.exports = {
  translateText,
};
