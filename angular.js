/**
 * Created by Mad Martigan on 3/14/2016.
 */
angular.module("sgtApp",[])

    .service("studentService", function(){
        //this.submitBtn = $('#add-student-btn');
        //this.sgtTableElement = $('#student-table');
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
            studentScope.addStudentToArray(studentSnapShot);
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
    });

    studentService.firebaseRef.on('child_removed', function (snapshot) {

    });

    studentService.firebaseRef.on("child_changed", function (studentSnapShot) {
       studentScope.updateDOM(studentSnapShot);
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
    this.addStudentToArray = function(students){
        var student = students.val();
        student.id = students.key();
        studentService.updateList(student);
    };
    this.updateDOM = function(data){
        //console.log(students);
        //var student = students.val();
        //student.id = students.key();
        //studentService.updateList(student);
        studentService.students = [];
        studentService.firebaseRef.on("value", function(snapshot) {
            var studentData = snapshot.val();

            for (var i in  studentData){
                console.log(i);

                studentData[i].id = i.key();
                studentService.updateList(studentData[i]);
            }
            studentScope.students = studentService.students;

        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });

        console.log(studentScope.students);
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
    };

    this.deleteClicked = function(data, rowId){
        studentService.students.splice(rowId,1);
        var studentFirebaseRef = studentService.firebaseRef.child(data);
        studentFirebaseRef.remove();
    };

    this.editMenu = function(data){
        console.log(data);
        var studentFirebaseRef = studentService.firebaseRef.child(data);

        studentFirebaseRef.once('value', function (snapshot) {
            $('#modal-edit-name').val(snapshot.val().name);
            $('#modal-edit-course').val(snapshot.val().course);
            $('#modal-edit-grade').val(snapshot.val().grade);

            $('#student-id').val(data);

            console.log("$('#student-id').val(student_id) : ", $('#student-id').val(data));

            $("#edit-modal").modal("show");
        });

    };

    this.studentEdit = function() {
        console.log("changed!");
        var newName = $('#modal-edit-name').val(),
            newCourse = $('#modal-edit-course').val(),
            newGrade = $('#modal-edit-grade').val(),
            studentFirebaseRef =  studentService.firebaseRef.child($('#edit-modal').find('#student-id').val());
        console.log('student updated', 'newName: ', newName, 'newCourse: ', newCourse, 'newGrade: ', newGrade);
        // using the correct method, send the new student values to firebase to be updated
        studentFirebaseRef.update({
            name: newName,
            course: newCourse,
            grade: newGrade
        });
        $("#edit-modal").modal("hide");
    }
    })

    .directive("editDirective", function(){
        return{
            restrict: "E",
            templateUrl: "edit.html",
            scope: true

        }
    });