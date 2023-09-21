const add = document.getElementById('add');
const note = document.getElementById('note');
const notes = document.getElementById('notes');
const bussiness = document.getElementById('bussiness');
const personal = document.getElementById('personal');
const empty = document.getElementById('empty');
const url='http://localhost:8000/';


const month = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


// Color according to category
const categoryColor = function(){
    if(bussiness.checked)
        return 'blue';
    else
        return 'green';
}

// Correct the formats
const format = function(num){
    if(num < 10)
        return '0' + num;
    else 
        return '' + num;
}

// Gives date for note
const dateGiver = function(){
    const  date = new Date();
    const ret = (format(date.getHours()+1)) + ':' + format(date.getMinutes()) + ' ' + format(date.getDate()) + '-' + month[date.getMonth()];
    return ret;
}

// Req. to add note and append in local list
const liItem = function(noteValue){
    note.value='';
    note.focus();
    // Req. to add note
    const addUrl = url + 'addnote';
    const  params={
        method:"PATCH",
        headers:{
            "Content-Type":"application/json"
        },
        "body":JSON.stringify({
            category: categoryColor(),
            time: dateGiver(),
            message: noteValue,

        })
    }
    fetch(addUrl,params).then(response=> response.json()).then(data=> console.log(data));
    // Appending it to list
    const li = document.createElement('li');
    li.classList.add('note');
    li.innerHTML= ` <span class="type ${categoryColor()}"></span>
                    <p class="msg">${noteValue}</p>
                   <span class="date">${dateGiver()}</span>
                   <button class="edit">Edit</button>
                   <button class="delete" onclick="deleteme(event)">Delete</button> `;
    notes.append(li);
}

// Checking note value
const addNote = function(event){
    const noteValue = note.value;
    if(noteValue.length === 0)
        window.alert('Enter some text');
    else{
        liItem(noteValue);
    }
}

const deleteme = function(event){
    const element = event.target.parentElement;

    // Getting note Values
    const cat = element.children[0].classList[1];
    const message = element.children[1].innerText;
    const time = element.children[2].innerText;

    // Sending Request
    const dltUrl = url + 'dltnote';
    const params = {
        method:'PATCH',
        headers: {
            'Content-type':'application/json'
        },
        "body": JSON.stringify({
            category: cat,
            time: time,
            message: message
        })
    }
    fetch(dltUrl, params).then(response=>response.json()).then(data=> console.log(data));
    element.remove();
}

// Listening to events
add.addEventListener('click', addNote);
note.addEventListener('keydown', (event)=>{
    if(event.key==='Enter')
    {
        addNote(event);
        event.preventDefault();
    }
});

