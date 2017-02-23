var app = angular
        .module("iMiles_Module",["textAngular","ngRoute","mgcrea.ngStrap","ngSanitize","ngCookies","ngclipboard"])
        .directive('ckEditor', function() {
          return {
            require: '?ngModel',
            link: function(scope, elm, attr, ngModel) {
              var ck = CKEDITOR.replace(elm[0]);
              

              if (!ngModel) return;

              CKEDITOR.editorConfig = function( config ) {
                    config.pasteFromWordRemoveFontStyles=false;
                    config.pasteFromWordRemoveStyles=false;
                    config.allowedContent=true; 
                };

              ck.on('pasteState', function() {
                scope.$apply(function() {
                  ngModel.$setViewValue(ck.getData());
                });
              });

              ngModel.$render = function(value) {
                ck.setData(ngModel.$viewValue);
              };
            }
          };
        })
        .factory('userService',function($http) {

            userService = {};

            userService.model = {
                userName : undefined,
                active : false,
                isAdmin : false
            };
            return {

                logIn : function() {

                    $http.get(user_info_API)
                    .success(function(data,status,headers,config) {
                    
                        userService.model.isAdmin = data.is_superuser;
                        console.log("isAdminfrom factory"+userService.model.isAdmin);

                    });

                    userService.model.userName = "rahulrk1991";
                    userService.model.active = true;
                    return userService.model;
                },
                logOut : function() {
                    userService.model.userName = undefined;
                    userService.model.active = false;
                    return userService.model;
                },
                returnState : function() {
                    return userService.model;
                }
            }

        })
        .config(function ($routeProvider,$locationProvider) {
            $routeProvider
            .when("/", {
                templateUrl: absolute_path+"LandingPage/landing_page.html",
                controller:"landingPageController"
            })
            .when("/ResumeBuilder", {
                templateUrl: absolute_path+"ResumeBuilder/resume_builder.html",
                controller:"controllerGeneralInfoToDisplayData"
            })
            .when("/QnACrunch", {
                templateUrl: absolute_path+"QnACrunch/DisplayQuestion/qnacrunch.html",
                controller:"questionsController"
            })
            .when("/MarkForLater", {
                templateUrl: absolute_path+"MarkLater/markLater.html",
                controller:"markedForLaterController"
            })
            .when("/OnlineMockTests/TakeATest/:id", {
                templateUrl: absolute_path+"OnlineMockTests/take_a_test.html",
                controller:"onlineMockTestsTakeATestController"
            })
            .when("/OnlineMockTests/ChooseATest", {
                templateUrl: absolute_path+"OnlineMockTests/choose_a_test.html",
                controller:"onlineMockTestsChooseTestController"
            })
            .when("/EditQuestion/:kind/:questionID", {
                templateUrl: absolute_path+"QnACrunch/EditQuestion/edit_question.html",
                controller:"editQuestionsController"
            })
            .when("/ViewQuestion/:kind/:questionID", {
                templateUrl: absolute_path+"QnACrunch/ViewQuestion/view_question.html",
                controller:"viewQuestionsController"
            })
            .when("/PuzzlingPuzzles", {
                templateUrl: absolute_path+"PuzzlingPuzzles/puzzlingPuzzles.html",
                controller:"PuzzlingPuzzlesController"
            })
            .when("/PostQuestion", {
                templateUrl: absolute_path+"PostQuestion/post_question.html",
                controller:"postQuestion"
            })
            .when("/ContactUs", {
                templateUrl: absolute_path+"ContactUs/contactus.html",
                controller:"contactUsController"
            })
            .when("/AboutUs", {
                templateUrl: absolute_path+"AboutUs/aboutus.html",
                controller:"aboutUsController"
            })
            .when("/Profile", {
                templateUrl: absolute_path+"Profile/profile.html",
                controller:"profileController"
            })
            .when("/Statistics", {
                templateUrl: absolute_path+"Statistics/statistics.html",
                controller:"statisticsController"
            })
            .when("/Settings", {
                templateUrl: absolute_path+"Settings/settings.html",
                controller:"settingsController"
            })
            .when("/ResetPassword", {
                templateUrl: absolute_path+"OtherArtifacts/resetPassword.html",
                controller:"OtherArtifactsController"
            })
            .when("/TermsAndConditions", {
                templateUrl: absolute_path+"OtherArtifacts/termsAndConditions.html",
                controller:"OtherArtifactsController"
            })
            .when("/FrequentlyAskedQuestions", {
                templateUrl: absolute_path+"OtherArtifacts/faq.html",
                controller:"OtherArtifactsController"
            })
         })
        .controller("OtherArtifactsController",function($scope){

            $scope.password = {};
            $scope.password.newPassword = "";
            $scope.password.confirmNewPassword = "";

            $scope.message = "Password is too short";
            $scope.isReadyToReset = false;

            $scope.checkIfIdenticalAndReturnClass = function() {
                var newPasswordLocal = $scope.password.newPassword;
                var confirmNewPasswordLocal = $scope.password.confirmNewPassword;
                if(newPasswordLocal.length<8) {
                    $scope.message = "Password is too short";
                    $scope.isReadyToReset = false;
                    return;
                }
                if(newPasswordLocal==confirmNewPasswordLocal) {
                    $scope.message = "Passwords are identical";
                    $scope.isReadyToReset = true;
                }
                else {
                    $scope.message = "Passwords are not identical";
                    $scope.isReadyToReset = false;
                }
            }
        })
        .controller("sideBarController",function(userService,$scope,$rootScope,$timeout,$http) {

            console.log("Entered side bar controller!");

            $rootScope.title="iMiles Menu";
            $scope.userModel = userService.returnState();
            $rootScope.sidebarUserModel = $scope.userModel;

            //Stats that appear in navigation bar
            $rootScope.rootScope_full_name = "";
            $rootScope.rootScope_score = -1;
            $rootScope.rootScope_experience = -1;

            $scope.logout = function() {
                $scope.userModel = userService.logOut();
                $timeout(function() {

                    console.log("Logging out of interviewmile.com!");
                    window.location.href = user_logout_API;
                    $scope.$apply();

                }, 100);
                
            }


            $rootScope.loadUserInfo = function() {

                $scope.Profile = {};

                //Get first name of user
                $http.get(user_info_API)
                    .success(function(data,status,headers,config) {

                        $rootScope.rootScope_full_name = data.first_name;

                    });

                //Get score of user
                $http.get(user_score_API)
                    .success(function(data,status,headers,config) {
                    
                        $rootScope.rootScope_score = data.value*10;

                    });

                //Get experience points of user
                $http.get(user_experience_API)
                    .success(function(data,status,headers,config) {
                    
                        $rootScope.rootScope_experience  = data.value;

                    });

            }


            $rootScope.loadUserInfo();

            var isLoggedIn = function() {
                $http.get(user_isLoggedIn_API)
                    .then(function(response) {
                        if(response.data.result=="yes") {
                            $scope.userModel = userService.logIn();

                            console.log("isAdmin"+$scope.userModel.isAdmin);

                        }
                        else {
                            console.log("Not logged in!");
                        }
                    })
            }

            isLoggedIn();
        })
        .controller("PuzzlingPuzzlesController",function($scope,$http,$sce,userService) {

            //Feed contains array of 10 sets of questions all the questions 
            $scope.feed = {};
            var feedNum = 0;
            var isFetchingQuestions = false;

            $scope.questionIdToAnswerDictionary=[];

            $scope.getColorForDifficulty = function(difficulty_level) {

                if(difficulty_level>=1 && difficulty_level<=3)
                    return "difficulty_1-3";
                else if (difficulty_level>=4 && difficulty_level<=5)
                    return "difficulty_4-5";
                else if (difficulty_level>=6 && difficulty_level<=7)
                    return "difficulty_6-7";
                else
                    return "difficulty_8-10";
            }

            //Function to GET questions
            var getQuestions = function(feedNum) {

                console.log("Feed Number:"+feedNum);

                //Fetching puzzles here
                $http.get(category_enabled_questions_API+PUZZLE_CATEGORY_ID+"?start="+feedNum*10)
                    .success(function(data,status,headers,config) {
                        
                        var allQuestions = data;
                        console.log("Hitting URL:"+config.url);
                        $scope.feed[feedNum] = allQuestions;    //Set of fetch questions get assigned to an index in feed
                        //console.log($scope.feed);

                        $scope.questions = allQuestions;        //Assigning the response data to questions in $scope object
                        
                        //Loop through the questions, and fetch the choices for the MCQs
                        for(var i=0;i<allQuestions.length;i++) {

                            var singleQuestion = allQuestions[i];
                            singleQuestion.isSolved = false;
                            singleQuestion.description = $sce.trustAsHtml(singleQuestion.description);
                            console.log(singleQuestion.difficulty_level);

                            $http.get(post_descriptive_questions_API+singleQuestion.id)
                                .success(function(data,status,headers,config) {
                                    var idOfQuestion = data.id;
                                    //Populate Question ID to Categories Dictionary
                                    $scope.questionIdToAnswerDictionary[idOfQuestion] = data.answer;
                                })

                            isFetchingQuestions = false;
                        }
                });
            
            }

            //Makes first call for questions when controller is executed
            getQuestions(feedNum);

            $scope.displaySolution = function(question) {
                console.log("Solution displayed");
                question.isSolved = !question.isSolved;

            }


            $(window).scroll(function () {
               if ($(window).scrollTop() >= $(document).height() - $(window).height() - 100) {
                    if(!isFetchingQuestions) {
                        feedNum++;
                        console.log("Getting feed number:"+feedNum);
                        isFetchingQuestions=true;
                        getQuestions(feedNum);
                    }     

               }
            });

            //Returning the template file from getQuestonInfo using question 
            $scope.getQuestionTemplateByType = function(question) {
                
                return puzzlingPuzzles_file;

            }

        })
        .controller("settingsController",function($scope,$http) {

            $scope.Profile = {};
            $scope.Profile.id = "";
            $scope.Profile.username = "";
            $scope.Profile.first_name = "";
            $scope.Profile.last_name = "";
            $scope.Profile.email = "";
            $scope.Profile.contact_no = "";


            var loadUserInfo = function() {

                $http.get(user_info_API)
                    .success(function(data,status,headers,config) {
                    
                        $scope.Profile = data;
                        $scope.Profile.new_password = "";
                        $scope.Profile.confirm_new_password = "";
                        console.log($scope.Profile);

                    });

            }

            loadUserInfo();

            $scope.resetForm = function() {
                /*$scope.Profile.first_name = "";
                $scope.Profile.last_name = "";
                $scope.Profile.contact_no = "";
                $scope.Profile.new_password = "";
                $scope.Profile.confirm_new_password = "";*/
            }
            
        })
        .controller("onlineMockTestsChooseTestController",function($scope,$http,$location,$timeout) {

            $scope.mockToBeStarted=-1;
            listOfSolvedMockIds = [];
            mockIDToSolvedMockBody = [];

            $scope.overallScore = 0;
            $scope.overallMaxScore = 0;
            $scope.numberOfTestsGiven = 0;
            $scope.totalNumberOfTests = 0;
            $scope.accuracy = 0;

            // Hiring Test : Set the date we're counting down to
            var countDownDate = new Date("Feb 26, 2017 12:00:00").getTime();

            // Update the count down every 1 second
            var countdown_timer_function = setInterval(function() {

              // Get todays date and time
              var now = new Date().getTime();

              // Find the distance between now an the count down date
              var distance = countDownDate - now;

              // Time calculations for days, hours, minutes and seconds
              var days = Math.floor(distance / (1000 * 60 * 60 * 24));
              var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
              var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
              var seconds = Math.floor((distance % (1000 * 60)) / 1000);

              // Display the result in the element with id="demo"
              document.getElementById("demo").innerHTML = days + "d " + hours + "h "
              + minutes + "m " + seconds + "s ";

              // If the count down is finished, write some text 
              if (distance < 0) {
                clearInterval(x);
                document.getElementById("demo").innerHTML = "EXPIRED";
              }
            }, 1000);

            $scope.$on("$locationChangeStart", function (event, next, current) {
                
                clearInterval(countdown_timer_function);

            });

            var getAllMockTests = function() {

                $http.get(mock_myresults_API)
                    .then(function(response) {
                        $scope.allSolvedMocks = response.data;
                        console.log($scope.allSolvedMocks);
                        $scope.numberOfTestsGiven = $scope.allSolvedMocks.length;
                        for(i=0;i<$scope.allSolvedMocks.length;i++) {
                            listOfSolvedMockIds.push($scope.allSolvedMocks[i].mockId);
                            mockIDToSolvedMockBody[$scope.allSolvedMocks[i].mockId] = $scope.allSolvedMocks[i];

                            $scope.overallScore = $scope.overallScore + $scope.allSolvedMocks[i].score;
                            $scope.overallMaxScore = $scope.overallMaxScore + $scope.allSolvedMocks[i].max_score;
                        }
                        if($scope.overallMaxScore==0) {
                            $scope.accuracy = 0;
                        }
                        else {
                            $scope.accuracy = parseFloat(($scope.overallScore/$scope.overallMaxScore)*100).toFixed(2);
                        }
                        
                        console.log(mockIDToSolvedMockBody);

                        $http.get(mock_allMocks_API)
                            .then(function(response) {
                                $scope.allMocks = response.data;
                                console.log($scope.allMocks);
                                $scope.totalNumberOfTests = $scope.allMocks.length;
                                for(i=0;i<$scope.allMocks.length;i++) {
                                    if($scope.allMocks[i].duration=="30")
                                        $scope.allMocks[i].numberOfQuestions=10;
                                    else
                                        $scope.allMocks[i].numberOfQuestions=15;
                                    if(listOfSolvedMockIds.indexOf($scope.allMocks[i].id)>-1) {
                                        //Unsolved mock
                                        $scope.allMocks[i].score = mockIDToSolvedMockBody[$scope.allMocks[i].id].score;
                                        $scope.allMocks[i].max_score = mockIDToSolvedMockBody[$scope.allMocks[i].id].max_score;
                                    }
                                    else {
                                        //Solved mock

                                    }
                                }
                            })
                    })

                
            }

            getAllMockTests();

            $scope.getMockSummaryPanel = function(mock) {
                //console.log(mock);
                if(listOfSolvedMockIds.indexOf(mock.id)>-1) {
                    return mock_summary_panel_solved;   
                }
                else {
                    return mock_summary_panel_unsolved;
                }
                
            }

            $scope.setMockToBeStarted = function(id) {
                $scope.mockToBeStarted = id;
            }

            $scope.startMockTestWithID = function(mockID) {
                $("#startTheTestModal").modal('hide');

                $('#startTheTestModal').on('hidden.bs.modal', function () {
                    $location.url("/OnlineMockTests/TakeATest/"+$scope.mockToBeStarted);
                    $scope.$apply();
                })
            }

        })
        .controller("onlineMockTestsTakeATestController",function($scope,$alert,$http,$timeout,$routeParams,$modal,$route,userService,$rootScope,$cookies) {

            var cooks = $cookies.get("csrftoken");
            var cooksHeader = { 'X-CSRFToken': cooks };

            $scope.$on("$locationChangeStart", function (event, next, current) {
                
                if (!confirm("Are you sure you want to navigate away from the test? The test will be automatically submitted and you will not be able to give it again")) { 
                    event.preventDefault(); 
                }
                else {
                    $scope.submitTest();
                    $scope.stop();
                }
            });


            $scope.attemptedQuestions=0;
            $scope.totalQuestions;
            $scope.score = 0;
            $scope.maxScore = 0;
            $scope.testName = "";

            //Review Test modal variable
            $scope.title = "Your Time is up!";
            $scope.content = "Click on the below button to get a comprehensive review of your test";


            $(window).scroll(function(){
                $("#testSummaryDiv").css({"top": ($(window).scrollTop()) + "px"});
            });


            $http.get(mock_mock_API+$routeParams.id)
                .then(function(response) {
                    var testInfo = response.data;
                    var durationInMinutes = testInfo.duration;
                    $scope.testName = testInfo.title;
                    $scope.counter = testInfo.duration*60;
                })


            //$scope.counter = 10;
            $scope.onTimeout = function(){
                $scope.counter--;
                $scope.min = parseInt(($scope.counter)/60);
                $scope.sec = ($scope.counter)%60;
                if($scope.min<10)
                    $scope.minStr = "0"+$scope.min.toString();
                else
                    $scope.minStr = $scope.min.toString();
                if($scope.sec<10)
                    $scope.secStr = "0"+$scope.sec.toString();
                else
                    $scope.secStr = $scope.sec.toString();
                if($scope.min==0 && $scope.sec==0) {
                    //var myOtherModal = $modal({scope: $scope, template: 'OnlineMockTests/review_test_modal.html', show: true});
                    $scope.submitTest();
                }
                    

                mytimeout = $timeout($scope.onTimeout,1000);
            }
            var mytimeout = $timeout($scope.onTimeout,1000);

            $scope.stop = function () {
                console.log("stop called");
                $timeout.cancel(mytimeout);
            };


            $scope.isTestSubmitted = false;

            //Get all the question data using http get
            $http.get(mock_mock_API+$routeParams.id+"/start")
                .then(function(response) {
                    var allQuestions = response.data;
                    $scope.questions = allQuestions;            //Assigning the response data to questions in $scope object
                    console.log($scope.questions);
                    var dict = [];                              // dict['question id'] = choice
                    $scope.totalQuestions = allQuestions.length;
                    for(var i=0;i<allQuestions.length;i++) {                //loop through the questions, and get the choices for each
                        var singleQuestion = allQuestions[i];

                        singleQuestion.isSolved = false;
                        singleQuestion.usersChoice = -1;
                        singleQuestion.testId = i+1;


                    }


                    var getAllCategories = function() {
                        //console.log("Got categories");
                        $http.get(question_categories_API)
                            .then(function(response) {
                                                    
                                for(i=0;i<response.data.length;i++) {
                                    $scope.tags.allTagNames[i] = (response.data[i].category_text);
                                    categoryDict[response.data[i].category_text] = response.data[i].id
                                }
                                console.log($scope.tags.allTagNames);
                                console.log(categoryDict);

                            });
                    }

                    getAllCategories();     

                    $scope.updateCategories = function() {
                        var filterString = $scope.tags.filterValue;
                        var lastIndex = filterString.slice(-1);
                        if(filterString==" ") {
                            $scope.tags.filterValue = "";
                            return;
                        }
                        if(lastIndex==' ' && filterString.length>1) {
                            $scope.tags.tagsNamesToAddToQuestion.push(filterString.substring(0,filterString.length-1))
                            console.log($scope.tags.tagsNamesToAddToQuestion);
                            $scope.tags.filterValue = "";
                        }
                    }
            });

            
            $scope.getQuestionTemplateByType = function(question) {
                
                return getQuestionInfo["mcq"].onlineMockTestFragment;         //returning the template file from getQuestonInfo using question 

            }

            
            $scope.validateChoice = function(question,choice,index) {     //returing if the selected choice is the correct choice
                console.log("In validate choice function");

                if($scope.isTestSubmitted)
                    return;

                if(question.isSolved == false) {
                    $scope.attemptedQuestions++;
                    //finalChoices.push(choicebody);
                }

                question.isSolved = true;
                question.usersChoice = choice.id;
                if(question.isSelected==index) {
                    console.log("Clicking same twice");
                    question.isDoneTwice=true;
                    question.isSolved = false;
                }
                question.isSelected = index;
                //console.log(finalChoices);
                //console.log("Is the question solved:"+question.isSolved);
                
            }

            var finalChoices = [];
            $scope.submitTest = function() {
                for(i=0;i<$scope.questions.length;i++) {
                    if($scope.questions[i].isSolved) {
                        var choicebody = {"questionId":$scope.questions[i].pk,
                                    "choiceId":$scope.questions[i].usersChoice};
                        finalChoices.push(choicebody);
                    }
                }
                console.log(finalChoices);


                $http.put(mock_mock_API+$routeParams.id+"/end", finalChoices,{ headers: cooksHeader })
                     .success(function(data,status,header,config) {
                        console.log("Test submitted successfully");        //on successfull posting of question
                        var myAlert = $alert({title: 'Test submitted successfully', content: '', placement:'floater top', type: 'success', show: true,duration:5});
                        $scope.score = data.score;
                        $scope.maxScore = data.max_score;
                        $http.get(mock_mock_API+$routeParams.id+"/solution")
                            .then(function(response) {
                                //var allQuestions = response.data;
                                //$scope.questions.choices = allQuestions.choices;
                                //$scope.isTestSubmitted = true;               
                                for(i=0;i<response.data.length;i++) {
                                    $scope.questions[i].choices = response.data[i].choices;
                                }
                                $scope.isTestSubmitted = true;

                            });
                        $scope.isTestSubmitted = true;
                        })
                     .error(function(response) {
                        console.log("Test could not be submitted");                //in case there is an error
                        var myAlert = $alert({title: 'Test could not be submitted', content: '', placement:'floater top', type: 'danger', show: true,duration:15});

                     });

                $scope.isTestSubmitted = true;
                $("#submitTestModal").modal('hide');
                console.log("Test submitted");
                var myOtherModal = $modal({scope: $scope, template: 'OnlineMockTests/review_test_modal.html', show: false});
            }

            $scope.applyClassToSelectedChoice = function(question,choice,index) {
                
                if(question.isDoneTwice){
                    question.isSelected=-1;
                    question.isSolved = false;
                    question.usersChoice = -1;
                    question.isDoneTwice = false;
                    $scope.attemptedQuestions--;
                }

                if(question.isSelected==index)
                    return "background-grey";
                else
                    return "";
            }

            $scope.applyColors = function(question,choice) {
                if(!$scope.isTestSubmitted)
                    return;
                if(choice.is_correct) {
                    return "choice-green";
                }
                else {
                    return "choice-red"
                }
            }

            $scope.markAttemptedQuestion = function(question) {
                if(question.isSolved)
                    return "background-grey";
                else
                    return;
            }

            //Edit Question
            $scope.editQuestion = function(questionID) {
                alert("Editing Question:"+questionID);
            }
        })
        .controller("landingPageController",function($scope,$aside,$modal,$http,$location,$timeout,userService,$alert,$cookies, $rootScope) {

            $scope.forgot_password={};

                    // Set the date we're counting down to
            var countDownDate = new Date("Feb 26, 2017 12:00:00").getTime();

            // Update the count down every 1 second
            var x = setInterval(function() {

              // Get todays date and time
              var now = new Date().getTime();

              // Find the distance between now an the count down date
              var distance = countDownDate - now;

              // Time calculations for days, hours, minutes and seconds
              var days = Math.floor(distance / (1000 * 60 * 60 * 24));
              var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
              var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
              var seconds = Math.floor((distance % (1000 * 60)) / 1000);

              // Display the result in the element with id="demo"
              document.getElementById("demo").innerHTML = days + "d " + hours + "h "
              + minutes + "m " + seconds + "s ";

              // If the count down is finished, write some text 
              if (distance < 0) {
                clearInterval(x);
                document.getElementById("demo").innerHTML = "EXPIRED";
              }
            }, 1000);

            $scope.$on("$locationChangeStart", function (event, next, current) {
                
                clearInterval(x);

            });

            console.log('entered landingPageController')
            var isLoggedIn = function() {
                $http.get(user_isLoggedIn_API)
                    .then(function(response) {
                        if(response.data.result=="yes") {
                            $scope.userModel = userService.logIn();
                            //$scope.$apply();
                            console.log("isAdmin"+$scope.userModel.isAdmin);
                            $location.url("Profile");
                            //$scope.$apply();
                        }
                        else {
                            console.log("Not logged in!");
                        }
                    })
            }

            isLoggedIn();


            $scope.logout = function() {
                console.log("Starting to execute logout");
                $scope.userModel = userService.logOut();
                $timeout(function() {
                    //$location.url("/");
                    console.log("In logout function");
                    window.location.href = user_logout_API;

                    $scope.$apply();
                }, 100);
                
            }

            $scope.sendResetLink = function() {
                console.log($scope.forgot_password.username);
                console.log($scope.forgot_password.email);


                var cooks = $cookies.get("csrftoken");
                var cooksHeader = { 'X-CSRFToken': cooks };
                url = question_mark_Later_API;

                body =  {"username":$scope.forgot_password.username};
                            //{"email":$scope.forgot_password.email}];

                $http.post( user_forgot_API, body,{ headers: cooksHeader })
                     .success(function(data,status,header,config) {
                            console.log("Reset Link Sent");        //on successfull posting of question
                            
                            var myAlert = $alert({title: "Password reset link sent!", content: "Check your inbox", placement:'floater top', type: 'success', show: true,duration:5});

                        })
                     .error(function(response) {
                        console.log("Error in sending the link");                //in case there is an error
                        var myAlert = $alert({title: 'Password reset link could not be sent!', content: 'Check the logs to know more.', placement:'floater top', type: 'danger', show: true,duration:5});

                     });
            }

            $scope.submitLoginForm = function() {

                console.log($scope.login.email);
                console.log($scope.login.password);

                $http.get(user_token_API)
                    .then(function(response){
                        //console.log(response.data);

                        var tokenHTML = response.data;
                        var token = tokenHTML.split(" ")[3].split("\'")[1];
                        console.log("Token:"+token);
                        //console.log("CSRF Token:"+token);

                        var form = new FormData();
                        form.append("csrfmiddlewaretoken", token); //get this token from above api
                        form.append("username", $scope.login.email); //get this field from user
                        form.append("password", $scope.login.password); //get this field from user

                        /*var cookie = "csrftoken=";
                        cookie = cookie+token;
                        document.cookie = "csrftoken="+token;*/

                        $cookies.put("csrftoken",token);


                        //console.log("Cookie plus token:"+$cookies.get("csrftoken"));

                        var settings = {
                        "async": true,
                        "crossDomain": true,
                        "url": user_login_API,
                        "method": "POST",
                        "headers": {
                        "cache-control": "no-cache"
                        },
                        "processData": false,
                        "contentType": false,
                        "mimeType": "multipart/form-data",
                        "data": form
                        }

                        $.ajax(settings).done(function (response) {
                            var responseString = response.split("\"")[3];
                            console.log("Response string:"+responseString);
                            //console.log(responseString);
                            if(responseString=="success") {
                                console.log("Logged in successfully");
                                $("#signInModalEmail").modal('hide');
                                
                                $alert({title: 'Logged in successfully!', content: '', placement:'floater top', type: 'success', show: true,duration:4});

                                $rootScope.loadUserInfo();

                                $timeout(function() {
                                    //userService.logIn();
                                    //console.log($scope.userModel.active);
                                    $scope.userModel = userService.logIn();
                                    //console.log($scope.userModel.active);
                                    $location.url("OnlineMockTests/ChooseATest");
                                    $scope.$apply();
                                }, 200);
                                
                            }
                            else if (responseString=="Invalid login details") {
                                //$("#signInModalEmail").modal('hide');
                                $alert({title: 'Invalid credentials!', content: '', placement:'floater top', type: 'danger', show: true,duration:4});

                            }
                            else {
                                $("#signInModalEmail").modal('hide');
                                $alert({title: 'There was an error logging you in! Please try again.', content: '', placement:'floater top', type: 'success', show: true,duration:4});

                            }
                        });
                    });
            }

            $scope.validation = {};
            $scope.validation.message = "No error as of now";
            $scope.validation.isValid = false;
            $scope.register={};
            $scope.register.name="";
            $scope.register.username="";
            $scope.register.email="";
            $scope.register.password="";
            $scope.register.confirmpassword="";
            $scope.register.mobile="";


            var validateRegistrationForm = function() {

                    $scope.validation.message = "No error as of now";
                    $scope.validation.isValid = false;

                    ck_name = /^[A-Za-z ]{3,20}$/;
                    if($scope.register.name==undefined || !ck_name.test($scope.register.name)) {
                        $scope.validation.message = "Full Name is invalid";
                        $scope.validation.isValid = true;
                        return false;
                    }

                    ck_username = /^[A-Za-z0-9_]{3,20}$/;
                    if(!ck_username.test($scope.register.username)) {
                        console.log("Inside username validation");
                        $scope.validation.message = "Username is invalid.\nMake sure it is 3-20 characters.\nNo characters other than A-Z,a-z,0-9";
                        $scope.validation.isValid = true;
                        return false;
                    }

                    ck_email = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                    if(!ck_email.test($scope.register.email)) {
                        $scope.validation.message = "Invalid Email ID.\nEnter valid one.";
                        $scope.validation.isValid = true;
                        return false;
                    }

                    ck_password =  /^[A-Za-z0-9!@#$%^&*()_]{6,20}$/;
                    if(!ck_password.test($scope.register.password)) {
                        $scope.validation.message = "Invalid password.\nMake sure it is 6-20 characters.\nDon't user escape characters like /or \\";
                        $scope.validation.isValid = true;
                        return false;
                    }

                    ck_confirmpassword =  /^[A-Za-z0-9!@#$%^&*()_]{6,20}$/;
                    if(!ck_password.test($scope.register.confirmpassword)) {
                        $scope.validation.message = "Invalid password.\nMake sure it is 6-20 characters.\nDon't user escape characters like /or \\";
                        $scope.validation.isValid = true;
                        return false;
                    }

                    //ck_confirmpassword =  /^[A-Za-z0-9!@#$%^&*()_]{6,20}$/;
                    if($scope.register.confirmpassword!=$scope.register.password) {
                        $scope.validation.message = "Passwords you entered donot match";
                        $scope.validation.isValid = true;
                        return false;
                    }

                    if($scope.register.mobile=="") {
                        $scope.register.mobile="9999999999";
                        return true;
                    }

                    ck_phonenumber =  /^[0-9]{10,10}$/
                    if(!ck_phonenumber.test($scope.register.mobile)) {
                        $scope.validation.message = "Mobile number is not valid.\nMake sure it contains exactly 10 digits.\n";
                        $scope.validation.isValid = true;
                        return false;
                    }

                    return true;
                }

            
            $scope.submitRegisterForm = function() {

                $scope.validation.isValid = false;


                console.log($scope.register.name);
                console.log($scope.register.username);
                console.log($scope.register.email);
                console.log($scope.register.password);
                console.log($scope.register.confirmpassword);
                console.log($scope.register.mobile);

                if(!validateRegistrationForm()) {
                    console.log("Form is invalid");
                    return;
                }

                $alert({title: 'Wait!', content: 'Registration in progress...', placement:'floater top', type: 'info', show: true,duration:4});
                $scope.validation.message = "Wait! Registration in progress...";
                $scope.validation.isValid = true;

                $http.get(user_token_API)
                    .then(function(response){
                        console.log(response.data);

                        var tokenHTML = response.data;
                        var token = tokenHTML.split(" ")[3].split("\'")[1];
                        console.log("CSRF Token:"+token);

                        var form = new FormData();
                        form.append("csrfmiddlewaretoken", token); //get this token from above api
                        form.append("full_name", $scope.register.name); //get this field from user
                        form.append("username", $scope.register.username); //get this field from user
                        form.append("email", $scope.register.email);
                        form.append("password", $scope.register.password);
                        form.append("password2", $scope.register.confirmpassword);
                        form.append("contact_no", $scope.register.mobile);

                        document.cookie = "csrftoken="+token;

                        var settings = {
                        "async": true,
                        "crossDomain": true,
                        "url": user_registration_API,
                        "method": "POST",
                        "headers": {
                        "cache-control": "no-cache"
                        },
                        "processData": false,
                        "contentType": false,
                        "mimeType": "multipart/form-data",
                        "data": form
                        }

                        //$scope.validation.isValid = false;
                        $.ajax(settings).done(function (response) {
                            console.log(response);
                            var responseString = response.split("\"")[3];
                            console.log("Response String:"+responseString);
                            if(responseString=="success") {
                                $("#registerModal").modal('hide');
                                $alert({title: 'Registration successful!', content: 'Login using the Sign In button using the username/email and password you provided', placement:'floater top', type: 'success', show: true,duration:10});

                                
                            }
                            else if(responseString=="Duplicate username or email") {
                                //$("#registerModal").modal('hide');
                                //$("#registerModal").modal('show');
                                $scope.validation.message = "The username/email address you provided is already registered. Try another one!";
                                $scope.validation.isValid = true;
                                $alert({title: 'Duplicate username or email, choose another!', content: '', placement:'floater top', type: 'danger', show: true,duration:4});
                                if($scope.register.phone=="999999999") {
                                    $scope.register.phone="";
                                }
                            }
                            else {
                                //$("#registerModal").modal('hide');
                                $alert({title: 'Registration unsuccessful!', content: 'Please try again.', placement:'floater top', type: 'danger', show: true,duration:4});

                            }
                        });
                    });

            }

        })
        .controller("viewQuestionsController",function($scope,$http,$routeParams,$sce,$cookies,$alert,$rootScope) {

            $scope.load_question = getQuestionInfo[$routeParams.kind].viewFragment;
            $scope.question = {};
            $scope.panel={};
            $scope.panel.title = "Click here to view Solution";
            $scope.panel.body = "Answer not retrieved, check JSON object in console for clues";
            

            console.log($routeParams.questionID);
            console.log($routeParams.kind);
            $scope.question = {};
            if($routeParams.kind=="descriptive") {
                url = post_descriptive_questions_API+ $routeParams.questionID;
            }
            else if($routeParams.kind=="mcq") {
                url = post_mcq_Questions_API+ $routeParams.questionID;
            }

            $http.get(url)
            .then(function(response) {
                
                $scope.question = response.data;
                $scope.question.description = $sce.trustAsHtml($scope.question.description);
                $scope.question.answer = $sce.trustAsHtml($scope.question.answer);
                console.log($scope.question);
                console.log($scope.question.pk);
                $scope.panel.body=$scope.question.answer;
                $scope.question.isSolved = false;
                $scope.question.isSelected = -1;

               /* for(i=0;i<$scope.question.choices.length;i++) {
                    $scope.question.choices[i].is_correct = false;
                }*/

            });

            $scope.validateChoice = function(question,choice,index) {
                console.log(question);
                console.log(choice);
                console.log(index);
                
                if(question.isSolved)
                    return;

                var cooks = $cookies.get("csrftoken");
                var cooksHeader = { 'X-CSRFToken': cooks };

                postBody = {"choiceId":choice.id};
                $http.post(post_mcq_Questions_API+$routeParams.questionID+"/solve",postBody,{ headers: cooksHeader })
                    .success(function(data,status,header,config) {
                            console.log("Solved Question!");        //on successfull posting of question
                            console.log(data.value);
                            //console.log($scope.questionIdToChoicesDictionary[question.id]);
                            for(i=0;i<$scope.question.choices.length;i++) {
                                if($scope.question.choices[i].id==data.value){
                                    $scope.question.choices[i].is_correct = true;
                                    if(choice.id==data.value) {
                                        $rootScope.rootScope_score = $rootScope.rootScope_score+10;
                                        var myAlert = $alert({title: "Question "+question.id+" solved correctly!", content: "You scored 10 points", placement:'floater top', type: 'success', show: true,duration:4});
                            
                                    }
                                    else {
                                        var myAlert = $alert({title: "The option you chose to question "+question.id+" was incorrect!", content: "You scored 0 points", placement:'floater top', type: 'danger', show: true,duration:4});
                            
                                    }
                                }
                                else {
                                    $scope.question.choices[i]["is_correct"] = false;
                                }
                                //console.log($scope.questionIdToChoicesDictionary[question.id][i]);
                            }
                            $scope.question.isSolved = true;
                            $scope.question.isSelected = index;
                            console.log($scope.question);
                        })
                     .error(function(response) {
                        console.log("Error:Question could not be marked for later");                //in case there is an error
                        var myAlert = $alert({title: 'Error:Question could not be marked for later!', content: 'Check the logs to know more.', placement:'floater top', type: 'danger', show: true,duration:5});

                     });
                /*if(question.isSolved)
                    return;
                question.isSolved = true;
                question.isSelected = index;*/
            }

            $scope.markForLater = function(question) {
                console.log("Mark "+$scope.question.pk+" for later");

                var cooks = $cookies.get("csrftoken");
                var cooksHeader = { 'X-CSRFToken': cooks };
                url = question_mark_Later_API;
                body =  [$scope.question.pk];
                $http.post( url, body,{ headers: cooksHeader })
                     .success(function(data,status,header,config) {
                            console.log("Question marked for later");        //on successfull posting of question
                            
                            var myAlert = $alert({title: "Question "+$scope.question.pk+" saved to favorites list!", content: "", placement:'floater top', type: 'success', show: true,duration:5});

                        })
                     .error(function(response) {
                        console.log("Error:Question could not saved to favorites list!");                //in case there is an error
                        var myAlert = $alert({title: 'Error:Question could not be marked for later!', content: 'Check the logs to know more.',placement:'floater top', type: 'danger', show: true,duration:5});

                     });

            }

            $scope.getChoiceStructure = function() {
                return absolute_path+"QnACrunch/ViewQuestion/MCQTemplate/ChoiceTemplate/choice_structure.html"
            }

            $scope.applyClassToSelectedChoice = function(choice,index) {
                if(!$scope.question.isSolved)
                    return;
                //console.log(question);
                if($scope.question.isSelected==index)
                    return "background-grey";
            }

            //Change color of the choice option to indicate correctness
            $scope.applyColors = function(question,choice) {
                if(!$scope.question.isSolved)
                    return;
                if(choice.is_correct) {
                    return "choice-green";
                }
                else {
                    return "choice-red";
                }
            }

            $scope.getColorForDifficulty = function(difficulty_level) {
                //console.log(difficulty_level);
                if(difficulty_level>=1 && difficulty_level<=3)
                    return "difficulty_1-3";
                else if (difficulty_level>=4 && difficulty_level<=5)
                    return "difficulty_4-5";
                else if (difficulty_level>=6 && difficulty_level<=7)
                    return "difficulty_6-7";
                else
                    return "difficulty_8-10";
            }

        })
        .controller("editQuestionsController",function($scope,$http,$routeParams,$location,$alert,$cookies) {
            var url;
            $scope.choices = {};
            console.log($routeParams.questionID);
            console.log($routeParams.kind);

            var cooks = $cookies.get("csrftoken");
            var cooksHeader = { 'X-CSRFToken': cooks };

            //Scope variables needed for adding tags
            $scope.tags = {};
            $scope.tags.filterValue = "";                   //Value obtained from autocomplete search bar
            $scope.tags.allTagNames = [];                   //Stores name of all tags, used as model for autocomplete search bar
            $scope.tags.tagsNamesToAddToQuestion = [];      //Array which stores the names of the tags to associate with Q
            $scope.tags.tagsToDissociate = [];

            categoryDict = [];      //Used for mapping category name to category id

            var getAllCategories = function() {
                
                $http.get(question_categories_API)
                    .then(function(response) {
                                            
                        for(i=0;i<response.data.length;i++) {
                            $scope.tags.allTagNames[i] = (response.data[i].category_text);
                            categoryDict[response.data[i].category_text] = response.data[i].id      //Creating a dictionary with key as category name and value as categroy id
                        }

                        console.log("All tag names:"+$scope.tags.allTagNames);
                        console.log(categoryDict);

                    });
            }

            var getCategoriesAssociatedWithQuestion = function() {
                $http.get(questions_API+"/"+$routeParams.questionID+"/category")
                    .then(function(response){
                        for(i=0;i<response.data.length;i++) {
                            $scope.tags.tagsNamesToAddToQuestion[i] = (response.data[i].category_text);
                            $scope.tags.tagsToDissociate[i] = (response.data[i].id);
                            //categoryDict[response.data[i].category_text] = response.data[i].id      //Creating a dictionary with key as category name and value as categroy id
                        }
                    });
            }

            $scope.changeTagsAssociatedWithQuestion = function() {
                var j=0;
                if($scope.tags.tagsToDissociate.length==0) {
                    associateNewTags();
                    return;
                }
                for(i=0;i<$scope.tags.tagsToDissociate.length;i++) {
                    $http.delete(questions_API+"/"+$routeParams.questionID+"/category/"+$scope.tags.tagsToDissociate[i], { headers: cooksHeader })
                        .success(function(response) {
                            console.log("Tags dissociated successfully");        //on successfull posting of question
                            
                            j=j+1;
                            console.log("length of array:"+$scope.tags.tagsToDissociate.length+":"+i);
                            if(j==($scope.tags.tagsToDissociate.length)) {

                                console.log("All tags have been deleted!");
                                associateNewTags();
                            }
                        
                        })
                        .error(function(response) {
                            console.log("Tags could not be dissociated");                //in case there is an error
                        });
                }

            }

            var associateNewTags = function() {
                var categoryBody = [];      //Will store the body of the url to add categories

                for(i=0;i < $scope.tags.tagsNamesToAddToQuestion.length ;i++) {
                    var singleTag = {
                        "categoryId": categoryDict[$scope.tags.tagsNamesToAddToQuestion[i]]
                    }
                    categoryBody.push(singleTag);       //Add single category to the body to create an array of categories
                }

                console.log(categoryBody);

                var addCategoryURL = questions_API+"/"+$routeParams.questionID+"/category";

                $http.post(addCategoryURL,categoryBody,{ headers: cooksHeader })
                    .success(function(data,status,header,config) {
                        console.log("Categories posted successfully");
                        var myAlert = $alert({title: 'Tags replaced successfully!', content: 'tags edited successfully', placement:'floater top', type: 'success', show: true,duration:5});

                    getCategoriesAssociatedWithQuestion();
                })
                .error(function(response) {
                        console.log("The question could not be deleted");                //in case there is an error
                        var myAlert = $alert({title: 'Tag replace unsuccessful!', content: 'tags could not be edited successfully', placement:'floater top', type: 'danger', show: true,duration:5});

                     });
            }

            getAllCategories();
            getCategoriesAssociatedWithQuestion();

            $scope.getTagTemplate = function() {
                
                return tag_structure_file_postQuestion;         //returning the template file from getQuestonInfo using question 

            }


            $scope.removeCategory = function(categoryToRemove) {

                var index = $scope.tags.tagsNamesToAddToQuestion.indexOf(categoryToRemove);
                console.log(index);

                if (index > -1) {
                    $scope.tags.tagsNamesToAddToQuestion.splice(index, 1);
                }
            }

            $scope.increaseChoices = function() {                       //increases the number of choices to be added to the question
                if($scope.number_of_choices==6)
                    return;
                $scope.number_of_choices++;
                console.log("Added choice entry");
            }

            $scope.decreaseChoices = function() {                       //subtracts the number of choices to be added to the question
                if($scope.number_of_choices==2)
                    return;
                $scope.number_of_choices--;
                console.log("Removed choice entry");
            }

            $scope.updateCategories = function() {
                var filterString = $scope.tags.filterValue;
                var lastIndex = filterString.slice(-1);
                if(filterString==" ") {
                    $scope.tags.filterValue = "";
                    return;
                }
                if(lastIndex==' ' && filterString.length>1) {
                    $scope.tags.tagsNamesToAddToQuestion.push(filterString.substring(0,filterString.length-1))
                    console.log($scope.tags.tagsNamesToAddToQuestion);
                    $scope.tags.filterValue = "";
                }
                
            }

            //$scope.questionID = $routeParams.question_number;
            $scope.question = {};
            if($routeParams.kind=="descriptive") {
                url = post_descriptive_questions_API+ $routeParams.questionID;
            }
            else if($routeParams.kind=="mcq") {
                url = post_mcq_Questions_API+ $routeParams.questionID;
            }
            $scope.load_question = getQuestionInfo[$routeParams.kind].editFragment;

            $http.get(url)
                .then(function(response) {
                
                    $scope.question = response.data;
                    console.log($scope.question);
                    console.log($scope.question.id);
                    console.log($scope.question.explanation);
                    console.log($scope.question.answer);
                    if($scope.question.explanation==null) {
                        $scope.question.explanation=" ";
                    }
                    if($scope.question.answer==null) {
                        $scope.question.answer=" ";
                    }
                });

            $scope.getChoiceStructure = function() {
                return absolute_path+"QnACrunch/EditQuestion/EditMCQTemplate/ChoiceTemplate/choice_structure.html"
            }

            $scope.changeDifficulty = function(operation) {                     //decreases difficulty rating by 1
                if(operation=='minus') {
                    if( $scope.question.difficulty_level >1)
                        $scope.question.difficulty_level--;
                }             
                else {
                    if( $scope.question.difficulty_level <10)                         //increases difficulty rating by 1
                    $scope.question.difficulty_level++;
                }      
            }

            $scope.putDescriptiveQuestion = function() {
                //url = post_descriptive_questions_API+ $routeParams.question_number;
                body =  {
                    "title": $scope.question.title,
                    "description": $scope.question.description,
                    "difficulty_level": $scope.question.difficulty_level,
                    "answer": $scope.question.answer
                };
                $http.put( url+"/", body,{ headers: cooksHeader })
                     .success(function(data,status,header,config) {
                        console.log("Descriptive question edited successfully");        //on successfull posting of question
                        var myAlert = $alert({title: 'Edit successful!', content: 'Question '+$scope.question.id+' edited successfully', placement:'floater top', type: 'success', show: true,duration:15});

                        })
                     .error(function(response) {
                        console.log("The question could not be edited");                //in case there is an error
                        var myAlert = $alert({title: 'Edit unsuccessful!', content: 'Question '+$scope.question.id+' could no be edited. Check logs for more information', placement:'floater top', type: 'danger', show: true,duration:15});

                     });
            }

            $scope.putMCQQuestion = function() {
                console.log("Trying to post MCQ question...");
                    if(!$scope.question.title) {
                        alert("Question has to have a title!");
                        return;
                    }

                    var cooks = $cookies.get("csrftoken");
                    var cooksHeader = { 'X-CSRFToken': cooks };
                    //url = "http://localhost:8000/question/question_mcq/";
                    post_mcq_questions_Body =  {
                        "title": $scope.question.title,
                        "difficulty_level": $scope.question.difficulty_level,
                        "kind": mcq_kind,
                    };
                    $http.put( url+"/", post_mcq_questions_Body,{ headers: cooksHeader })
                        .success(function(data,status,header,config) {
                            
                            //$scope.postResponse = data[0];
                            //console.log("Question posted successfully. ID is:"+$scope.postResponse.id);
                            var myAlert = $alert({title: 'Title edited successfully!', content: 'Title edited', placement:'floater top', type: 'success', show: true,duration:5});



                        })
                        .error(function(response) {
                            console.log("The question could not be posted");
                                //Delete the question since choices were not added!
                                var myAlert = $alert({title: 'Error in posting question!', content: 'Check the logs to know more.', placement:'floater top', type: 'danger', show: true,duration:15});

                         });
            }

            $scope.deleteQuestion = function() {


                $http.delete( url+"/",{ headers: cooksHeader })
                     .success(function(response) {
                        console.log("Descriptive question deleted successfully");        //on successfull posting of question
                        var myAlert = $alert({title: 'Delete successful!', content: 'Question deleted successfully', placement:'floater top', type: 'success', show: true,duration:15});

                        $location.url("QnACrunch");
                        })
                     .error(function(response) {
                        console.log("The question could not be deleted");                //in case there is an error
                        var myAlert = $alert({title: 'Delete unsuccessful!', content: 'Question '+$scope.question.id+' could no be deleted. Check logs for more information', placement:'floater top', type: 'danger', show: true,duration:15});

                     });
            }
        })
        .controller("contactUsController",function($scope) {
            
            $scope.thumbnails = [
                absolute_path+"ContactUs/Images/Facebook_32x32.jpg",
                absolute_path+"ContactUs/Images/linkedin.png",
                absolute_path+"ContactUs/Images/twitter.png"
            ];

            $scope.thumbnails.facebook = absolute_path+"ContactUs/Images/Facebook_32x32.jpg";
            $scope.thumbnails.linkedIn = absolute_path+"ContactUs/Images/linkedin.png";
            $scope.thumbnails.twitter = absolute_path+"ContactUs/Images/twitter.png";
            
            $scope.submitMessage = function() {
                alert($scope.contact.fullName,$scope.contact.email,$scope.contact.subject,$scope.contact.message);
            }

            $scope.resetForm = function() {
                $scope.contact.fullName = "";
                $scope.contact.email = "";
                $scope.contact.subject = "";
                $scope.contact.message = "";
            }
        })
        .controller("aboutUsController",function($scope) {
            $scope.selectedPage = "why_we_started_it.html";

            $scope.changeSelectedPage = function(page) {
                $scope.selectedPage = page;
            }

            $scope.returnSelectedPage = function() {
                return absolute_path+"AboutUs/SubPages/"+ $scope.selectedPage;
            }

        })
        .controller("profileController",function($scope,$http) {

            $scope.Profile = {};
            $scope.Profile.id = "";
            $scope.Profile.username = "";
            $scope.Profile.first_name = "";
            $scope.Profile.last_name = "";
            $scope.Profile.email = "";
            $scope.Profile.contact_no = "";
            $scope.Profile.profile_score = "-1";
            $scope.Profile.profile_experience = "-1";
            $scope.Profile.profile_questions_answered = "-1";


            var loadUserInfo = function() {

                $http.get(user_info_API)
                    .success(function(data,status,headers,config) {
                    
                        $scope.Profile = data;
                        console.log("first name:"+$scope.Profile.first_name);

                    });

            }

            loadUserInfo();
              
        })
        .controller("statisticsController",function($scope,$http) {

            $scope.Profile = {};
            $scope.Profile.id = "";
            $scope.Profile.username = "";
            $scope.Profile.first_name = "";
            $scope.Profile.last_name = "";
            $scope.Profile.email = "";
            $scope.Profile.contact_no = "";
            $scope.Profile.profile_score = "-1";
            $scope.Profile.profile_experience = "-1";
            $scope.Profile.profile_questions_answered = "-1";


            var loadUserInfo = function() {

                $http.get(user_info_API)
                    .success(function(data,status,headers,config) {
                    
                        $scope.Profile = data;
                        console.log("first name:"+$scope.Profile.first_name);

                    });

            }

            $http.get(user_stats_API)
                .success(function(data,status,headers,config) {
                    console.log(data);

                    function drawChart() {

                        // Create the data table.
                        var dataChart = new google.visualization.DataTable();
                        dataChart.addColumn('string', 'Topping');
                        dataChart.addColumn('number', 'Score');
                        for(var cat in data) {
                            console.log(cat,data[cat]);
                            dataChart.addRows([
                                [cat,data[cat]*10]
                            ]);
                        }

                        // Set chart options
                        var options = {
                            'title':'',
                            'width':700,
                            'height':420,
                            'chartArea':{width:"85%",height:"80%"},
                            'legend': { position: 'none' }
                        };

                        // Instantiate and draw our chart, passing in some options.
                        var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
                        chart.draw(dataChart, options);
                      }
                      $scope.flag=false;
                        if(!($scope.flag)) {
                            google.charts.load('current', {'packages':['corechart']});
                            google.charts.setOnLoadCallback(drawChart);
                            console.log("Executed!");
                            $scope.flag=true;
                        }

                });

            loadUserInfo();
              
        })
        .controller("questionsController",function($rootScope,$scope,$http,$sce,userService,$tooltip,$cookies,$alert,$anchorScroll) {

            //this.userModel = userService.model;
            console.log('Entered questions controller')
            //console.log(this.userModel.active);
            //console.log(userService.model.active);
            $scope.userModel = userService.returnState();

            //Variable to display tags/search them in autocomplete search bar
            $scope.tags = {};
            $scope.tags.allTagNames = [];
            $scope.tags.tagsNamesToAddToQuestion = "";

            //Variable to check if category filter is set On/Off
            $scope.isCategoryFilterOn = false;

            //Dictionaries to map questionID : choices/categories of that quesitonID
            $scope.questionIdToChoicesDictionary = [];
            $scope.questionIdToCategoriesDictionary = [];

            //Dictionary for storing mapping of category_text : category_id
            allCategoriesDictionary = [];

            //Feed contains array of 10 sets of questions all the questions 
            $scope.feed = {};
            var feedNum = 0;
            $scope.isFetchingQuestions = false;

            $(window).scroll(function(){
                $("#testSummaryDiv").css({"top": ($(window).scrollTop()) + "px"});
            });

            //Function to remove filter category
            $scope.removeCategory = function(categoryToRemove) {

                console.log("Removing category:"+categoryToRemove);
                $scope.tags.tagsNamesToAddToQuestion = "";
                $scope.isCategoryFilterOn = false;
                $scope.questionIdToChoicesDictionary = [];
                $scope.questionIdToCategoriesDictionary = [];
                feedNum=0;
                $scope.feed = {};

                getQuestions(feedNum);

            }

            $scope.changeCategory = function(categoryToRemove) {
                //categoryToRemove=categoryToRemove+" ";
                $scope.tags.filterValue=categoryToRemove;
                $scope.updateCategories();
            }


            $scope.getTagTemplate = function() {
                
                return tag_structure_file_search_bar;         //returning the template file from getQuestonInfo using question 

            }

            $scope.getTagTemplateForExampleBox = function() {
                
                return tag_structure_file_example_box;         //returning the template file from getQuestonInfo using question 

            }

            $scope.getColorForDifficulty = function(difficulty_level) {
                //console.log(difficulty_level);
                if(difficulty_level>=1 && difficulty_level<=3)
                    return "difficulty_1-3";
                else if (difficulty_level>=4 && difficulty_level<=5)
                    return "difficulty_4-5";
                else if (difficulty_level>=6 && difficulty_level<=7)
                    return "difficulty_6-7";
                else
                    return "difficulty_8-10";
            }

            $scope.makeImportantTagsBold = function(tagToAddToQuestion) {
                var className = "make-font-bold";
                switch(tagToAddToQuestion) {
                    case "Aptitude" :
                        return className;
                    case "Puzzles" :
                        return className;
                    case "Data Structures" :
                        return className;
                    case "String" :
                        return className;
                    case "Algorithm" :
                        return className;
                    case "Bit Problem" :
                        return className;
                    case "Hashing" :
                        return className;
                    case "C Programming" :
                        return className;
                    case "C++" :
                        return className;
                    case "Sorting and Searching" :
                        return className;
                    case "Operating Systems" :
                        return className;
                    case "DBMS" :
                        return className;
                    case "Computer Networking" :
                        return className;
                    default:
                        return "not-important-tag";
                }

            }

            /*$scope.returnShareLink = function(question) {
                return question.shareLink;
            }*/


            //Function to GET all Categories 
            var getAllCategories = function() {

                $http.get(question_categories_API)
                    .success(function(data,status,headers,config) {
                    
                        //Populate the allCategoriesDictionary
                        var j=0;
                        for(i=0;i<data.length;i++) {
                            var singleCategory = data[i];
                            if(!(singleCategory.parent_category==COMPANY_CATEGORY_ID) || singleCategory.id==COMPANY_CATEGORY_ID) {
                                //console.log("Parent category:"+data[i].parent_category);
                                $scope.tags.allTagNames[j++] = (singleCategory.category_text);
                            }
                                
                            allCategoriesDictionary[singleCategory.category_text] = singleCategory.id;
                        }
                        $scope.tags.allTagNames.sort();
                        console.log($scope.tags.allTagNames);

                    });
            }


            getAllCategories();     //Runs function to GET Categories as soon as controller is called

            //Tooltips
            $scope.tooltip = {
              "title": "To filter questions of a particular topic, start typing the topic here!",
              "checked": true
            };
            

            //Function to GET questions
            var getQuestions = function(feedNum) {

                console.log("Feed Number:"+feedNum);
                $scope.isFetchingQuestions = true;

                //Deciding the Endpoint to hit based on whether there is a category selected or not
                if(!($scope.isCategoryFilterOn)) {
                    fetchQuestions_API = questions_API;
                }
                else {
                    fetchQuestions_API = category_enabled_questions_API + $scope.categoryFilterNumber;
                }

                //Fetching questions here
                $http.get(fetchQuestions_API+"?start="+feedNum*10)
                    .success(function(data,status,headers,config) {
                        
                        var allQuestions = data;
                        console.log("Hitting URL:"+config.url);
                        $scope.feed[feedNum] = allQuestions;    //Set of fetch questions get assigned to an index in feed
                        //console.log($scope.feed);

                        $scope.questions = allQuestions;        //Assigning the response data to questions in $scope object
                        
                        //Loop through the questions, and fetch the choices for the MCQs
                        for(var i=0;i<allQuestions.length;i++) {

                            var singleQuestion = allQuestions[i];
                            singleQuestion.isSolved = false;
                            singleQuestion.showSolution = false;
                            singleQuestion.shareLink = API_Start+ "/#/ViewQuestion/"+allQuestions[i].kind+"/"+allQuestions[i].id;
                            singleQuestion.inputIdLink = allQuestions[i].id;
                            singleQuestion.description = $sce.trustAsHtml(singleQuestion.description);

                            //If question is an MCQ, fetch the choices and all to dictionary
                            if(singleQuestion.kind==mcq_kind) {
                                
                                var fetchChoicesOfAQuestion_API = post_mcq_Questions_API + singleQuestion.id;
                                $http.get(fetchChoicesOfAQuestion_API)
                                    .success(function(data,status,headers,config) {
                                        //Populate Question ID to choices Dictionary
                                        $scope.questionIdToChoicesDictionary[data.choices[0].questionId] = data.choices;
                                })
                            }

                            var fetchCategoryOfAQuestion_API = questions_API+"/"+singleQuestion.id+"/category";
                            $http.get(fetchCategoryOfAQuestion_API)
                                .success(function(data,status,headers,config) {

                                    //Get ID of the question to which it belongs
                                    var idOfQuestion = config.url.split("/")[6];
                                    //Populate Question ID to Categories Dictionary
                                    $scope.questionIdToCategoriesDictionary[idOfQuestion] = data;

                            });

                            $scope.isFetchingQuestions = false;
                        }
                });
            
            }

            //Makes first call for questions when controller is executed
            getQuestions(feedNum);


            //Function determines the behavior of the Autocomplete Search Filter
            $scope.updateCategories = function() {
                $anchorScroll();
                var filterString = $scope.tags.filterValue;
                var lastIndex = filterString.slice(-1);

                if(filterString==" ") {
                    $scope.tags.filterValue = "";
                    return;
                }

                if(filterString.length>1 && allCategoriesDictionary[filterString]) {
                    console.log("Dictionary for filter:"+filterString+":"+allCategoriesDictionary[filterString]);
                    $scope.tags.tagsNamesToAddToQuestion = filterString.substring(0,filterString.length);
                    console.log($scope.tags.tagsNamesToAddToQuestion);
                    $scope.tags.filterValue = "";

                    //Here a new category filter has been added, we need to update the questions
                    $scope.categoryFilterNumber = allCategoriesDictionary[$scope.tags.tagsNamesToAddToQuestion];
                    $scope.questionIdToChoicesDictionary = [];
                    $scope.questionIdToCategoriesDictionary = [];
                    $scope.isCategoryFilterOn = true;
                    feedNum=0;
                    $scope.feed = {};

                    //Call getQuestions after resetting all variables
                    getQuestions(feedNum);
                    
                }
            }

            
            $scope.getTagTemplateQnA = function() {
                
                return tag_structure_file_qna;         //returning the template file from getQuestonInfo using question 

            }

            $scope.markForLater = function(question) {
                console.log("Mark "+question.id+" for later");

                var cooks = $cookies.get("csrftoken");
                var cooksHeader = { 'X-CSRFToken': cooks };
                url = question_mark_Later_API;
                body =  [question.id];
                $http.post( url, body,{ headers: cooksHeader })
                     .success(function(data,status,header,config) {
                            console.log("Question marked for later");        //on successfull posting of question
                            
                            var myAlert = $alert({title: "Question "+question.id+" saved to favorites list!", content: "", placement:'floater top', type: 'success', show: true,duration:5});

                        })
                     .error(function(response) {
                        console.log("Error:Question could not saved to favorites list!");                //in case there is an error
                        var myAlert = $alert({title: 'Error:Question could not be marked for later!', content: 'Check the logs to know more.', placement:'floater top', type: 'danger', show: true,duration:5});

                     });

            }

            $scope.shareLink = function(question) {
                console.log("Mark "+question.id+" for later");

                $scope.ShareLinkUrl = API_Start+ "/#/ViewQuestion/"+question.kind+"/"+question.id;
                $scope.tooltipShareLink = {
                  "title": $scope.ShareLinkUrl,
                  "checked": true
                };
                console.log($scope.ShareLinkUrl);
            }


            $scope.displaySolution = function(question) {

                if(question.showSolution) {
                    question.showSolution = false;
                    return;
                }

                console.log(question.id);
                if(question.kind=="descriptive") {
                    console.log("des");
                    url = post_descriptive_questions_API+ question.id;
                }
                else if(question.kind=="mcq") {
                    console.log("mcq");
                    url = post_mcq_Questions_API+ question.id;
                }

                $http.get(url)
                .then(function(response) {
                    
                    var questionDetails = response.data;
                    //$scope.question.description = $sce.trustAsHtml($scope.question.description);
                    //$scope.question.answer = $sce.trustAsHtml($scope.question.answer);
                    //console.log($scope.question);
                    question.answer = questionDetails.answer;
                    console.log(question.answer);
                    question.showSolution = true;
                    $rootScope.rootScope_experience = $rootScope.rootScope_experience+1;

                });
            }

            $scope.$on("$locationChangeStart", function (event, next, current) {
                
                console.log("changing location");
                //scrolling_function.kill();
                $(window).off();
            });


            $(window).scroll(function () {
               if ($(window).scrollTop() >= $(document).height() - $(window).height() - 100) {
                    if(!$scope.isFetchingQuestions) {
                        feedNum++;
                        console.log("Getting feed number:"+feedNum);
                        $scope.isFetchingQuestions=true;
                        getQuestions(feedNum);
                    }     

               }
            });


            //-------------Functions for styling the content-----------------------


            //Returning the template file from getQuestonInfo using question 
            $scope.getQuestionTemplateByType = function(question) {
                
                return getQuestionInfo[question.kind].templateFile;

            }

            //Returing if the selected choice is the correct choice
            $scope.validateChoice = function(question,choice,index) {
                console.log(question);
                console.log(choice);
                console.log(index);
                
                if(question.isSolved)
                    return;

                var cooks = $cookies.get("csrftoken");
                var cooksHeader = { 'X-CSRFToken': cooks };

                postBody = {"choiceId":choice.id};
                $http.post(post_mcq_Questions_API+question.id+"/solve",postBody,{ headers: cooksHeader })
                    .success(function(data,status,header,config) {
                            console.log("Solved Question!");        //on successfull posting of question
                            console.log(data.value);
                            console.log($scope.questionIdToChoicesDictionary[question.id]);
                            for(i=0;i<$scope.questionIdToChoicesDictionary[question.id].length;i++) {
                                if($scope.questionIdToChoicesDictionary[question.id][i].id==data.value){
                                    $scope.questionIdToChoicesDictionary[question.id][i]["is_correct"] = true;
                                    if(choice.id==data.value) {
                                        $rootScope.rootScope_score = $rootScope.rootScope_score+10;

                                        var myAlert = $alert({title: "Question "+question.id+" solved correctly!", content: "You scored 10 points", placement:'floater top', type: 'success', show: true,duration:4});
                            
                                    }
                                    else {
                                        var myAlert = $alert({title: "The option you chose to question "+question.id+" was incorrect!", content: "You scored 0 points", placement:'floater top', type: 'danger', show: true,duration:4});
                            
                                    }
                                    $rootScope.rootScope_experience = $rootScope.rootScope_experience+1;
                                }
                                else {
                                    $scope.questionIdToChoicesDictionary[question.id][i]["is_correct"] = false;
                                }
                                console.log($scope.questionIdToChoicesDictionary[question.id][i]);
                            }
                            question.isSolved = true;
                            question.isSelected = index;
                        })
                     .error(function(response) {
                        console.log("Error:Question could not be marked for later");                //in case there is an error
                        var myAlert = $alert({title: 'Error:Question could not be marked for later!', content: 'Check the logs to know more.', placement:'floater top', type: 'danger', show: true,duration:5});

                     });
                /*if(question.isSolved)
                    return;
                question.isSolved = true;
                question.isSelected = index;*/
            }

            //The choice selected get a grey background
            $scope.applyClassToSelectedChoice = function(question,choice,index) {
                if(!question.isSolved)
                    return;
                if(question.isSelected==index)
                    return "background-grey";
            }

            //Change color of the choice option to indicate correctness
            $scope.applyColors = function(question,choice) {
                if(!question.isSolved)
                    return;
                if(choice.is_correct) {
                    return "choice-green";
                }
                else {
                    return "choice-red";
                }
            }

        })
        .controller("markedForLaterController",function($scope,$http,$sce,userService,$tooltip,$cookies,$alert) {

            //this.userModel = userService.model;
            console.log('entered questions controller')
            //console.log(this.userModel.active);
            //console.log(userService.model.active);
            $scope.userModel = userService.returnState();


            //Dictionaries to map questionID : choices/categories of that quesitonID
            $scope.questionIdToChoicesDictionary = [];
            $scope.questionIdToCategoriesDictionary = [];

            //Dictionary for storing mapping of category_text : category_id
            allCategoriesDictionary = [];

            //Feed contains array of 10 sets of questions all the questions 
            $scope.feed = {};
            var feedNum = 0;
            var isFetchingQuestions = false;

            $(window).scroll(function(){
                $("#testSummaryDiv").css({"top": ($(window).scrollTop()) + "px"});
            });


            $scope.getTagTemplate = function() {
                
                return tag_structure_file_search_bar;         //returning the template file from getQuestonInfo using question 

            }


            $scope.getColorForDifficulty = function(difficulty_level) {
                //console.log(difficulty_level);
                if(difficulty_level>=1 && difficulty_level<=3)
                    return "difficulty_1-3";
                else if (difficulty_level>=4 && difficulty_level<=5)
                    return "difficulty_4-5";
                else if (difficulty_level>=6 && difficulty_level<=7)
                    return "difficulty_6-7";
                else
                    return "difficulty_8-10";
            }


            //Tooltips
            $scope.tooltip = {
              "title": "To filter questions of a particular topic, start typing the topic here!",
              "checked": true
            };
            

            //Function to GET questions
            var questionIDToMarkQuestionID = [];
            var getQuestions = function(feedNum) {

                console.log("Feed Number:"+feedNum);

                var arrayOfQuestionIDs = [];
                $scope.questions = [];
                var allQuestions;
                //questionIDToMarkQuestionID = [];
                $http.get(question_mark_Later_API)
                    .success(function(data,status,headers,config) {
                        allQuestions = [];
                        for(i=0;i<data.length;i++) {
                            arrayOfQuestionIDs.push(data[i].questionId);
                            questionIDToMarkQuestionID[data[i].questionId] = data[i].id;
                            console.log(questionIDToMarkQuestionID);
                            $http.get(questions_API+"/"+data[i].questionId)
                                .success(function(data,status,headers,config) {
                                    allQuestions.push(data);
                                    var singleQuestion = data;
                                    singleQuestion.isSolved = false;
                                    singleQuestion.showSolution = false;
                                    singleQuestion.description = $sce.trustAsHtml(singleQuestion.description);

                                    if(singleQuestion.kind==mcq_kind) {
                                
                                    var fetchChoicesOfAQuestion_API = post_mcq_Questions_API + singleQuestion.id+"/choice/";
                                    $http.get(fetchChoicesOfAQuestion_API)
                                        .success(function(data,status,headers,config) {
                                            //Populate Question ID to choices Dictionary
                                            $scope.questionIdToChoicesDictionary[data[0].questionId] = data;
                                            console.log(config.url);
                                        })

                                    
                                    }

                                    var fetchCategoryOfAQuestion_API = questions_API+"/"+singleQuestion.id+"/category";
                                    $http.get(fetchCategoryOfAQuestion_API)
                                        .success(function(data,status,headers,config) {

                                            //Get ID of the question to which it belongs
                                            var idOfQuestion = config.url.split("/")[6];
                                            //Populate Question ID to Categories Dictionary
                                            $scope.questionIdToCategoriesDictionary[idOfQuestion] = data;

                                    });
                                        

                                    isFetchingQuestions = false;
                                })
                            }
                        console.log(allQuestions);

                        $scope.questions = allQuestions;    //Set of fetch questions get assigned to an index in feed


                    })

                

                //Fetching questions here
                
            
            }

            //Makes first call for questions when controller is executed
            getQuestions(feedNum);



            
            $scope.getTagTemplateQnA = function() {
                
                return tag_structure_file_qna;         //returning the template file from getQuestonInfo using question 

            }


            $scope.unmarkQuestion = function(question,index) {
                console.log($scope.questions.indexOf(question));
                console.log(index);
                //console.log(questionIDToMarkQuestionID);
                //console.log(questionIDToMarkQuestionID[question.id]);

                var cooks = $cookies.get("csrftoken");
                var cooksHeader = { 'X-CSRFToken': cooks };
                url = question_unmark_Later_API+questionIDToMarkQuestionID[question.id];
                body =  [question.id];
                $http.delete( url, { headers: cooksHeader })
                     .success(function(data,status,header,config) {

                            $scope.questions.splice(index,1);
                            console.log($scope.questions);
                            console.log("Question has been removed from saved list");        //on successfull posting of question                     
                            var myAlert = $alert({title: "Question "+question.id+" has been removed from favorites list!", content: "", placement:'floater top', type: 'success', show: true,duration:5});

                        })
                     .error(function(response) {
                        console.log("Error:Question could not be marked for later");                //in case there is an error
                        var myAlert = $alert({title: 'Error:Question could not be removed from favorites list!', content: 'Check the logs to know more.', placement:'floater top', type: 'danger', show: true,duration:5});

                     });

            }

            $scope.displaySolution = function(question) {

                if(question.showSolution) {
                    question.showSolution = false;
                    return;
                }

                console.log(question.id);
                if(question.kind=="descriptive") {
                    console.log("des");
                    url = post_descriptive_questions_API+ question.id;
                }
                else if(question.kind=="mcq") {
                    console.log("mcq");
                    url = post_mcq_Questions_API+ question.id;
                }

                $http.get(url)
                .then(function(response) {
                    
                    var questionDetails = response.data;
                    //$scope.question.description = $sce.trustAsHtml($scope.question.description);
                    //$scope.question.answer = $sce.trustAsHtml($scope.question.answer);
                    //console.log($scope.question);
                    question.answer = questionDetails.answer;
                    console.log(question.answer);
                    question.showSolution = true;

                });
            }

            $scope.$on("$locationChangeStart", function (event, next, current) {
                
                console.log("changing location");
                //scrolling_function.kill();
                $(window).off();
            });



            //-------------Functions for styling the content-----------------------


            //Returning the template file from getQuestonInfo using question 
            $scope.getQuestionTemplateByType = function(question) {
                
                return getQuestionInfo[question.kind].markLaterTemplateFile;

            }

            //Returing if the selected choice is the correct choice
            $scope.validateChoice = function(question,choice,index) {
                if(question.isSolved)
                    return;
                question.isSolved = true;
                question.isSelected = index;
            }

            //The choice selected get a grey background
            $scope.applyClassToSelectedChoice = function(question,choice,index) {
                if(!question.isSolved)
                    return;
                if(question.isSelected==index)
                    return "background-grey";
            }

            //Change color of the choice option to indicate correctness
            $scope.applyColors = function(question,choice) {
                if(!question.isSolved)
                    return;
                if(choice.is_correct) {
                    return "choice-green";
                }
                else {
                    return "choice-red"
                }
            }

        })
        .controller("postQuestion",function($scope,$http,$alert,$cookies) {

            //Scope Variables default values;
            $scope.question_types = question_types;
            $scope.load_question = getQuestionInfo[mcq_kind].postFragment;
            $scope.question = {};
            $scope.question.difficulty = DEFAULT_DIFFICULTY;
            $scope.number_of_choices = DEFAULT_NUMBER_OF_CHOICES;

            //Variables to deliver active tab functionality
            var classToAddToTab = "active";             //The class you want to apply when question type is selected
            $scope.tabClass = [classToAddToTab,""];     //By default the first one will have the class and second will not

            //--------------Mock Tests--------------------
            $scope.mock={};
            $scope.mock.mockTitle="";
            $scope.mock.mockDuration="";
            $scope.mock.mockDifficulty="";

            $scope.addMockTest = function() {
                var cooks = $cookies.get("csrftoken");
                var cooksHeader = { 'X-CSRFToken': cooks };
                url = mock_mock_API;
                body =  [{
                    "title": $scope.mock.mockTitle,
                    "duration": $scope.mock.mockDuration,
                    "difficulty_level": $scope.mock.mockDifficulty
                }];
                $http.post( url, body,{ headers: cooksHeader })
                     .success(function(data,status,header,config) {
                            console.log("Descriptive question posted successfully.ID:"+data[0].id);        //on successfull posting of question
                            
                            var myAlert = $alert({title: 'Mock added successfully!', content: 'The Mock ID is :'+data[0].id, placement:'floater top', type: 'success', show: true,duration:15});

                        })
                     .error(function(response) {
                        console.log("The question could not be posted");                //in case there is an error
                        var myAlert = $alert({title: 'Error in posting mock test!', content: 'Check the logs to know more.', placement:'floater top', type: 'danger', show: true,duration:15});

                     });
            }

            $scope.addNewTag = function() {
                var cooks = $cookies.get("csrftoken");
                var cooksHeader = { 'X-CSRFToken': cooks };
                url = category_enabled_API;
                body =  [{
                    "category_text": $scope.addTags.categoryText,
                    "parent_category": parseInt($scope.addTags.parentCategory)
                }];
                $http.post( url, body,{ headers: cooksHeader })
                     .success(function(data,status,header,config) {
                            console.log("New tag added successfully.ID:"+data[0].id);        //on successfull posting of question
                            
                            var myAlert = $alert({title: 'New tag added successfully!', content: 'The tag ID is :'+data[0].id, placement:'floater top', type: 'success', show: true,duration:15});

                        })
                     .error(function(response) {
                        console.log("The tag could not be added");                //in case there is an error
                        var myAlert = $alert({title: 'Error in adding tag!', content: 'Check the logs to know more.', placement:'floater top', type: 'danger', show: true,duration:15});

                     });
            }

            $scope.deleteATag = function() {
                var cooks = $cookies.get("csrftoken");
                var cooksHeader = { 'X-CSRFToken': cooks };
                $http.delete(category_enabled_API+$scope.addTags.categoryIDToDelete, {headers : cooksHeader})
                    .success(function(response) {
                            console.log("Tags deleted successfully");        //on successfull posting of question
                            
                        
                        })
                        .error(function(response) {
                            console.log("Tags could not be deleted");                //in case there is an error
                        });
            }

            $scope.changeTabClass = function(clickedTab) {
                if(clickedTab=="mcq") {
                    $scope.tabClass = [classToAddToTab,""];     //Apply to first and remove from second
                }
                else {
                    $scope.tabClass = ["",classToAddToTab];     //Apply to second and remove from firstS
                }
            }

            $scope.selectQuestionToPost = function(question_type) {
                    $scope.changeTabClass(question_type);
                    console.log(question_type);
                    $scope.load_question = getQuestionInfo[question_type].postFragment;     //Selects the template of the question to post
            }

            $scope.getTagTemplate = function() {
                
                return tag_structure_file_postQuestion;         //returning the template file from getQuestonInfo using question 

            }

            $scope.changeDifficulty = function(operation) {                     //decreases difficulty rating by 1
                if(operation=='minus') {
                    if( $scope.question.difficulty >1)
                        $scope.question.difficulty--;
                }             
                else {
                    if( $scope.question.difficulty <10)                         //increases difficulty rating by 1
                    $scope.question.difficulty++;
                }      
            }

            $scope.getChoiceStructure = function() {
                return choice_structure_file;                           //choice_structure_file is the global variable which has the choice fragment file
            }

            $scope.increaseChoices = function() {                       //increases the number of choices to be added to the question
                if($scope.number_of_choices==6)
                    return;
                $scope.number_of_choices++;
                console.log("Added choice entry");
            }

            $scope.decreaseChoices = function() {                       //subtracts the number of choices to be added to the question
                if($scope.number_of_choices==2)
                    return;
                $scope.number_of_choices--;
                console.log("Removed choice entry");
            }

            $scope.getTimes=function(){                                 //gets the number of choices, it is called by the loop which adds the choices
                n = $scope.number_of_choices;
                return new Array(n);
            };


            //Scope variables needed for adding tags
            $scope.tags = {};
            $scope.tags.filterValue = "";                   //Value obtained from autocomplete search bar
            $scope.tags.allTagNames = [];                   //Stores name of all tags, used as model for autocomplete search bar
            $scope.tags.tagsNamesToAddToQuestion = [];      //Array which stores the names of the tags to associate with Q


            categoryDict = [];      //Used for mapping category name to category id

            $scope.updateCategories = function() {
                var filterString = $scope.tags.filterValue;
                var lastIndex = filterString.slice(-1);
                if(filterString==" ") {
                    $scope.tags.filterValue = "";
                    return;
                }
                if(lastIndex==' ' && filterString.length>1) {
                    $scope.tags.tagsNamesToAddToQuestion.push(filterString.substring(0,filterString.length-1))
                    console.log($scope.tags.tagsNamesToAddToQuestion);
                    $scope.tags.filterValue = "";
                }
                
            }

            $scope.clearQuestion = function() {
                console.log("Clearing the Question!")
                $scope.question = {};
                $scope.question.difficulty = DEFAULT_DIFFICULTY;
                $scope.number_of_choices = DEFAULT_NUMBER_OF_CHOICES;
                

                $scope.tags.filterValue = "";                   //Value obtained from autocomplete search bar
                $scope.tags.tagsNamesToAddToQuestion = [];
            }

            //Get all the categories/tags in on go
            var getAllCategories = function() {
                
                $http.get(question_categories_API)
                    .then(function(response) {
                                            
                        for(i=0;i<response.data.length;i++) {
                            $scope.tags.allTagNames[i] = (response.data[i].category_text);
                            categoryDict[response.data[i].category_text] = response.data[i].id      //Creating a dictionary with key as category name and value as categroy id
                        }

                        console.log("All tag names:"+$scope.tags.allTagNames);
                        console.log(categoryDict);

                    });
            }

            $scope.removeCategory = function(categoryToRemove) {

                var index = $scope.tags.tagsNamesToAddToQuestion.indexOf(categoryToRemove);
                console.log(index);

                if (index > -1) {
                    $scope.tags.tagsNamesToAddToQuestion.splice(index, 1);
                }
            }


            getAllCategories();

            $scope.postDescriptiveQuestion = function() {
                
                console.log("Trying to post descriptive question...");
                if(!$scope.question.questionText) {
                    alert("Question has to have title");  //Will try to make border of question title red
                    return;
                }
                if(!$scope.question.questionDescription){
                    alert("Question has to have explanation");  //Will try to make border of question title red
                    return;
                }
                console.log("This is the:"+$cookies.get("csrftoken"));
                var cooks = $cookies.get("csrftoken");
                var cooksHeader = { 'X-CSRFToken': cooks };
                url = post_descriptive_questions_API;
                body =  [{
                    "title": $scope.question.questionText,
                    "description": $scope.question.questionDescription,
                    "difficulty_level": $scope.question.difficulty,
                    "kind": descriptive_kind,
                    "answer": $scope.question.questionAnswer
                }];
                $http.post( url, body,{ headers: cooksHeader })
                     .success(function(data,status,header,config) {
                            console.log("Descriptive question posted successfully.ID:"+data[0].id);        //on successfull posting of question
                            
                            var myAlert = $alert({title: 'Posted Question successfully!', content: 'The Question ID is :'+data[0].id, placement:'floater top', type: 'success', show: true,duration:15});

                            var categoryBody = [];      //Will store the body of the url to add categories

                            for(i=0;i < $scope.tags.tagsNamesToAddToQuestion.length ;i++) {
                                var singleTag = {
                                    "categoryId": categoryDict[$scope.tags.tagsNamesToAddToQuestion[i]]
                                }
                                categoryBody.push(singleTag);       //Add single category to the body to create an array of categories
                            }

                            console.log(categoryBody);

                            var addCategoryURL = questions_API+"/"+data[0].id+"/category";

                            $http.post(addCategoryURL,categoryBody,{ headers: cooksHeader })
                            .success(function(data,status,header,config) {
                                console.log("Categories posted successfully");
                            })

                        })
                     .error(function(response) {
                        console.log("The question could not be posted");                //in case there is an error
                        var myAlert = $alert({title: 'Error in posting question!', content: 'Check the logs to know more.', placement:'floater top', type: 'danger', show: true,duration:15});

                     });
            }

            //$scope.mockID="";

            $scope.postMCQQuestion = function () {

                if($scope.question.mockID) {

                    console.log("trying to post in mock");


                    var choiceBodyMock = [];    //Will hold body of the url which posts choices

                    for(i=0;i<$scope.number_of_choices;i++) {
                        var text = $scope.question.choices.choiceText[i];
                        if(text==null || text=="")
                            continue;
                        var isTrue = $scope.question.choices.choicesCorrect[i];
                        var singleChoice = {
                            "choice_text" : text,
                            "is_correct" : isTrue
                        }
                        choiceBodyMock.push(singleChoice);

                    }

                    post_mock_mcq_questions_Body =  [{
                        "title": $scope.question.questionText,
                        "difficulty_level": $scope.question.difficulty,
                        "description" : $scope.question.solution,
                        "choices": choiceBodyMock
                    }];

                    console.log(post_mock_mcq_questions_Body);

                    var cooks = $cookies.get("csrftoken");
                    var cooksHeader = { 'X-CSRFToken': cooks };

                    $http.post(mock_mock_API+$scope.question.mockID+"/adminquestions",post_mock_mcq_questions_Body,{ headers: cooksHeader })
                        .success(function(data,status,header,config) {
                            $scope.postResponse = data[0];
                            console.log("Question posted successfully");
                            var myAlert = $alert({title: 'Posted Question successfully!', content: 'Posted the question into mock ID :'+$scope.question.mockID, placement:'floater top', type: 'success', show: true,duration:15});

                        })
                }
                else {
                    console.log("Trying to post MCQ question...");
                    if(!$scope.question.questionText) {
                        alert("Question has to have a title!");
                        return;
                    }

                    var cooks = $cookies.get("csrftoken");
                    var cooksHeader = { 'X-CSRFToken': cooks };
                    //url = "http://localhost:8000/question/question_mcq/";
                    post_mcq_questions_Body =  [{
                        "title": $scope.question.questionText,
                        "difficulty_level": $scope.question.difficulty,
                        "kind": mcq_kind,
                    }];
                    $http.post( post_mcq_Questions_API, post_mcq_questions_Body,{ headers: cooksHeader })
                        .success(function(data,status,header,config) {
                            
                            $scope.postResponse = data[0];
                            console.log("Question posted successfully. ID is:"+$scope.postResponse.id);
                            var myAlert = $alert({title: 'Posted Question successfully!', content: 'The Question ID is :'+data[0].id, placement:'floater top', type: 'success', show: true,duration:15});


                            //Add choices to the question here
                            for(i=0;i<$scope.number_of_choices;i++) {
                                if(!$scope.question.choices.choicesCorrect[i])
                                    $scope.question.choices.choicesCorrect[i]=false;   
                            }

                            var choiceBody = [];    //Will hold body of the url which posts choices

                            for(i=0;i<$scope.number_of_choices;i++) {
                                var text = $scope.question.choices.choiceText[i];
                                if(text==null || text=="")
                                    continue;
                                var isTrue = $scope.question.choices.choicesCorrect[i];
                                var singleChoice = {
                                    "choice_text" : text,
                                    "is_correct" : isTrue,
                                    "questionId" : $scope.postResponse.id
                                }
                                console.log(singleChoice);
                                choiceBody.push(singleChoice);

                            }


                            $http.post(question_add_choices_API,choiceBody,{ headers: cooksHeader })
                            .success(function(data,status,header,config) {
                                console.log("Option posted successfully");
                            })

                            //Add categories to question here
                            var categoryBody = [];

                            for(i=0;i< $scope.tags.tagsNamesToAddToQuestion.length ;i++) {
                                
                                var singleCategory = {
                                    "categoryId": categoryDict[$scope.tags.tagsNamesToAddToQuestion[i]]     //Add category id to the choice body using categoryDict dictionary
                                }
                                categoryBody.push(singleCategory);   //Add single category to the body
                            }

                            console.log(categoryBody);

                            var addCategoryURL = questions_API + "/" + $scope.postResponse.id + "/category";

                            $http.post(addCategoryURL,categoryBody,{ headers: cooksHeader })
                                .success(function(data,status,header,config) {
                                    console.log("Categories posted successfully");
                            })

                        })
                        .error(function(response) {
                            console.log("The question could not be posted");
                                //Delete the question since choices were not added!
                                var myAlert = $alert({title: 'Error in posting question!', content: 'Check the logs to know more.', placement:'floater top', type: 'danger', show: true,duration:15});

                         });
                }

                
            }

        });
