// pages/api/structure.js
import fs from 'fs';
import path from 'path';
import process from 'process';

export default function handler(req, res) {
    const filePath = path.join(process.cwd(), 'examples', 'structure.example.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');

    // Parse the file contents to JSON
    const data = JSON.parse(fileContents);

    // Send the data as a response
    res.status(200).json(data);
}
