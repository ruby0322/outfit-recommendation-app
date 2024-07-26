# Outfit Recommendation App

## Introduction
The Outfit Recommendation App enhances the shopping experience by providing personalized outfit suggestions based on the user’s uploaded clothing photos and personal data. Leveraging advanced algorithms, this software analyzes users' style, body measurements, and preferences, offering suitable outfit recommendations for various occasions.

## Features
- **Photo Upload**: Users can upload photos of their clothing items (e.g., pants, skirts).
- **Outfit Recommendations**: The system recommends matching tops or bottoms based on the uploaded photos.
- **User Profiles**: Users can register, log in, and edit their profiles.
- **Outfit History**: Users can view past outfit combinations and save their favorites.
- **Feedback**: Users can provide feedback on the recommendations to improve the system.

## Tech Stack
- **Frontend**: Next.js,  Tailwind CSS, ShadCN
- **Backend**: Next.js
- **Database**: Supabase
- **Authentication**: OAuth
- **Testing**: Playwright
- **Version Control**: Git Flow
- **Deployment**: Vercel

## Core Technology
Our software utilizes advanced language models to analyze and recommend outfits based on user-uploaded photos. Here’s a brief overview of how it works:

1. **Image Analysis**: When a user uploads a photo of a clothing item, the image is processed using computer vision techniques to extract features such as color, texture, and style.

2. **Feature Extraction**: The extracted features are fed into a pre-trained language model which has been fine-tuned on fashion-related data. This model understands the context and style of the clothing item.

3. **Recommendation Engine**: Based on the analyzed features, the language model suggests matching clothing items. The recommendations are generated by considering fashion trends, user preferences, and compatibility of styles.

4. **Feedback Loop**: Users can provide feedback on the recommendations, which is used to fine-tune the model and improve future suggestions.

## Getting Started
Follow these steps to set up the project locally:

1. **Clone the repository**:
    ```sh
    git clone git@github.com:rmmfj/outfit-recommendation-app.git
    cd outfit-recommendation-app
    ```

2. **Install dependencies**:
    ```sh
    yarn
    ```

3. **Set up environment variables**:
    Create a `.env.local` file in the root directory and add your environment variables.
    ```env
    DATABASE_URL=your_database_url
    NEXT_PUBLIC_API_KEY=your_api_key
    ```

4. **Run the development server**:
   ```sh
   yarn dev
   ```

5. **Open your browser**:
    Navigate to [http://localhost:3000](http://localhost:3000) to see the app in action.

## Directory Structure

```
/public
├── images
├── icons
/src
├── /app
│ ├── page.tsx (Home page)
│ ├── /upload
│ │ └── page.tsx (Upload photo page)
│ ├── /recommendation
│ │ └── page.tsx (Recommendation page)
│ ├── /register
│ │ └── page.tsx (User registration page)
│ ├── /login
│ │ └── page.tsx (User login page)
│ ├── /profile
│ │ └── page.tsx (User profile page)
│ ├── /history
│ │ └── page.tsx (Outfit history page)
│ └── /feedback
│ └── page.tsx (User feedback page)
├── /components
├── /styles
│ ├── globals.css
│ └── tailwind.css
├── /context
│ ├── auth-context.tsx
│ └── recommendation-context.tsx
├── /store
│ └── use-auth-store.ts (Zustand)
├── /hooks
│ ├── use-auth.ts
│ └── use-recommendations.ts
└── /utils
│ ├── /supabase
│ └── openai.ts
├── tailwind.config.js
├── next.config.js
├── tsconfig.json
├── package.json
└── README.md
```