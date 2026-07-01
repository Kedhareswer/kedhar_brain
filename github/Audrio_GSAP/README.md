> 📦 [Kedhareswer/Audrio_GSAP](https://github.com/Kedhareswer/Audrio_GSAP) · ⭐ 0 · TypeScript · updated 2025-10-01  
> _README.md mirrored from branch `master` on 2026-06-02._

---

# Audira Headphones - Next.js

A premium headphone website built with Next.js 14, TypeScript, Tailwind CSS, and GSAP animations.

## 🚀 Features

- **Modern Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **GSAP Animations** with ScrollTrigger and ScrollSmoother
- **Responsive Design**
- **Optimized Performance**
- **Component-Based Architecture**

## 📁 Project Structure

```
audira-nextjs/
├── app/
│   ├── layout.tsx       # Root layout with fonts
│   ├── page.tsx         # Main page component
│   └── globals.css      # Global styles
├── components/
│   ├── Header.tsx       # Navigation header
│   ├── Footer.tsx       # Footer with social links
│   ├── Section1.tsx     # Hero section
│   ├── Section2.tsx     # Features section
│   ├── Section3.tsx     # Masterbeat section
│   ├── Section4.tsx     # Image gallery
│   ├── Section5.tsx     # Products section
│   └── Section6.tsx     # Pure Escape section
├── hooks/
│   └── useGSAPAnimations.ts  # GSAP animations logic
└── public/
    └── images/          # All images and assets
```

## 🛠️ Setup Instructions

### 1. Copy Assets

Copy all images and videos from the original project to `public/images/`:

```
public/images/
├── logo.png
├── brown.png
├── green.png
├── black.png
├── img1.jpeg
├── img2.jpeg
├── img3.jpeg
├── img4.jpg
├── fb.png
├── insta.png
└── video.mp4
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Dependencies

### Core Dependencies
- **next**: ^14.2.0
- **react**: ^18.3.0
- **react-dom**: ^18.3.0
- **gsap**: ^3.13.0

### Dev Dependencies
- **typescript**: ^5.3.3
- **tailwindcss**: ^3.4.1
- **@types/react**: ^18.3.0
- **@types/node**: ^20.11.0

## 🎨 Key Features Explained

### GSAP Animations

The project uses GSAP's premium plugins:
- **ScrollTrigger**: For scroll-based animations
- **ScrollSmoother**: For smooth scrolling experience
- **SplitText**: For character-level text animations

All animations are encapsulated in the `useGSAPAnimations` hook for clean separation of concerns.

### Component Architecture

Each section is a separate React component, making the code:
- Easy to maintain
- Reusable
- Type-safe with TypeScript
- Simple to test

### Responsive Design

- Uses Tailwind CSS for responsive utilities
- Custom CSS variables for theming
- Mobile-friendly breakpoints
- Viewport-based sizing (vw, vh)

## 🚀 Build for Production

```bash
npm run build
npm start
```

## 📝 Environment Variables

No environment variables required for basic setup.

## 🎯 Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 💡 Tips

1. **GSAP Club Plugins**: The project uses GSAP's premium plugins (ScrollSmoother, SplitText). You'll need a GreenSock Club membership or use the trial version for development.

2. **Performance**: The animations are optimized with `will-change` and `transform` properties for smooth 60fps animations.

3. **Customization**: All colors and fonts are defined in Tailwind config and can be easily customized.

## 📄 License

This project is for educational purposes.

## 🙏 Credits

- Original design inspiration from Audira tutorial
- GSAP by GreenSock
- Next.js by Vercel
- Fonts from Google Fonts (DM Sans, Outfit)

---

Built with ❤️ using Next.js
