# Wedding Website

A modern, elegant single-page wedding website built with semantic HTML, CSS, and vanilla JavaScript. Features quiet luxury design, accessibility compliance, and easy customization through a JSON configuration file.

## 🌟 Features

- **Modern Design**: Quiet luxury aesthetic with airy spacing and elegant typography
- **Fully Responsive**: Mobile-first design that works on all devices
- **Accessible**: WCAG AA compliant with full keyboard navigation and screen reader support
- **Fast Loading**: Optimized performance with lazy loading and minimal JavaScript
- **Easy Customization**: All content managed through a single JSON configuration file
- **Interactive Elements**: Carousels, lightbox gallery, countdown timer, and smooth animations
- **SEO Ready**: Proper meta tags, structured data, and semantic HTML

## 📁 Project Structure

```
JakeAndMarjoWedding/
├── index.html              # Main HTML file
├── config.json             # All wedding content and theme settings
├── css/
│   └── style.css          # Main stylesheet with CSS variables
├── js/
│   └── app.js             # JavaScript functionality
├── images/
│   ├── hero.jpg           # Hero background image (1920x1080 recommended)
│   ├── gallery/           # Photo gallery images
│   │   ├── g1.jpg
│   │   ├── g2.jpg
│   │   ├── g3.jpg
│   │   └── g4.jpg
│   └── attire/            # Attire example images
│       ├── w1.jpg         # Women's attire examples
│       ├── w2.jpg
│       ├── w3.jpg
│       ├── m1.jpg         # Men's attire examples
│       ├── m2.jpg
│       └── m3.jpg
└── README.md              # This documentation
```

## 🚀 Quick Start

1. **Download or clone** this project to your computer
2. **Replace placeholder images** with your actual photos (maintain the same filenames)
3. **Customize** `config.json` with your wedding details
4. **Upload** to any web hosting service (GitHub Pages, Netlify, Vercel, etc.)

## ⚙️ Customization

### Editing Wedding Content

All wedding content is stored in `config.json`. Edit this file to customize:

- **Names and Date**: Update `names`, `dateISO`, and `locationShort`
- **Story**: Modify the `story` field with your love story
- **Schedule**: Edit the `schedule` array with your event timeline
- **Venue Information**: Update `venue` with your ceremony and reception details
- **Gallery**: Update `gallery` array with your photo filenames
- **Attire Guidelines**: Customize `attire` section with your dress code
- **Travel & Accommodations**: Update `travel` with hotel recommendations
- **Registry Links**: Modify `registry` with your actual registry URLs
- **FAQ**: Customize `faq` with your specific questions and answers

### Live Customization Panel

The website includes a built-in customization panel that allows you to:

- Change couple names
- Update wedding date and time
- Modify location
- Adjust primary and secondary colors
- Reset to default settings

Access the panel by clicking the gear icon on the right side of the screen. Changes are saved to your browser's local storage.

### Theme Customization

Colors and styling can be customized in the `theme` section of `config.json`:

```json
{
  "theme": {
    "primary": "#6B7AA1",      // Primary brand color
    "secondary": "#B4C5E4",    // Secondary/accent color
    "bg": "#FAF8F3",           // Background color
    "text": "#1C1C1C",         // Primary text color
    "serif": "'Playfair Display', serif",
    "sans": "'Inter', sans-serif",
    "script": "'Great Vibes', cursive",
    "radius": "16px",          // Border radius
    "shadow": "0 8px 24px rgba(0,0,0,.06)"
  }
}
```

## 📱 Sections Overview

1. **Hero** - Full-screen introduction with names, date, countdown, and CTAs
2. **Story** - Your love story narrative
3. **Schedule** - Event timeline (ceremony, cocktails, reception)
4. **Venue** - Maps and directions for ceremony and reception venues
5. **Gallery** - Photo gallery with lightbox viewer
6. **Travel** - Hotel and transportation recommendations
7. **Attire** - Interactive dress code guide with color palette and example carousels
8. **Registry** - Gift registry links
9. **FAQ** - Frequently asked questions with accordion interface
10. **RSVP** - Contact form with email integration

## 🎨 Adding Images

### Hero Image
- **Filename**: `images/hero.jpg` (fallback)
- **Responsive Options**:
  - **Desktop**: `images/hero-desktop.jpg` (1920x1080px recommended)
  - **Tablet**: `images/hero-tablet.jpg` (1024x768px recommended)  
  - **Mobile**: `images/hero-mobile.jpg` (800x600px recommended)
- **Format**: JPG or PNG
- **Description**: Main background image for the hero section, automatically switches based on screen size

**Configuration Example**:
```json
{
  "heroImage": {
    "desktop": "images/hero-desktop.jpg",
    "tablet": "images/hero-tablet.jpg", 
    "mobile": "images/hero-mobile.jpg",
    "fallback": "images/hero.jpg"
  }
}
```

**Simple Configuration** (single image):
```json
{
  "heroImage": "images/hero.jpg"
}
```

### Gallery Images
- **Location**: `images/gallery/`
- **Filenames**: `g1.jpg`, `g2.jpg`, `g3.jpg`, `g4.jpg` (add more as needed)
- **Recommended Size**: 800x600px or larger
- **Format**: JPG or PNG
- **Note**: Update the `gallery` array in `config.json` if you add more images

### Attire Images
- **Women's Attire**: `images/attire/w1.jpg`, `w2.jpg`, `w3.jpg`
- **Men's Attire**: `images/attire/m1.jpg`, `m2.jpg`, `m3.jpg`
- **Recommended Size**: 400x600px (portrait orientation)
- **Format**: JPG or PNG

## 🌐 Deployment Options

### GitHub Pages (Free)
1. Create a GitHub repository
2. Upload your files
3. Go to Settings > Pages
4. Select source branch (usually `main`)
5. Your site will be available at `https://yourusername.github.io/repository-name`

### Netlify (Free)
1. Create account at [netlify.com](https://netlify.com)
2. Drag and drop your project folder
3. Your site will be automatically deployed with a custom URL
4. Optionally connect a custom domain

### Vercel (Free)
1. Create account at [vercel.com](https://vercel.com)
2. Import your project from GitHub or upload directly
3. Automatic deployment with custom URL

### Traditional Web Hosting
Upload all files to your web hosting provider's public folder (usually `public_html` or `www`).

## 📧 RSVP Setup

The RSVP form can work in two modes:

### Email Integration (Recommended)
1. Set the `rsvpEmail` field in `config.json` to your email address
2. When users submit the form, it will open their default email client with pre-filled content
3. No server-side configuration required

### Fallback Mode
If email integration isn't available, the form will display RSVP details for users to copy and send manually.

### Advanced Integration
For more advanced form handling, consider:
- **Formspree**: Free form handling service
- **Netlify Forms**: Built-in form handling for Netlify sites
- **Google Forms**: Embed a Google Form for responses

## ♿ Accessibility Features

This website is built with accessibility in mind:

- **Semantic HTML**: Proper heading hierarchy and landmark regions
- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Screen Reader Support**: ARIA labels and announcements
- **Focus Management**: Visible focus indicators and logical tab order
- **Color Contrast**: WCAG AA compliant color combinations
- **Reduced Motion**: Respects user's motion preferences
- **Alt Text**: Descriptive alternative text for all images

## 🎯 Performance Optimization

- **Lazy Loading**: Images load only when needed
- **Font Optimization**: Preloaded critical fonts with `font-display: swap`
- **Minimal JavaScript**: Under 15KB of JavaScript (excluding images)
- **CSS Variables**: Efficient theming system
- **Optimized Images**: Recommended sizes and formats for fast loading

## 🔧 Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (last 2 versions)
- **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- **Graceful Degradation**: Basic functionality works in older browsers

## 🎨 Design Inspiration

This website draws inspiration from:
- Quiet luxury design principles
- Modern editorial layouts
- Accessible design patterns
- Mobile-first responsive design

## 📝 Customization Tips

### Changing Colors
Use the built-in customization panel or edit the `theme` section in `config.json`. Colors should be in hex format (e.g., `#6B7AA1`).

### Adding More Gallery Images
1. Add images to the `images/gallery/` folder
2. Update the `gallery` array in `config.json` with the new filenames
3. Images will automatically appear in the gallery grid

### Modifying the Schedule
Edit the `schedule` array in `config.json`. Each event should have:
- `title`: Event name
- `time`: Time of the event
- `desc`: Brief description

### Updating Venue Information
The venue section supports ceremony and reception locations. Each venue can have:
- `label`: Venue name and address
- `gmapsQuery`: Search term for Google Maps
- `notes`: Array of additional information
- `directions`: Links to different map applications

## 🆘 Troubleshooting

### Images Not Loading
- Check that image filenames in `config.json` match actual files
- Ensure images are in the correct directories
- Verify image file extensions are lowercase

### Customization Panel Not Working
- Check browser console for JavaScript errors
- Ensure `config.json` is valid JSON (use a JSON validator)
- Clear browser cache and reload

### Email RSVP Not Working
- Verify the `rsvpEmail` field in `config.json` is set correctly
- Some browsers may block automatic email client opening
- Users should have a default email client configured

### Countdown Not Updating
- Ensure `dateISO` in `config.json` is in the correct format: `YYYY-MM-DDTHH:mm:ss+TZ`
- Check that the date is in the future
- Verify timezone offset is correct

## 📄 License

This project is open source and available under the MIT License. Feel free to use it for your own wedding website!

## 💡 Support

For questions or issues:
1. Check this README for common solutions
2. Validate your `config.json` using an online JSON validator
3. Check browser developer console for error messages
4. Ensure all image files are properly named and located

---

**Congratulations on your upcoming wedding! 🎉**

This website template is designed to make sharing your special day as beautiful and seamless as possible. Customize it to reflect your unique style and love story.