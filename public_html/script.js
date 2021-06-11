const databaseURL = 'http://flip3.engr.oregonstate.edu:3247'

function postRoutine()  {
    var req = new XMLHttpRequest();
    var payload = {name: null, reps: null, weight: null, unit: null, date: null};
    payload.name = document.getElementById('name').value;
    if (payload.name == '') {
        return
    }
    payload.reps = document.getElementById('reps').value;
    payload.weight = document.getElementById('weight').value;
    if (document.getElementById('lbs').checked == true){
        payload.unit = document.getElementById('lbs').value;
    } else { 
        payload.unit = document.getElementById('kg').value;
    }
    payload.date = document.getElementById('date').value;
    req.open('POST', databaseURL, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load',function(){
        if(req.status >= 200 && req.status < 400){
          var response = JSON.parse(req.responseText);
          deleteTable()
          makeTable(response)
          disableForms()
        } else {
          console.log("Error in network request: " + req.statusText);
        }});
    req.send(JSON.stringify(payload));
    
    event.preventDefault();

}

const deleteRequest = (dataRow) => {
    rowChildren = dataRow.children
    idCell = rowChildren[0]
    input = idCell.children[0]
    var removeId = input.value

    var req = new XMLHttpRequest();
    var payload = {id:null};
    payload.id = removeId;
    if (payload.id == '') {
        return
    }
    req.open('DELETE', databaseURL, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load',function(){
        if(req.status >= 200 && req.status < 400){
          var response = JSON.parse(req.responseText);
          deleteTable()
          makeTable(response)
          disableForms()
        } else {
          console.log("Error in network request: " + req.statusText);
        }});
    req.send(JSON.stringify(payload));
    
    event.preventDefault();
}   

const updateRequest = (dataRow, target) => {
    enableForms(dataRow)
    target.name = "update"
}


const getData = async () => {
    var req = new XMLHttpRequest();
    req.addEventListener('load',function(){
        if(req.status >= 200 && req.status < 400){
          var response = JSON.parse(req.responseText);
          deleteTable()
          makeTable(response)
        } else {
          console.log("Error in network request: " + req.statusText);
        }});
    req.send(null);
}



const deleteTable = () =>{
    var myobj = document.getElementById('workoutTable')
    if (myobj != null){ 
        myobj.remove()
    }
    else{
        return
    }
}

const makeTable = (allRows) => {
    
    var table = document.createElement('TABLE')
    table.setAttribute("id", "workoutTable");
    document.body.appendChild(table);

    
    table.onclick = function(event) {
        let target = event.target
        if (target.tagName != 'BUTTON') return;

        function deleteRow(dataRow){
            deleteRequest(dataRow)
            dataRow.remove()
            }
        

        function updateRow(dataRow, target){
            updateRequest(dataRow, target)

            
        }

        function updateTable(table_cell) {
            var req = new XMLHttpRequest();
            table_data = table_cell.getElementsByTagName('input')
            var payload = { name: null, reps: null, weight: null, unit: null, date: null, id: null};
            
            payload.name = table_data[1].value;
            if (payload.name == '') {
                return
            }
            payload.reps = table_data[2].value;
            payload.weight = table_data[3].value;
            if (table_data[4].checked == true){
                payload.unit = '1';
            } else { 
                payload.unit = '0';
            }
            payload.date = table_data[6].value;
            payload.id = table_data[0].value;
            req.open('PUT', databaseURL, true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.send(JSON.stringify(payload));
            req.addEventListener('load',function(){
                if(req.status >= 200 && req.status < 400){
                  var response = JSON.parse(req.responseText);
                  deleteTable()
                  makeTable(response)
                  disableForms()
                } else {
                  console.log("Error in network request: " + req.statusText);
                }});
            req.send(JSON.stringify(payload));
            
            event.preventDefault();
            event.preventDefault();
        }
        
        if (target.name == 'delete') {
            table_cell = target.parentElement
            deleteRow(table_cell)
        } else if(target.name == 'update'){
            table_cell = target.parentElement
            updateTable(table_cell)
        }
        else {
            table_cell = target.parentElement
            updateRow(table_cell, target)
            target.innerHTML = 'save'
            target.style.background = 'CornflowerBlue'
        }
    }   

    

    makeHeaderRow(allRows.rows)
    
    for (let i = 0; i < allRows.rows.length; i++){
        makeRow(allRows.rows[i])
        // Add the buttons
    }

}

const makeHeaderRow = (rows) => {

    var headerRow = document.createElement('TR')
    headerRow.setAttribute("id", "headerRow");
    document.getElementById('workoutTable').appendChild(headerRow)


    for (let x in rows[0]) {

        makeHeaderCell(x)

    }
}

const makeRow = (row) => {

    var dataRow = document.createElement('TR')
    document.getElementById('workoutTable').appendChild(dataRow)
    for(var item in row) {
        makeCell(dataRow, item, row[item])
    }
    onUpdate(dataRow)
    onDelete(dataRow)

}

const makeHeaderCell = (data) => {
    if (data == 'id') {
        var headerCell = document.createElement('TH')
        headerCell.setAttribute('type', 'hidden')
    }
    else { 
        var headerCell = document.createElement('TH')
        var headerCellText = document.createTextNode(data)
        headerCell.appendChild(headerCellText)
    }

    document.getElementById('headerRow').appendChild(headerCell)
}
const makeCell = (parent,item, row) => {
    // Create a table data cell

    var dataCell = document.createElement('TD')
    parent.appendChild(dataCell)
    makeInput(dataCell, item, row)
}

const makeInput = (dataCell, type, value) => {

    var new_input = document.createElement('INPUT')
    if (type == 'id'){
        new_input.setAttribute('type', 'hidden')
        new_input.setAttribute('id', 'id')
        new_input.setAttribute('value', parseInt(value))
        dataCell.appendChild(new_input)
    }
    else if (type == 'name'){
        new_input.setAttribute('type', 'text')
        new_input.setAttribute('name', 'name')
        new_input.setAttribute('value', value)
        dataCell.appendChild(new_input)
    }
    else if (type == 'reps' || type == 'weight') {
        if (type == 'reps') {
            new_input.setAttribute('id', 'reps')
        } else {
            new_input.setAttribute('id', 'weight')
        }
        new_input.setAttribute('type', 'number')
        
        new_input.setAttribute('value', value)
        dataCell.appendChild(new_input)
    }
    else if (type == 'date') {
        var d = new Date(value)
        month = '' + (d.getMonth() + 1);
        day = '' + d.getDate();
        year = d.getFullYear();
        
        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) { 
            day = '0' + day;
        }
        
        var formatDate = [year, month, day].join('-');
        new_input.setAttribute('id', 'date')
        new_input.setAttribute('type', 'date')
        new_input.setAttribute('value', formatDate)
        dataCell.appendChild(new_input)
        
    }
    else if (type == 'unit') {
        makeRadioButtons(dataCell, new_input, value)
    }
    
}

const makeRadioButtons = (dataCell, new_input, value) => {
    var new_form = document.createElement("FORM");
    var kg_radio = document.createElement('INPUT');
    var new_input_label = document.createElement("LABEL");
    var kg_radio_label = document.createElement("LABEL");

    new_input_label.appendChild(new_input)
    new_input_label.innerText = "lbs"

    kg_radio_label.appendChild(kg_radio)
    kg_radio_label.innerText = "kg"

    new_input.setAttribute('id', 'lbs')
    kg_radio.setAttribute('id', 'kg')
    new_input.setAttribute('type', 'radio')
    
    kg_radio.setAttribute('type', 'radio')

    new_input.id = 'lbs1'
    new_input.name = 'metric'
    kg_radio.id = 'kg1'
    kg_radio.name = 'metric'
    
    
    if (value == '1'){
       new_input.checked = true;
       
      
    }
    else {
        kg_radio.checked = true;
        
    }
    
    
    new_form.appendChild(new_input)
    new_form.appendChild(new_input_label)
    new_form.appendChild(kg_radio);
    new_form.appendChild(kg_radio_label)
    dataCell.appendChild(new_form)
}

const disableForms = () => {

    var table = document.getElementById("workoutTable");
    var inputs = table.getElementsByTagName('input');
    for (let i = 0; i < inputs.length; i++){
        inputs[i].disabled = true;
    }
}

const enableForms = (dataRow) => {
    rowChildren = dataRow.children;
    for (let i = 0; i < 6; i++){
        input = rowChildren[i].getElementsByTagName('input')
        input[0].disabled = false;
        if (input[1] != undefined) {
            input[1].disabled = false;
        }
    }
}

const onUpdate = (dataRow) => {
    
    var updateButton = document.createElement('BUTTON');
    updateButton.setAttribute('type', 'button');
    updateButton.setAttribute('name', 'edit')
    updateButton.innerHTML = "update"
    

    dataRow.appendChild(updateButton)
}

const onDelete = (dataRow) => {
    
    var deleteButton = document.createElement('BUTTON');
    deleteButton.setAttribute('type', 'button');
    deleteButton.setAttribute('name', 'delete')
    deleteButton.innerHTML = "delete"

    dataRow.appendChild(deleteButton)
}   



(async () => {
    let tableData = await getData();
    makeTable(tableData);
})();

