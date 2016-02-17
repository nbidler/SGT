/**
 * Define all global variables here
 */
/**
 * student_array - global array to hold student objects
 * @type {Array}
 */
var student_array = [{name: 'first', course: 'frist', grade: '0', deleted:false},
    {name: 'second', course: 'secnod', grade: '50', deleted:false},
    {name: 'third', course: 'thrid', grade: '100', deleted:false},
    {name: 'four', course: 'fore', grade: '25', deleted:false},
    {name: 'fifth', course: 'fiff', grade: '75', deleted:false}];
//var student_array = {
//    0: {name: 'first', course: 'frist', grade: '0'},
//    1: {name: 'second', course: 'secnod', grade: '50'},
//    2: {name: 'third', course: 'thrid', grade: '100'},
//    3: {name: '4third', course: 'thrid', grade: '100'},
//    4: {name: '5third', course: 'thrid', grade: '100'}
//}
/**
 * inputIds - id's of the elements that are used to add students
 * @type {string[]}
 */
var inputIds = ['studentName', 'course', 'studentGrade'];

/**
 * addClicked - Event Handler when user clicks the add button
 */
function addClicked() {

    addStudent();//add student object to student_array
    updateData();
    clearAddStudentForm();
}

/**
 * cancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 */
function cancelClicked() {
    clearAddStudentForm();
}


/**
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 * @return undefined
 */

function addStudent()//called by addClicked
{
    //make new student object
    var new_student = {
        name: $('#' + inputIds[0]).val(),//Making a new object with values from display input
        course: $('#' + inputIds[1]).val(), grade: $('#' + inputIds[2]).val(), deleted:false
    };
    //assume not already present
    var matchNotFound = true;
    for (student in student_array) {
        //if already present, don't put into array
        if (student_array[student].name == new_student.name &&
            student_array[student].course == new_student.course &&
            student_array[student].deleted == false) {
            matchNotFound = false;
            break;
        }
    }
    //if not present, add to array
    if (matchNotFound) {
        student_array.push(new_student);
    }
    return;
}

/**
 * removeStudent  - removes a student object from global student array
 * based on the data-index of the clicked 'delete' button
 * @param row of button clicked passed as jquery object, i.e. $(this)
 */

function removeStudent(delButton)
{
    //store target index of pressed delete button
    var targetIndex = delButton.find('button').attr("data-index");
    student_array.splice(targetIndex, 1);
}

/**
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentForm() {
    $('#studentName').val('');
    $('#course').val('');
    $('#studentGrade').val('');
}

/**
 * calculateAverage - loop through the global student array and calculate average grade and return that value
 * @returns {number}
 */
function calculateAverage() {
    var deletedEntries=0;
    //if nothing in array, return 0
    if (student_array.length > 0)
    {
        var scores = 0;

        for (var i = 0; i < student_array.length; i++)
        {
            //if valid entry, add to total
            if (student_array[i].deleted == false)
            {
                scores += Number(student_array[i].grade);
            }
            //if not, skip and add to deleted entries count
            else
            {
                deletedEntries++;
            }
        }
        //if more than 1 valid entry, calculate average
        if (student_array.length > deletedEntries)
        {
            return (scores / (student_array.length - deletedEntries));
        }
    }
    //if array length <1 OR no un-deleted entries
    return 0;
}

/**
 * updateData - centralized function to update the average and call student list update
 */
function updateData() {
    var newAvg = +(calculateAverage()).toFixed(2);
    $('.avgGrade').text(newAvg);
    updateStudentList();
}

/**
 * updateStudentList - loops through global student array and appends each objects data into the student-list-container > list-body
 */
function updateStudentList() {
    var currentName;
    var currentCourse;

    for (student in student_array) {//loop through student_array
        //if entry deleted, skip to next
        if(student_array[student].deleted){
            continue;
        }
        //take name and course
        currentName = student_array[student].name;
        currentCourse = student_array[student].course;
        //assumes entry is not already displayed
        var matchNotFound = true;
        //Gives us how many rows are currently displayed
        var currentRows = $('tr').length;
        //Except for table head, loop through displayed rows
        for (var i = 0; i < currentRows; i++) {
            var row = $('tr:nth-of-type(' + (i + 1) + ')');// targeting current row, creating a string withinn nth of type
            //parentheses
            //Row td first-of-type is the same as currentName and Row td nth-of-type(2) is the same as currentCourse
            //then the entry is already there, and set match not found to false.  Break.
            //if name-course pair is already displayed, then doesn't need to be added to display
            if (
                (row.find('td:first-of-type').text() == currentName) &&//finds the first td inside the row
                (row.find('td:nth-of-type(2)').text() == currentCourse))//finds the second td inside the row

            {
                matchNotFound = false;
                break;
            }

        }

        if (matchNotFound) {//match not found is equal to true
            addStudentToDom(student_array[student]);//adds the new student array object
        }
    }
}

/**
 * addStudentToDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param studentObj
 */
function addStudentToDom(studentObj)//meant to add one student to the DOM, one object in the array
// is passed into this function
{
    var existingRows = $('tbody tr').length;//stores number of rows currently existing
    var studentRow = $('<tr>');//studentRow is now a table row
    //var studentNameTD = $('<td>').text(studentObj.name);
    var studentNameTD = $('<td>',{
        text: studentObj.name
    });
    var studentCourseTD = $('<td>',{
        text: studentObj.course
        });
    var studentGradeTD = $('<td>',{
        text: studentObj.grade
    });
    var studentButtonTD = $('<td>');
    var delete_button = $('<button>',{
        type: 'button',
        class: 'btn btn-danger',
        'data-index':existingRows,
        text: 'Delete'
    });
    delete_button.click(function(){
        console.log('i was clicked',studentRow,studentObj);
        //var the_row = student_array.indexOf(studentObj);
        console.log('I am in row: ',existingRows);
        //delete student_array[existingRows];//Could be used if we want to have one item in the array as undefined
        //in the index
        student_array[student_array.indexOf(studentObj)].deleted=true;
        $(this).parent().parent().remove();
        updateData();
    });
    studentButtonTD.append(delete_button);
    studentRow.append(studentNameTD, studentCourseTD, studentGradeTD, studentButtonTD);
    $('tbody').append(studentRow);
}

/**
 * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
 */
function reset() {
    student_array = [];
    updateData();
    cancelClicked();
}

/**
 * Listen for the document to load and reset the data to the initial state
 */$(document).ready(function () {
    updateData();
    //reset();
});

