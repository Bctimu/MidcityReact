import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const firebaseConfig = {
  apiKey: "AIzaSyCP_EHp-NdHnwyOZ49_OOEiqLUBV2irgeg",
  authDomain: "admin-17c3d.firebaseapp.com",
  projectId: "admin-17c3d",
  storageBucket: "admin-17c3d.appspot.com",
  messagingSenderId: "456331474186",
  appId: "1:456331474186:web:0385a740d37862f82af6f3",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function parseCSV(content) {
  const lines = content.split('\n').filter((line) => line.trim());
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map((h) => h.trim());
  const records = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const values = [];
    let current = '';
    let inQuotes = false;
    let inBraces = 0;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"' && inBraces === 0) {
        inQuotes = !inQuotes;
      } else if (char === '{') {
        inBraces++;
        current += char;
      } else if (char === '}') {
        inBraces--;
        current += char;
      } else if (char === ',' && !inQuotes && inBraces === 0) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const record = {};
    headers.forEach((header, idx) => {
      record[header] = values[idx] || '';
    });
    records.push(record);
  }

  return records;
}

function extractImageUrl(imageData) {
  if (!imageData) return '';
  const urlMatch = imageData.match(/'url'\s*:\s*'([^']+)'/);
  const filenameMatch = imageData.match(/'filename'\s*:\s*'([^']+)'/);
  return {
    hash: urlMatch ? urlMatch[1] : '',
    filename: filenameMatch ? filenameMatch[1] : '',
  };
}

async function main() {
  console.log('Importing Stay data...');

  const csvPath = resolve(__dirname, '..', 'data', 'Stay__2_.csv');
  const content = readFileSync(csvPath, 'utf-8');
  const records = parseCSV(content);

  console.log(`Found ${records.length} records`);

  for (const record of records) {
    const imageInfo = extractImageUrl(record['New Property']);
    const name = record.Name || '';
    const discount = record['Discount Amount'] || '';

    if (!name) continue;

    const doc = {
      name: name.trim(),
      description: '',
      discount: discount.trim(),
      image: imageInfo.hash || '',
      imageFilename: imageInfo.filename || '',
    };

    await addDoc(collection(db, 'stay'), doc);
    console.log(`  Added: ${doc.name} - ${doc.discount}`);
  }

  console.log('Done importing stay!');
  process.exit(0);
}

main();
