// // scripts/inject-partials.js
// // Injects header and footer partials into hera/index.html

// const fs = require('fs');
// const path = require('path');

// const heraDir = path.join(__dirname, '..', 'hera');
// const indexPath = path.join(heraDir, 'index.html');
// const partialsDir = path.join(__dirname, '..', 'partials');
// const headerPath = path.join(partialsDir, 'header-hera.html');
// const footerPath = path.join(partialsDir, 'footer-hera.html');

// // Read partials
// const headerContent = fs.readFileSync(headerPath, 'utf8');
// const footerContent = fs.readFileSync(footerPath, 'utf8');

// // Read index.html
// let indexHtml = fs.readFileSync(indexPath, 'utf8');

// // Replace header and footer placeholders
// indexHtml = indexHtml.replace(
//   /<header id="header-hera"><\/header>/,
//   `<header id="header-hera">\n${headerContent}\n</header>`
// );

// indexHtml = indexHtml.replace(
//   /<footer id="footer-hera"><\/footer>/,
//   `<footer id="footer-hera">\n${footerContent}\n</footer>`
// );

// // Write back to index.html
// fs.writeFileSync(indexPath, indexHtml, 'utf8');

// console.log('Header and footer injected successfully.');
