/**
 * Created by Mad Martigan on 3/14/2016.
 */
angular.module("sgtApp",[])

    .service("studentService", function(){
        this.submitBtn = $('#add-student-btn');
        this.sgtTableElement = $('#student-table');
        this.firebaseRef = new Firebase("https://popping-heat-5383.firebaseio.com/students");
        this.students = [];
        this.test = "test valid";
        this.updateList = function(student){
            this.students.push(student);
        };
    })

    .controller("studentCtrl", function(studentService){
        var studentScope = this;
        this.students =  studentService.students;
        this.test = studentService.test;

    studentService.firebaseRef.on("child_added", function (studentSnapShot) {
            studentScope.updateDOM(studentSnapShot);
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
    });
    studentService.firebaseRef.on('child_removed', function (snapshot) {
        /** Remove the element from the DOM */
        console.log('snapshot.key is: ', snapshot.key());
        var rowId = snapshot.key();
        $('#' + rowId).remove();
    });
    this.updateDOM = function(students){
        var student = students.val();
        student.id = students.key();
        studentService.updateList(student);
    };
    this.addStudent = function(){
        var studentName = $('#studentName').val(),
            studentCourse = $('#course').val(),
            studentGrade = $('#studentGrade').val();

        studentService.firebaseRef.push({
            name: studentName,
            course: studentCourse,
            grade: studentGrade
        });

        studentScope.clearInputs();
    };
    this.clearInputs = function(){
        $('#studentName').val("");
        $('#course').val("");
        $('#studentGrade').val("");
    }

    this.deleteClicked = function(data){
        var studentFirebaseRef = studentService.firebaseRef.child(data);
        studentFirebaseRef.remove();
    }

});