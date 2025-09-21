# Google Cloud Text-to-Speech API Setup

This document outlines the steps required to set up and configure the Google Cloud Text-to-Speech (TTS) API for the LinguaAI application. This API is used to provide high-quality, natural-sounding speech synthesis, including advanced features like Arabic vowel (diacritics) support.

## 1. Get a Google Cloud Project and Enable the API

1. **Go to Google Cloud Console**: Open your web browser and navigate to the [Google Cloud Console](https://console.cloud.google.com/).

2. **Select or Create a Project**:
   - If you have an existing project, select it from the project dropdown at the top of the page.
   - If you don't have a project, click "Create Project" and follow the prompts to create a new one.

3. **Enable the Text-to-Speech API**:
   - In the Google Cloud Console, use the navigation menu (☰) to go to **APIs & Services > Library**.
   - Search for "Cloud Text-to-Speech API".
   - Click on the "Cloud Text-to-Speech API" result.
   - Click the "Enable" button.

## 2. Create an API Key

1. **Navigate to Credentials**: After enabling the API, go to **APIs & Services > Credentials** in the Google Cloud Console.

2. **Create Credentials**: Click on "+ CREATE CREDENTIALS" at the top of the page and select "API key".

3. **Copy API Key**: A new API key will be generated. Copy this key. **Keep this key secure and do not expose it publicly in your client-side code.**

4. **(Optional but Recommended) Restrict API Key**:
   - Click "EDIT API KEY" next to your newly created key.
   - Under "API restrictions", select "Restrict key".
   - Choose "Cloud Text-to-Speech API" from the dropdown to ensure this key can only be used for the TTS service.
   - Under "Application restrictions", you can choose "HTTP referrers (web sites)" and add your application's domain (e.g., `http://localhost:3000/*` for local development, and your production domain). This adds an extra layer of security.
   - Click "Save".

## 3. Configure the Application

The application uses environment variables to securely store the Google TTS API key.

1. **Create a `.env` file**: In the root directory of your project (where `package.json` is located), create a new file named `.env`.

2. **Add your API Key**: Add the following line to your `.env` file, replacing `your_api_key_here` with the API key you copied from the Google Cloud Console:

   ```env
   REACT_APP_GOOGLE_TTS_API_KEY=your_api_key_here
   ```

   *Note: For security reasons, ensure that your `.env` file is included in your `.gitignore` to prevent it from being committed to version control.*

## 4. Run the Application

With the API key configured, the application should now be able to use the Google Cloud Text-to-Speech service.

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Application**:
   ```bash
   npm start
   ```

The application will now attempt to use Google TTS for speech synthesis. If the API key is missing or invalid, it will gracefully fall back to the browser's native Web Speech API.

## 5. Features Enabled by Google TTS

With Google TTS properly configured, you'll have access to:

- **High-Quality Speech Synthesis**: Natural-sounding voices for all supported languages
- **Arabic Vowel Support**: Proper pronunciation of Arabic text with diacritics (vowels)
- **Multi-Language Support**: Optimized voices for English, Arabic, Dutch, Indonesian, Malay, Thai, and Khmer
- **Voice Selection**: Access to Google's neural and wavenet voices
- **Pronunciation Coach**: Enhanced pronunciation practice with accurate audio feedback
- **Quiz Audio**: High-quality audio for listening comprehension questions

## 6. Troubleshooting

### Common Issues:

1. **"Google TTS API Key not found"**: Ensure your `.env` file is in the correct location and contains the API key.

2. **"TTS API error: 403"**: Check that the Text-to-Speech API is enabled in your Google Cloud project.

3. **"TTS API error: 400"**: Verify that your API key is correct and has the proper permissions.

4. **Audio not playing**: Check your browser's audio settings and ensure the application has permission to play audio.

### Fallback Behavior:

If Google TTS is not available or fails, the application will automatically fall back to the browser's Web Speech API. While this provides basic functionality, it may not have the same quality or Arabic vowel support as Google TTS.

## 7. Cost Considerations

Google Cloud Text-to-Speech API has a free tier that includes:
- 1 million characters per month for free
- After the free tier, pricing is based on the number of characters processed

For most language learning applications, the free tier should be sufficient for development and testing. Monitor your usage in the Google Cloud Console to avoid unexpected charges.

## 8. Security Best Practices

1. **Never commit API keys to version control**
2. **Use environment variables for sensitive data**
3. **Restrict API keys to specific services and domains**
4. **Regularly rotate API keys**
5. **Monitor API usage for unusual activity**

## Support

If you encounter any issues with the Google TTS integration, please check:
1. The Google Cloud Console for API status and billing
2. The browser console for error messages
3. The application's fallback behavior with Web Speech API

For additional help, refer to the [Google Cloud Text-to-Speech documentation](https://cloud.google.com/text-to-speech/docs).
