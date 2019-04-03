#!/usr/bin/env node
// Converts a TextMate Plist into a VSCode JSON file

const plist = require('fast-plist');
const fs = require('fs');
const path = require('path');

const root_dir = path.join(__dirname, '..');

const grammar = path.join(root_dir, 'syntax-highlighter/dist/textmate/storyscript.tmbundle/Syntaxes/Storyscript.tmLanguage');
const grammarJSON = path.join(root_dir, 'syntaxes', 'story.tmLanguage.json');

console.log(`Reading: ${grammar}`);

const input = fs.readFileSync(grammar, 'utf8');
const result = plist.parse(input);

// fixup the TextMate plist
result.scopeName = 'source.story';

console.log(`Writing: ${grammarJSON}`);
const text = JSON.stringify(result, null, 2);
fs.writeFileSync(grammarJSON, text);
