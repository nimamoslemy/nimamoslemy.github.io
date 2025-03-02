# Academic Personal Website

A responsive personal academic website template designed to be hosted on GitHub Pages. This template is perfect for researchers, academics, and professionals who want to showcase their CV, publications, and projects.

## Features

- Responsive design that works on all devices
- Clean and modern UI with smooth animations
- Sections for:
  - About Me
  - CV/Resume
  - Publications
  - Research Projects
  - Contact Information
- Publication filtering system
- Mobile-friendly navigation
- Contact form (requires backend implementation for actual functionality)
- Social media integration

## How to Use

### 1. Fork or Clone this Repository

Start by forking this repository to your GitHub account or cloning it to your local machine.

### 2. Enable GitHub Pages

1. Go to your repository settings
2. Scroll down to the GitHub Pages section
3. Select the main branch as the source
4. Click Save

Your website will be published at `https://yourusername.github.io/repository-name/`

### 3. Customize the Content

#### Basic Information

Edit the `index.html` file to update:

- Your name, title, and institution
- About me section
- CV/Resume details
- Publications
- Research projects
- Contact information

#### Profile and Project Images

1. Replace the placeholder images in the `images` folder with your own:
   - `profile.jpg` - Your profile picture
   - `hero-bg.jpg` - Background image for the hero section
   - `project1.jpg`, `project2.jpg`, etc. - Images for your projects

#### CV/Resume PDF

1. Add your CV/Resume PDF to the `files` folder
2. Update the link in the CV section of `index.html`

#### Colors and Styling

To change the color scheme, edit the CSS variables in the `:root` section of `css/styles.css`:

```css
:root {
    --primary-color: #2c3e50;
    --secondary-color: #3498db;
    --accent-color: #e74c3c;
    /* other variables */
}
```

### 4. Testing Locally

To test your website locally before publishing:

1. Open the `index.html` file in your web browser
2. Or use a local server:
   - With Python: `python -m http.server`
   - With Node.js: `npx serve`

## Folder Structure

```
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # CSS styles
├── js/
│   └── main.js         # JavaScript functionality
├── images/             # Image files
│   ├── profile.jpg
│   ├── hero-bg.jpg
│   └── project*.jpg
├── files/              # PDFs and other documents
│   └── your_cv.pdf
└── README.md           # This file
```

## Customization Tips

### Adding New Sections

To add a new section:

1. Create a new section in `index.html` following the existing pattern
2. Add corresponding styles in `styles.css`
3. Update the navigation menu in `index.html`

### Changing Fonts

The template uses Google Fonts. To change fonts:

1. Select new fonts from [Google Fonts](https://fonts.google.com/)
2. Update the link in the `<head>` section of `index.html`
3. Update the font variables in `styles.css`:
   ```css
   :root {
       --font-primary: 'Your-Font', sans-serif;
       --font-heading: 'Your-Heading-Font', serif;
   }
   ```

### Adding More Projects or Publications

Follow the existing HTML structure to add more projects or publications:

```html
<div class="project-card">
    <!-- Copy and modify this structure -->
</div>
```

or

```html
<div class="publication-item" data-category="journal">
    <!-- Copy and modify this structure -->
</div>
```

## Contact Form

The contact form in this template is for demonstration purposes only. To make it functional, you'll need to:

1. Set up a backend service to handle form submissions
2. Update the form action in `index.html`
3. Modify the form submission code in `main.js`

Options for form backends include:
- [Formspree](https://formspree.io/)
- [Netlify Forms](https://www.netlify.com/products/forms/) (if hosting on Netlify)
- Your own custom backend

## License

This template is free to use for personal and commercial projects. Attribution is appreciated but not required.

## Credits

- [Font Awesome](https://fontawesome.com/) for icons
- [Google Fonts](https://fonts.google.com/) for fonts
- [Unsplash](https://unsplash.com/) for placeholder images

---

Happy customizing! If you have any questions or suggestions, feel free to open an issue or submit a pull request. 