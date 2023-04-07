const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    res.json(notes);
  });
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4();
  fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    notes.push(newNote);
    fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(notes), err => {
      if (err) throw err;
      res.json(newNote);
    });
  });
});

app.delete('/api/notes/:id', (req, res) => { // The :id is a URL parameter that can be accessed from req.params object
  const id = req.params.id; // We extract the id from req.params object
  
  const indexToDelete = notes.findIndex(note => note.id === id); // Use findIndex() method to find the index of the note we want to delete by comparing its id with passed-in id
  
  if (indexToDelete !== -1) { // If the index is -1, it means the note doesn't exist
    notes.splice(indexToDelete, 1); // Remove the note from the array using splice() method
    res.status(204).send(); // Send a success status and an empty response body
  } else {
    res.status(404).send(`Note with id ${id} not found`); // Send a 404 error if the note is not found
  }
});



app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
