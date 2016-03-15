/**
 * Created by Mad Martigan on 3/14/2016.
 */
angular.module("sgtApp", [])

    .service("firebaseService", function () {

        var fireServScope = this;
        this.firebaseRef = new Firebase("https://popping-heat-5383.firebaseio.com/students");
        this.students = [];
        this.test = "test valid";

        this.updateList = function (student) {
            this.students.push(student);
        };

        this.addStudentToArray = function (students) {
            var student = students.val();
            student.id = students.key();
            this.students.push(student);
            //firebaseService.updateList(student);
        };

        this.addFireData = function (callback) {
            var studentName = $('#studentName').val(),
                studentCourse = $('#course').val(),
                studentGrade = $('#studentGrade').val();

            this.firebaseRef.push({
                name: studentName,
                course: studentCourse,
                grade: studentGrade
            });
            callback();
        };

        this.deleteFireData = function (data, rowId) {
            console.log(data, rowId);
            this.students.splice(rowId, 1);
            var studentFirebaseRef = this.firebaseRef.child(data);
            studentFirebaseRef.remove();
        };
        this.updateDOM = function (callback) {
            fireServScope.students = [];
            this.firebaseRef.once("value", function (snapshot) {
                var studentData = snapshot.val();
                for (var i in  studentData) {
                    studentData[i].id = i;
                    fireServScope.students.push(studentData[i]);
                }
               callback();

            }, function (errorObject) {
                console.log("The read failed: " + errorObject.code);
            });
        };
    })

    .controller("fireCtrl", function (firebaseService) {
        var fireBaseRef = firebaseService.firebaseRef;
        var fireScope = this;
        this.fireStudents = firebaseService.students;

        fireBaseRef.on("child_added", function (studentSnapShot) {

            firebaseService.addStudentToArray(studentSnapShot);
        }, function (errorObject) {

        });
        fireBaseRef.on('child_removed', function (snapshot) {

        });
        fireBaseRef.on("child_changed", function (studentSnapShot) {

            firebaseService.updateDOM(function(){
                fireScope.fireStudents = [];
                fireScope.fireStudents = firebaseService.students;
            });
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });

        this.deleteClicked = function (data, rowId) {
            firebaseService.deleteFireData(data, rowId);
        };

        this.editMenu = function (key) {

            var studentFirebaseRef = firebaseService.firebaseRef.child(key);

            studentFirebaseRef.once('value', function (snapshot) {
                $('#modal-edit-name').val(snapshot.val().name);
                $('#modal-edit-course').val(snapshot.val().course);
                $('#modal-edit-grade').val(snapshot.val().grade);

                $('#student-id').val(key);

                $("#edit-modal").modal("show");
            });
        };

    })
    .controller("studentCtrl", function (firebaseService, fuzeApi) {
        var studentScope = this;

        this.test = firebaseService.test;

        this.clearInputs = function () {
            $('#studentName').val("");
            $('#course').val("");
            $('#studentGrade').val("");
        };

        this.addStudent = function () {
            firebaseService.addFireData(this.clearInputs);
        };
        this.getLoadStudents = function(){

        };
        this.editStudent = function (){

        };
        this.loadClicked = function(){
            fuzeApi.getData();
        };
    })

    .directive("editDirective", function () {
        return {
            restrict: "E",
            templateUrl: "edit.html",
            scope: true,
            controller: function(firebaseService){
                this.studentEdit = function () {

                    var newName = $('#modal-edit-name').val(),
                        newCourse = $('#modal-edit-course').val(),
                        newGrade = $('#modal-edit-grade').val(),
                        studentFirebaseRef = firebaseService.firebaseRef.child($('#edit-modal').find('#student-id').val());

                    studentFirebaseRef.update({
                        name: newName,
                        course: newCourse,
                        grade: newGrade
                    });
                    $("#edit-modal").modal("hide");
                };
            },
            controllerAs: "se"
        }
    })
    .directive("firebaseDirective", function () {
        return {
            restrict: "E",
            templateUrl: "fireTable.html",
            scope: true,
            controller: "fireCtrl",
            controllerAs: "fc"
        }
    })
    .directive("fuzeApiDirective", function () {
        return {
            restrict: "E",
            templateUrl: "fuzeTable.html",
            scope: true,
            controller: "ioController",
            controllerAs: "ic"
        }
    })
    .provider('fuzeApi', function () {
        //Create a variable to hold this
        var fuzeApiScope = this;
        this.fuzeStudents = [];
        //Create a variable to hold your api key but set it to an empty string
        var api_key = "";
        this.changeApiKey = function (newkey) {
            api_key = newkey;
        };
        //Create a variable to hold the API url but set it to an empty string
        this.api_url = "";
        //Add the necessary services to the function parameter list
        this.$get = function ($http, $q, $log) {
            //return an object that contains a function to call the API and get the student data
            //Refer to the prototype instructions for more help
            return {
                getStudents: function () {
                    console.log(fuzeApiScope.fuzeStudents);
                    var dataString = $.param({api_key: api_key});

                    return $http({
                        method: "POST",
                        url: fuzeApiScope.api_url,
                        data: dataString,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    })
                        .then(function (response) {
                                return response.data;
                            },
                            function (error) {
                                return error;
                            });
                },

                createStudent: function () {

                    var dataString = $.param({
                        api_key: "L91wptvUmZ",
                        name: $('#studentName').val(),
                        course: $('#course').val(),
                        grade: $('#studentGrade').val()
                    });

                    return $http({
                        method: "POST",
                        url: "http://s-apis.learningfuze.com/sgt/create",
                        data: dataString,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    })
                        .then(function (response) {
                                return response.data;
                            },
                            function (error) {
                                return error;
                            });
                },
                deleteStudent: function (idNum) {
                    console.log(idNum);
                    var dataString = $.param({api_key: "L91wptvUmZ", student_id: idNum});

                    var defer = $q.defer();
                    //console.log(dataString);
                    //return $http and it's response to avoid defer usage
                    return $http({
                        method: "POST",
                        url: "http://s-apis.learningfuze.com/sgt/delete",
                        data: dataString,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    })
                        .then(function (response) {
                                return response.data;
                            },
                            function (error) {
                                return error;
                            });
                }
            }
        }
    })

    .config(function (fuzeApiProvider) {
        fuzeApiProvider.changeApiKey("L91wptvUmZ");
        fuzeApiProvider.api_url = "http://s-apis.learningfuze.com/sgt/get"
    })

    //Include your service in the function parameter list along with any other services you may want to use
    .controller('ioController', function (fuzeApi, $log) {
        //Create a variable to hold this, DO NOT use the same name you used in your provider
        var ioScope = this;
        //Add an empty data object to your controller, make sure to call it 'data'
        var fuzeStudents = [];
        this.test = "testing";
        this.addStudent = function () {
            console.log("creatings");
            fuzeApi.createStudent()

                .then(function (response) {

                    ioScope.getData();
                    $log.info(ioScope.data);

                });
        };
        this.deleteClicked = function (id) {
            console.log("delete clicked");
            fuzeApi.deleteStudent(id)
                .then(function(response){
                    if (response.success){
                        ioScope.getData();
                    }
                })
        };
        //Add a function called getData to your controller to call the SGT API
        //Refer to the prototype instructions for more help
        this.getData = function () {
            console.log("getting");
            fuzeApi.getStudents()
                .then(function (response) {
                        ioScope.fuzeStudents = response.data;
                    },
                    function (error) {
                        $log.warn(error);
                    });
        }
    });