/**
 * Define all global variables here
 */
/**
 * student_array - global array to hold student objects
 * @type {Array}
 */

var student_array = [];


/*var student_array = [{name: 'Jim', course: 'Accounting', grade: '50', deleted: false},
    {name: 'Bob', course: 'Biology', grade: '65', deleted: false},
    {name: 'Greg', course: 'Calculus', grade: '90', deleted: false},
    {name: 'Mike', course: 'Engineering', grade: '78', deleted: false},
    {name: 'Stephanie', course: 'Finance', grade: '75', deleted: false},
    {name: 'Melanie', course: 'Finance', grade: '86', deleted: false}
];*/


//var responseObj;

/**
 * inputIds - id's of the elements that are used to add students
 * @type {string[]}
 */
var inputIds = ['studentName', 'course', 'studentGrade'];

//Timer initially set to null for keyup checking.
/*var keyUpTimer = null;

var courseList = {};*/
/**
 * addClicked - Event Handler when user clicks the add button
 */


function addClicked() {

    addStudent();//add student object to student_array
    updateData();
    clearAddStudentForm();
    gradesHighLow();
}

/**
 * cancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 */
function cancelClicked() {
    clearAddStudentForm();
}

/**
 * loadClicked - Event Handler when user clicks the load button, should load data from server
 */
function loadClicked() {
    $.ajax({
        dataType:'json',
        url: 'http://s-apis.learningfuze.com/sgt/get',
        method: 'post',
        data: {
            api_key: 'L91wptvUmZ'
        },
        success: function(response) {
            console.log(response);
            //responseObj = response;
            //console.log(student_array.length);

            //parse response for individual student objects to process them
            for (var i = 0; i < response.data.length; i++)
            {
                addStudent(true, response.data[i]);
                //console.log(student_array.length);
            }
            //after updating student_array, update display of students
            updateData();
        }
    });
    clearAddStudentForm();
}




/**
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 * @param - OPTIONAL - passes student object to function, uses that instead of input from fields
 *      - if nothing is passed to function, uses input from fields
 * @return undefined
 */

function addStudent(fromServer, new_student)//called by addClicked
{

    //if not passed an object
    if (new_student === undefined)
    {
        fromServer = false;
        //make new student object
        var new_student = {
            name: $('#' + inputIds[0]).val(),//Making a new object with values from display input
            course: $('#' + inputIds[1]).val(), grade: $('#' + inputIds[2]).val(), deleted:false,
        };
    }
    //if passed an object
    else
    {
        //console.log(new_student);
        //just adds property deleted with value false to object, passes on
        new_student['deleted'] = false;
        //console.log(new_student);
    }

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
        if(!fromServer) {
            serverAddStudent(new_student);
        }
    }
}

/*function addCourseName(course){
 courseList[course] =1;
 }*/

/**
 * removeStudent  - removes a student object from global student array
 * based on the data-index of the clicked 'delete' button
 * @param row of button clicked passed as jquery object, i.e. $(this)
 */

function removeStudent(studentObj) {
    student_array[student_array.indexOf(studentObj)].deleted = true;
    console.log(studentObj.id);
    //serverDeleteStudent(studentObj.id);
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
    var deletedEntries = 0;
    //if nothing in array, return 0
    if (student_array.length > 0) {
        var scores = 0;

        for (var i = 0; i < student_array.length; i++) {
            //if valid entry, add to total
            if (student_array[i].deleted == false) {
                scores += Number(student_array[i].grade);
            }
            //if not, skip and add to deleted entries count
            else {
                deletedEntries++;
            }
        }
        //if more than 1 valid entry, calculate average
        if (student_array.length > deletedEntries) {
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
        if (student_array[student].deleted) {
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
    var studentRow = $('<tr>');//studentRow is now a table row
    //var studentNameTD = $('<td>').text(studentObj.name);
    var studentNameTD = $('<td>', {
        text: studentObj.name
    });
    var studentCourseTD = $('<td>', {
        text: studentObj.course
    });
    var studentGradeTD = $('<td>', {
        text: studentObj.grade
    });
    var studentButtonTD = $('<td>');
    var delete_button = $('<button>', {
        type: 'button',
        class: 'btn btn-danger',
        text: 'Delete'
    });
    studentObj.element = studentRow;
    delete_button.click(function () {

        serverDeleteRequest(studentObj);



    });
    studentButtonTD.append(delete_button);
    studentRow.append(studentNameTD, studentCourseTD, studentGradeTD, studentButtonTD);
    $('tbody').append(studentRow);
}

/**
 * removeStudent  - removes a student object from global student array
 * based on the data-index of the clicked 'delete' button
 * @param row of button clicked passed as jquery object, i.e. $(this)
 */

function removeStudent(studentObj) {
    student_array[student_array.indexOf(studentObj)].deleted = true;
}

/**
 * serverDeleteRequest - On deleting a student, also request the deletion of the student on the database
 */
function serverDeleteRequest(student) {
    $.ajax({
        dataType:'json',
        url: 'http://s-apis.learningfuze.com/sgt/delete',
        method: 'post',
        data: {
            api_key: 'L91wptvUmZ',
            student_id: student.id
        },
        success: function(response) {
            console.log(response);
            if(response.success == true)
            {
                removeStudent(student);
                $(student.element).remove();
                //$(this).parent().parent().remove();
                updateData();
            }

        }
    });
}

/**
 * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
 */
function reset() {
    student_array = [];
    updateData();
    cancelClicked();
}

//add the ability to highlight the lowest and highest grades
function gradesHighLow() {
    var lowGrade = student_array[0].grade;
    var highGrade = 0;
    var newLow = student_array[0];
    var newHigh = student_array[0];
    for (var i = 0; i < student_array.length; i++) {
        $(student_array[i].element).removeClass("alert-danger alert-success");
        var grade = parseInt(student_array[i].grade);
        if (grade < lowGrade) {
            lowGrade = grade;
            newLow = student_array[i];
        }
        else if (grade > highGrade) {
            highGrade = grade;
            newHigh = student_array[i];
        }
    }
}




    /*var classList = {};


     function courseEntry(a){
     var charTyped = [];

     $('#course').keyup(function(event){
     console.log('key up triggered');

     if (keyUpTimer == null){
     //set the timer
     keyUpTimer = setTimeout(auto_complete,1500);//The id of this timer is stored in keyUpTimer so that you know
     //which timer you are clearing
     } else{

     //clear the timer
     clearTimeout(keyUpTimer);
     //restart the timer
     keyUpTimer = setTimeout(auto_complete,1500);

     }
     })
     }
     function auto_complete(){
     console.log('triggering');

     }

     $(newLow.element).addClass("alert-danger");
     $(newHigh.element).addClass("alert-success");
     console.log("lowest", lowGrade);
     console.log("highest", highGrade);
     }
     =======
     )
     }*/


    /**
     * Listen for the document to load and reset the data to the initial state
     */
    $(document).ready(function () {
        loadClicked();
        updateData();
        //loadClicked();
        //courseEntry();
        //reset();
    });

//
function serverAddStudent(student) {
    $.ajax({
        dataType:'json',
        url: 'http://s-apis.learningfuze.com/sgt/create',
        method: 'post',
        data: {
            api_key: 'L91wptvUmZ',
            name: student.name,
            course: student.course,
            grade: student.grade
        },
        success: function(response) {
            console.log(response);
            student.id = response.new_id;
        },
        error:function(errors){
            console.log(errors);
        }
    });
    }

function forceFail(student) {
    var loading = $("#add");
    $.ajax({
        dataType:'json',
        url: 'http://s-apis.learningfuze.com/sgt/create',
        method: 'post',
        data: {
            api_key: 'L91wptvUmZ',
            "force-failure": "timeout"
        },

        success: function(response) {
            console.log("a success ", response);
           loading.removeClass("active");
        },
        error:function(errors){
            console.log("a fail ", errors);
            loading.removeClass("active");
        }
    });
    loading.addClass("active");

}

function serverDeleteStudent(num) {
    $.ajax({
        dataType:'json',
        url: 'http://s-apis.learningfuze.com/sgt/delete',
        method: 'post',
        data: {
            api_key: 'L91wptvUmZ',
            student_id: num
        },
        success: function(response) {
            console.log(response);
        },
        error:function(errors){
            console.log(errors);
        }

    });
}
//    clearAddStudentForm();
//}