/**
 * Define all global variables here
 */
/**
 * student_array - global array to hold student objects
 * @type {Array}
 */
var student_array =[];

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
    clearAddStudentForm();
    updateData();
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
    var new_student = {name: $('#studentName').val(), course: $('#course').val(), grade: $('#studentGrade').val()};
    student_array.push(new_student);
    addStudentToDom(new_student);
    clearAddStudentForm();
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
    var i;
    var scores = 0;
    for (i = 0; i < student_array.length; i++) {
       scores+= Number(student_array[i].grade);
    }
    if (i > 0){return scores/i;}
    else {return 0;}
}

/**
 * updateData - centralized function to update the average and call student list update
 */
function updateData()
{
    var newAvg = calculateAverage();

    $('.avgGrade').text(newAvg);
    updateStudentList();
}

/**
 * updateStudentList - loops through global student array and appends each objects data into the student-list-container > list-body
 */
function updateStudentList() {

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
    inputIds = [];
    updateData();
    cancelClicked();
}

/**
 * Listen for the document to load and reset the data to the initial state
 */$(document).ready(function(){
    reset()
});