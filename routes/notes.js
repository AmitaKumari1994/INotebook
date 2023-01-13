const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');

// Route:1 Get all the notes using: GET "/api/auth/getuser". Login required 

router.get('/fetchallnotes', fetchuser, async (req, res) => {

    try {

        const notes = await Note.find({ user: req.user.id })
        res.json(notes)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})

// Route:2 Add a new note using: POST "/api/auth/addnote".Login required

router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description cannot be blank').isLength({ min: 5 })
], async (req, res) => {
    try {



        const { title, description, tag } = req.body;
        // If there are errors return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const note = new Note({
            title, description, tag, user: req.user.id
        })

        const savedNote = await note.save()

        res.json(savedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})

//Router 3: update an existing note using  "POST:api/auth/updatenote" : login required

router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
    const { title, description, tag } = req.body;

    //Create a newNote object

    const newNote = {};

    if (title) { newNote.title = title };
    if (tag) { newNote.tag = tag };
    if (description) { newNote.description = description };

    //Find the node to be updated and update it
    let note = await Note.findById(req.params.id)
    if (!note) { return res.status(404).send("Not found") }

    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not allowed");
    }

    note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
    res.json({ note });

} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
}


})

// Router 4: Delete an existing note using  "DELETE:api/auth/deletenote" : login required

router.delete('/deletenote/:id', fetchuser, async (req, res) => {
try {
    
    //Find the node to be deleted and delete it
    let note = await Note.findById(req.params.id)
    if (!note) { return res.status(404).send("Not found") }

    //Allow deletion only if user owns this node  
    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id)
    res.json({ "Success": "The note has been deleted", note: note });

} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
}


})





module.exports = router;