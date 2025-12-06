const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const saveBtn = document.getElementById('save-btn');
const textArea = document.getElementById('text-area');
const notesList = document.getElementById('notes-list');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = true;
recognition.lang = 'en-US';

recognition.onresult = function(event) {
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    textArea.value += transcript + ' ';
};

startBtn.addEventListener('click', function() {
    recognition.start();
});

stopBtn.addEventListener('click', function() {
    recognition.stop();
});

function loadNotes() {
    const savedNotes = localStorage.getItem('myNotes');
    notesList.innerHTML = '';
    
    if (savedNotes) {
        const notesArray = JSON.parse(savedNotes);
        
        for (let i = 0; i < notesArray.length; i++) {
            createNoteElement(notesArray[i]);
        }
    }
}

function createNoteElement(text) {
    const li = document.createElement('li');
    li.textContent = text;

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.classList.add('delete-btn');
    
    li.appendChild(delBtn);
    notesList.appendChild(li);
}

saveBtn.addEventListener('click', function() {
    const noteText = textArea.value;

    if (noteText) {
        createNoteElement(noteText);
        
        let existingNotes = localStorage.getItem('myNotes');
        let notesArray = [];

        if (existingNotes) {
            notesArray = JSON.parse(existingNotes);
        }

        notesArray.push(noteText);
        localStorage.setItem('myNotes', JSON.stringify(notesArray));
        
        textArea.value = '';
    }
});

notesList.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-btn')) {
        const li = event.target.parentElement;
        const textToDelete = li.firstChild.textContent;
        
        li.remove();

        const existingNotes = localStorage.getItem('myNotes');
        if (existingNotes) {
            let notesArray = JSON.parse(existingNotes);
            
            const index = notesArray.indexOf(textToDelete);
            if (index > -1) {
                notesArray.splice(index, 1);
            }

            localStorage.setItem('myNotes', JSON.stringify(notesArray));
        }
    }
});

loadNotes();