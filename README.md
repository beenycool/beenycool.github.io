# GCSE AI Marker

Intelligent grading assistant for GCSE exam preparation.

## Features

- AI-powered marking of GCSE exam responses
- Detailed feedback on exam answers
- Support for multiple subjects and question types
- Responsive design for all devices

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui components
- OpenAI API integration

## Local Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

## Deployment

This project is configured for deployment on GitHub Pages:

```bash
# Build and deploy manually
npm run build
npm run deploy
```

Alternatively, pushing to the main branch will trigger the GitHub Actions workflow that automatically builds and deploys the site.

## Environment Variables

Create a `.env.local` file with your API key:

```
NEXT_PUBLIC_OPENROUTER_API_KEY=your-api-key
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
