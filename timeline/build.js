import fs from 'fs';
import path from 'path';

const checkFile = filename => {
  const filePath = path.resolve(filename);
  if (!fs.existsSync(filePath)) {
    console.error(`Error: ${filename} does NOT exist!`);
    process.exit(1);
  }
  console.log(`${filename} exists.`);
  return filePath;
};

const timelinePath = checkFile('timeline.json');
const templatePath = checkFile('template.html');
const outputPath = path.resolve('index.html');

const timelineData = JSON.parse(fs.readFileSync(timelinePath, 'utf-8'));
const template = fs.readFileSync(templatePath, 'utf-8');

function generateTimelineHtml(data) {
  return data.map(item => {
    const details = (item.month || item.event) ? `
      <div class="details">
        ${item.month ? `<h2>${item.month}</h2>` : ''}
        ${item.event ? `<h3>${item.event}</h3>` : ''}
      </div>` : '';

    return `
      <div class="year-marker">
        <h1>${item.year}</h1>
        ${details}
      </div>
    `;
  }).join('\n');
}

console.log('Generating timeline HTML...');
const timelineHtml = generateTimelineHtml(timelineData);

const outputHtml = template.replace('<!-- TIMELINE_CONTENT -->', timelineHtml);

fs.writeFileSync(outputPath, outputHtml, 'utf-8');
console.log(`Build complete written to ${outputPath}`);
