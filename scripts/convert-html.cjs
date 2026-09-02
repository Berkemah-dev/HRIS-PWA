const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const sourceDir = path.join(__dirname, '../template_source');
const outputDir = path.join(__dirname, '../src/pages');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function toCamelCase(str) {
  return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}

function convertHtmlToJsx(html) {
  // Very basic HTML to JSX conversion
  let jsx = html;
  
  // Replace class with className
  jsx = jsx.replace(/class=/g, 'className=');
  // Replace for with htmlFor
  jsx = jsx.replace(/for=/g, 'htmlFor=');
  // Replace HTML comments
  jsx = jsx.replace(/<!--/g, '{/*').replace(/-->/g, '*/}');
  // Self close common tags
  jsx = jsx.replace(/<img([^>]*[^\/])>/g, '<img$1 />');
  jsx = jsx.replace(/<input([^>]*[^\/])>/g, '<input$1 />');
  jsx = jsx.replace(/<br>/g, '<br />');
  jsx = jsx.replace(/<hr>/g, '<hr />');
  // Remove inline styles (too complex to convert safely with regex)
  jsx = jsx.replace(/style="[^"]*"/g, '');

  return jsx;
}

const folders = fs.readdirSync(sourceDir);

let appRoutes = [];

folders.forEach(folder => {
  const htmlPath = path.join(sourceDir, folder, 'code.html');
  if (fs.existsSync(htmlPath)) {
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    const $ = cheerio.load(htmlContent);
    
    // Extract the main content (usually inside <main> or <body>)
    let mainContent = $('main').html() || $('body').html();
    
    if (mainContent) {
      const jsxContent = convertHtmlToJsx(mainContent);
      const componentName = toCamelCase(folder);
      
      const fileContent = `
import React from 'react';

export default function ${componentName}() {
  return (
    <div className="w-full flex flex-col h-full overflow-y-auto">
      ${jsxContent}
    </div>
  );
}
`;
      const outPath = path.join(outputDir, `${componentName}.tsx`);
      fs.writeFileSync(outPath, fileContent.trim());
      console.log(`Converted ${folder} -> ${componentName}.tsx`);
      
      appRoutes.push({ path: `/${folder.replace(/_/g, '-')}`, component: componentName });
    }
  }
});

// Delete template_source
fs.rmSync(sourceDir, { recursive: true, force: true });
console.log('Deleted template_source directory.');

// Generate App.tsx routing
let imports = appRoutes.map(r => `import ${r.component} from './pages/${r.component}';`).join('\n');
let routes = appRoutes.map(r => `          <Route path="${r.path}" element={<${r.component} />} />`).join('\n');

const appContent = `
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MobileLayout from './layouts/MobileLayout';
${imports}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MobileLayout />}>
${routes}
          <Route path="/" element={<Navigate to="/presensi-harian" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
`;

fs.writeFileSync(path.join(__dirname, '../src/App.tsx'), appContent.trim());
console.log('Updated App.tsx with all routes.');
