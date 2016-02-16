/**
 * Define all global variables here
 */
/**
 * student_array - global array to hold student objects
 * @type {Array}
 */
var student_array =[{name: 'first', course: 'frist', grade: '0'},
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
function cancelClicked()
{
    clearAddStudentForm();
}

/**
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 *
 * @return undefined
 */
function addStudent()
{
    var new_student = {name: $('#' + inputIds[0]).val(),
            course: $('#' + inputIds[1]).val(), grade: $('#' + inputIds[2]).val()};
    student_array.push(new_student);
    return;
}

/**
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentForm()
{
    $('#studentName').val('');
    $('#course').val('');
    $('#studentGrade').val('');
}

/**
 * calculateAverage - loop through the global student array and calculate average grade and return that value
 * @returns {number}
 */
function calculateAverage() {
    if (student_array.length < 1)
    {
        return 0;
    }
    else
    {
        var scores = 0;
        for (var i = 0; i < student_array.length; i++) {
            scores+= Number(student_array[i].grade);
        }
        return (scores / student_array.length);
    }
}

/**
 * updateData - centralized function to update the average and call student list update
 */
function updateData()
{
    var newAvg = +(calculateAverage()).toFixed(2);

    $('.avgGrade').text(newAvg);
    updateStudentList();
}

/**
 * updateStudentList - loops through global student array and appends each objects data into the student-list-container > list-body
 */
function updateStudentList() {
    //loop through student_array
    for (student in student_array)
    {
        //take name and course

        //loop through displayed rows

        //if name-course pair is already displayed, then doesn't need to be added to display

        //end loop

        //if reaches end and not found, then needs to be added, pass to to addStudentToDom

        //end loop
    }


}

/**
 * addStudentToDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param studentObj
 */
function addStudentToDom(studentObj)
{
    $('tbody').append('<tr>');
    $('tbody tr:last-of-type').append('<td>'+studentObj.name);
    $('tbody tr:last-of-type').append('<td>'+studentObj.course);
    $('tbody tr:last-of-type').append('<td>'+studentObj.grade);
    $('tbody tr:last-of-type').append('<td><button type="button" class="btn btn-danger">Delete</button></td>');
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
 */$(document).ready(function(){
    updateStudentList();
});