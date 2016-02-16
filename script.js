/**
 * Define all global variables here
 */
/**
 * student_array - global array to hold student objects
 * @type {Array}
 */
var student_array = [{name: 'first', course: 'frist', grade: '0'},
    {name: 'second', course: 'secnod', grade: '50'},
    {name: 'third', course: 'thrid', grade: '100'}];

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
 *
 *
 *
 *
 * @return undefined
 */
function addStudent()//called by addClicked
{
    //make new student object
    var new_student = {name: $('#' + inputIds[0]).val(),
            course: $('#' + inputIds[1]).val(), grade: $('#' + inputIds[2]).val()};
    //assume not already present
    var matchNotFound = true;

    for (student in student_array) {
        //if already present, don't put into array
        if (student_array[student].name == new_student.name &&
            student_array[student].course == new_student.course) {
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
    if (student_array.length < 1) {
        return 0;
    }
    else {
        var scores = 0;
        for (var i = 0; i < student_array.length; i++) {
            scores += Number(student_array[i].grade);
        }
        return (scores / student_array.length);
    }
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
    var studentRow = $('<tr>')

    studentRow.append('<td>' + studentObj.name);
    $('tbody tr:last-of-type').append('<td>' + studentObj.course);
    $('tbody tr:last-of-type').append('<td>' + studentObj.grade);
    $('tbody tr:last-of-type').append('<td><button type="button" class="btn btn-danger">Delete</button></td>');
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
    updateStudentList();
});