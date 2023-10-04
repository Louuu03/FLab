const express = require('express')
const app = express()

let phonebook = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(express.json())

app.use((req, res, next) => {
    // Capture the request start time
    req.startTime = Date.now();
    next();
});

app.get('/api/people', (req, res)=>{
    res.json(phonebook)
})

app.get('/api/person/:id', (req, res)=>{
    const id = Number(req.params.id)
    const person = phonebook.find((item)=>item.id === id)
    console.log(person,!!person)
    !person?res.status(404).end():res.json(person)
})

app.get('/info', (req, res)=>{
    const pplSum = phonebook.length;
    const reqTime = Date(req.startTime)
    res.send(`
        <p>
            Phonebook has info for ${pplSum} people
            <br/>  
            ${reqTime}
        </p>`
    )
})

app.delete('/api/person/delete/:id',(req,res)=>{
    const id = Number(req.params.id)
    const index = phonebook.findIndex(item => item.id === id);

    // If the person is not found, send a 404 Not Found response
    if (index === -1) {
        return res.status(404).json({ error: 'Person not found' });
    }
       // Create a new array excluding the person with the given id
       const updatedPhonebook = phonebook.filter(item => item.id !== id);

       // Update the ids of the remaining persons in the phonebook
       const updatedPhonebookWithCorrectIds = updatedPhonebook.map((item, index) => ({
           ...item,
           id: index + 1
       }));
   
       // Update the phonebook array with the modified data
       phonebook = updatedPhonebookWithCorrectIds;
   
   
    res.status(204).end()
})

const PORT = 3001
app.listen(PORT)
