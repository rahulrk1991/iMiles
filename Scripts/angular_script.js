
var app = angular
        .module("iMiles_Module",["textAngular","ngRoute","mgcrea.ngStrap","ngSanitize"])
        .directive('ckEditor', function() {
          return {
            require: '?ngModel',
            link: function(scope, elm, attr, ngModel) {
              var ck = CKEDITOR.replace(elm[0]);

              if (!ngModel) return;

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
            .when("/OnlineMockTests/TakeATest/:category/:duration/:difficulty", {
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
            $locationProvider.html5Mode(true);
            //$locationProvider.baseHref("Angular");

         })
        .controller("onlineMockTestsChooseTestController",function($scope,$http) {

            //Variable to display tags/search them in autocomplete search bar
            $scope.tags = {};
            $scope.tags.allTagNames = [];
            $scope.tags.allTagId = [];
            $scope.tags.tagsNamesToAddToQuestion = [];
            $scope.tags.filterValue = "Aptitude";

            //Category TextBox
            $scope.selectedCategory="Aptitude";

            //Duration TextBox
            $scope.durations = [15,30,45,60];
            $scope.duration=15;
            $scope.durationText = "15";

            //Difficulty TextBox
            $scope.difficulties = ["Easy","Medium","Hard"];
            $scope.difficulty = "Easy";

            categoryDict = [];

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

            $scope.setCategory = function() {
                $scope.selectedCategory = $scope.tags.filterValue;
            }

            $scope.setDuration = function(durationSetByUser) {
                $scope.duration = durationSetByUser;
                $scope.durationText = durationSetByUser + " minutes";
            }

            $scope.setDifficulty = function(difficultySetByUser) {
                $scope.difficulty = difficultySetByUser;
            }

        })
        .controller("onlineMockTestsTakeATestController",function($scope,$http,$timeout,$routeParams,$modal) {


            //Variable to display tags/search them in autocomplete search bar
            $scope.tags = {};
            $scope.tags.allTagNames = [];
            $scope.tags.allTagId = [];
            $scope.tags.tagsNamesToAddToQuestion = [];

            choiceDict = [];
            categoryDict = [];

            $scope.attemptedQuestions=0;
            $scope.totalQuestions;

            //Review Test modal variable
            $scope.title = "Your Time is up!";
            $scope.content = "Click on the below button to get a comprehensive review of your test";

            //Timer variables
            var durationInMinutes = $routeParams.duration;
            var durationInSeconds = $routeParams.duration*60;

            $(window).scroll(function(){
                $("#testSummaryDiv").css({"top": ($(window).scrollTop()) + "px"});
                });
            //$scope.min=durationInMinutes;
            //$scope.sec=0;

            $scope.counter = 10;
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
                    var myOtherModal = $modal({scope: $scope, template: 'OnlineMockTests/review_test_modal.html', show: true});
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
            $http.get(post_mcq_Questions_API)
                .then(function(response) {
                    var allQuestions = response.data;
                    $scope.questions = allQuestions;            //Assigning the response data to questions in $scope object
                    var dict = [];                              // dict['question id'] = choice
                    $scope.totalQuestions = allQuestions.length;
                    for(var i=0;i<allQuestions.length;i++) {                //loop through the questions, and get the choices for each
                        var singleQuestion = allQuestions[i];

                        singleQuestion.isSolved = false;
                        singleQuestion.usersChoice = -1;
                        singleQuestion.testId = i+1;

                        var the_url = post_mcq_Questions_API + singleQuestion.id+"/choice/";
                        $http.get(the_url)
                            .then(function(response) {
                                var allChoices = response.data;                    //get all the choices of a question in allChoices
                                //console.log(response.data);
                                dict[allChoices[0].questionId] = allChoices;          //allChoices[0]. question is the question id
                                //console.log(singleQuestion);
                            })
                        

                        //The following piece of code is causing problems becaues singleQuestion.id is changing coz its a global vairable
                        //Solution : tell arpit to return the question id the category belongs to like the choices in above call
                        /*var catURL = "http://localhost:8000/question/question/"+singleQuestion.id+"/category"
                            $http.get(catURL)
                                .then(function(response) {
                                    var cats = response.data;                    //get all the choices of a question in allChoices
                                    //console.log(response.data);
                                    console.log("For question:"+singleQuestion.id);
                                    console.log(response.data);
                                    if(response.data)
                                        $scope.tags.categorydictionary[singleQuestion.id] = response.data;          //allChoices[0]. question is the question id
                                })*/

                    }

                    $scope.choiceDict = dict;                  //assign this dictionary to the scope to access in the view


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
                
                return getQuestionInfo[question.kind].onlineMockTestFragment;         //returning the template file from getQuestonInfo using question 

            }

            $scope.validateChoice = function(question,choice,index) {     //returing if the selected choice is the correct choice
                
                if($scope.isTestSubmitted)
                    return;

                if(question.isSolved == false) {
                    $scope.attemptedQuestions++;
                }

                question.isSolved = true;
                question.usersChoice = choice.id;
                if(question.isSelected==index) {
                    console.log("Clicking same twice");
                    question.isDoneTwice=true;
                }
                question.isSelected = index;

                
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

            $scope.submitTest = function() {
                $scope.isTestSubmitted = true;
                console.log("Test submitted");
                var myOtherModal = $modal({scope: $scope, template: 'OnlineMockTests/review_test_modal.html', show: false});
            }

            //Edit Question
            $scope.editQuestion = function(questionID) {
                alert("Editing Question:"+questionID);
            }
        })
        .controller("landingPageController",function($scope,$aside,$modal,$http,$sce) {

            $scope.title="iMiles Menu";

            $scope.registerUser = function() {
                var myModal = $modal({title: 'My Title', template:'LandingPage/registration_template.html', show: true});
            }

            $http.get(user_registration_API)
            .then(function(response) {
                
                $scope.registration_form = $sce.trustAsHtml(response.data);

                console.log($scope.registration_form);

            });

            $http.get(user_login_API)
            .then(function(response) {
                
                $scope.login_form = $sce.trustAsHtml(response.data);

                console.log($scope.login_form);

            });

        })

        .controller("viewQuestionsController",function($scope,$http,$routeParams,$sce) {
            $scope.load_question = getQuestionInfo[$routeParams.kind].viewFragment;
            $scope.question = {};
            $scope.panel={};
            $scope.panel.title = "Click here to view Solution";
            $scope.panel.body = "Answer not retrieved, check JSON object in console for clues"
            

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
                console.log($scope.question.id);
                $scope.panel.body=$scope.question.answer;

            });

            $scope.getChoiceStructure = function() {
                return absolute_path+"QnACrunch/ViewQuestion/MCQTemplate/ChoiceTemplate/choice_structure.html"
            }

        })
        .controller("editQuestionsController",function($scope,$http,$routeParams,$location,$alert) {
            var url;
            $scope.choices = {};
            console.log($routeParams.questionID);
            console.log($routeParams.kind);
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
                $http.put( url+"/", body)
                     .success(function(data,status,header,config) {
                        console.log("Descriptive question edited successfully");        //on successfull posting of question
                        var myAlert = $alert({title: 'Edit successful!', content: 'Question '+$scope.question.id+' edited successfully', placement:'alert-box', type: 'success', show: true,duration:15});

                        })
                     .error(function(response) {
                        console.log("The question could not be edited");                //in case there is an error
                        var myAlert = $alert({title: 'Edit unsuccessful!', content: 'Question '+$scope.question.id+' could no be edited. Check logs for more information', placement:'alert-box', type: 'danger', show: true,duration:15});

                     });
            }

            $scope.deleteQuestion = function() {
                $http.delete( url+"/")
                     .success(function(response) {
                        console.log("Descriptive question deleted successfully");        //on successfull posting of question
                        var myAlert = $alert({title: 'Delete successful!', content: 'Question deleted successfully', placement:'alert-box', type: 'success', show: true,duration:15});

                        $location.url("QnACrunch");
                        })
                     .error(function(response) {
                        console.log("The question could not be deleted");                //in case there is an error
                        var myAlert = $alert({title: 'Delete unsuccessful!', content: 'Question '+$scope.question.id+' could no be deleted. Check logs for more information', placement:'alert-box', type: 'danger', show: true,duration:15});

                     });
            }
        })
        .controller("contactUsController",function($scope) {
            
            $scope.thumbnails = [
                absolute_path+"ContactUs/Images/Facebook_32x32.jpg",
                absolute_path+"ContactUs/Images/linkedin.png",
                absolute_path+"ContactUs/Images/twitter.png"
            ];
            
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
        .controller("profileController",function($scope) {
            //dummy controller for profile page
        })
        .controller("questionsController",function($scope,$http,$sce) {


            //Variable to display tags/search them in autocomplete search bar
            $scope.tags = {};
            $scope.tags.allTagNames = [];
            $scope.tags.allTagId = [];
            $scope.tags.tagsNamesToAddToQuestion = [];

            choiceDict = [];
            categoryDict = [];

            $scope.feed = {};
            var feedNum = 0;
            var fetching = false;


            var getQuestions = function(feedNum) {

                console.log("Feed Number:"+feedNum);
                //Get all the question data using http get
                $http.get(questions_API+"?start="+feedNum*10)
                    .then(function(response) {
                        
                        var allQuestions = response.data;
                        $scope.feed[feedNum] = allQuestions;
                        console.log($scope.feed);

                        $scope.questions = allQuestions;            //Assigning the response data to questions in $scope object
                        old = allQuestions;
                        var dict = [];                              // dict['question id'] = choice
                        for(var i=0;i<allQuestions.length;i++) {                //loop through the questions, and get the choices for each
                            var singleQuestion = allQuestions[i];

                            singleQuestion.isSolved = false;
                            singleQuestion.description = $sce.trustAsHtml(singleQuestion.description);

                            if(singleQuestion.kind==mcq_kind) {
                                //var the_url = 'http://localhost:8000/question/question_mcq/choice/'+singleQuestion.id;      //call to get choices
                                var the_url = post_mcq_Questions_API + singleQuestion.id+"/choice/";
                                $http.get(the_url)
                                    .then(function(response) {
                                        var allChoices = response.data;                    //get all the choices of a question in allChoices
                                        //console.log(response.data);
                                        dict[allChoices[0].questionId] = allChoices;          //allChoices[0]. question is the question id
                                    })
                                }

                            //The following piece of code is causing problems becaues singleQuestion.id is changing coz its a global vairable
                            //Solution : tell arpit to return the question id the category belongs to like the choices in above call
                            /*var catURL = "http://localhost:8000/question/question/"+singleQuestion.id+"/category"
                                $http.get(catURL)
                                    .then(function(response) {
                                        var cats = response.data;                    //get all the choices of a question in allChoices
                                        //console.log(response.data);
                                        console.log("For question:"+singleQuestion.id);
                                        console.log(response.data);
                                        if(response.data)
                                            $scope.tags.categorydictionary[singleQuestion.id] = response.data;          //allChoices[0]. question is the question id
                                    })*/

                        

                        $scope.choiceDict = dict;                  //assign this dictionary to the scope to access in the view

                    fetching = false;
                }
                });
            
            }

            $(window).scroll(function () {
               if ($(window).scrollTop() >= $(document).height() - $(window).height() - 100) {
                    if(!fetching) {
                        feedNum++;
                        console.log("Getting feed number:"+feedNum);
                        fetching=true;
                        getQuestions(feedNum);
                    }     

               }
            });

            getQuestions(feedNum);

            var getAllCategories = function() {
                //console.log("Got categories");
                $http.get(question_categories_API)
                    .then(function(response) {
                                            
                        for(i=0;i<response.data.length;i++) {
                            $scope.tags.allTagNames[i] = (response.data[i].category_text);
                            categoryDict[response.data[i].category_text] = response.data[i].id
                        }
                        console.log($scope.tags.allTagNames);
                        //console.log(categoryDict);

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

            
            $scope.getQuestionTemplateByType = function(question) {
                
                return getQuestionInfo[question.kind].templateFile;         //returning the template file from getQuestonInfo using question 

            }

            $scope.validateChoice = function(question,choice,index) {     //returing if the selected choice is the correct choice
                if(question.isSolved)
                    return;
                question.isSolved = true;
                question.isSelected = index;
            }

            $scope.applyClassToSelectedChoice = function(question,choice,index) {
                if(!question.isSolved)
                    return;
                if(question.isSelected==index)
                    return "background-grey";
            }

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

            //Edit Question
            $scope.editQuestion = function(questionID) {
                alert("Editing Question:"+questionID);
            }
        })
        .controller("postQuestion",function($scope,$http,$alert) {

            //Scope Variables default values;
            $scope.question_types = question_types;
            $scope.load_question = getQuestionInfo[mcq_kind].postFragment;
            $scope.question = {};
            $scope.question.difficulty = DEFAULT_DIFFICULTY;
            $scope.number_of_choices = DEFAULT_NUMBER_OF_CHOICES;

            //Variables to deliver active tab functionality
            var classToAddToTab = "active";             //The class you want to apply when question type is selected
            $scope.tabClass = [classToAddToTab,""];     //By default the first one will have the class and second will not



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
                
                return tag_structure_file;         //returning the template file from getQuestonInfo using question 

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
                url = post_descriptive_questions_API;
                body =  [{
                    "title": $scope.question.questionText,
                    "description": $scope.question.questionDescription,
                    "difficulty_level": $scope.question.difficulty,
                    "kind": descriptive_kind,
                    "answer": $scope.question.questionAnswer
                }];
                $http.post( url, body)
                     .success(function(data,status,header,config) {
                            console.log("Descriptive question posted successfully.ID:"+data[0].id);        //on successfull posting of question
                            
                            var myAlert = $alert({title: 'Posted Question successfully!', content: 'The Question ID is :'+data[0].id, placement:'alert-box', type: 'success', show: true,duration:15});

                            var categoryBody = [];      //Will store the body of the url to add categories

                            for(i=0;i < $scope.tags.tagsNamesToAddToQuestion.length ;i++) {
                                var singleTag = {
                                    "categoryId": categoryDict[$scope.tags.tagsNamesToAddToQuestion[i]]
                                }
                                categoryBody.push(singleTag);       //Add single category to the body to create an array of categories
                            }

                            console.log(categoryBody);

                            var addCategoryURL = questions_API+"/"+data[0].id+"/category";

                            $http.post(addCategoryURL,categoryBody)
                            .success(function(data,status,header,config) {
                                console.log("Categories posted successfully");
                            })

                        })
                     .error(function(response) {
                        console.log("The question could not be posted");                //in case there is an error
                        var myAlert = $alert({title: 'Error in posting question!', content: 'Check the logs to know more.', placement:'alert-box', type: 'danger', show: true,duration:15});

                     });
            }

            $scope.postMCQQuestion = function () {
                console.log("Trying to post MCQ question...");
                if(!$scope.question.questionText) {
                    alert("Question has to have a title!");
                    return;
                }
                //url = "http://localhost:8000/question/question_mcq/";
                post_mcq_questions_Body =  [{
                    "title": $scope.question.questionText,
                    "difficulty_level": $scope.question.difficulty,
                    "kind": mcq_kind,
                }];
                $http.post( post_mcq_Questions_API, post_mcq_questions_Body)
                    .success(function(data,status,header,config) {
                        
                        $scope.postResponse = data[0];
                        console.log("Question posted successfully. ID is:"+$scope.postResponse.id);
                        var myAlert = $alert({title: 'Posted Question successfully!', content: 'The Question ID is :'+data[0].id, placement:'alert-box', type: 'success', show: true,duration:15});


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
                            choiceBody.push(singleChoice);

                        }


                        $http.post(question_add_choices_API,choiceBody)
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

                        $http.post(addCategoryURL,categoryBody)
                            .success(function(data,status,header,config) {
                                console.log("Categories posted successfully");
                        })

                    })
                    .error(function(response) {
                        console.log("The question could not be posted");
                            //Delete the question since choices were not added!
                            var myAlert = $alert({title: 'Error in posting question!', content: 'Check the logs to know more.', placement:'alert-box', type: 'danger', show: true,duration:15});

                     });
            }

        });



//Ankurs angular code
//
//app.factory('sharedEducationInfoService', function($rootScope){
//    var educationInfoSharedService ={};
//    educationInfoSharedService.eduInstituteName = ''
//    educationInfoSharedService.degreeLevel = ''
//    educationInfoSharedService.percentageObtained = ''
//    educationInfoSharedService.location = ''
//    educationInfoSharedService.yearOfGraduation = ''
//    educationInfoSharedService.educationDescription = ''
//
//
//    educationInfoSharedService.prepForBroadcastGeneralInfo = function(eduInstituteName,degreeLevel,percentageObtained,location,yearOfGraduation,educationDescription){
//        this.eduInstituteName = eduInstituteName;
//        this.degreeLevel = degreeLevel;
//        this.percentageObtained = percentageObtained;
//        this.location = location;
//        this.yearOfGraduation = yearOfGraduation;
//        this.educationDescription = educationDescription;
//        this.broadcastItem();
//    };
//
//    educationInfoSharedService.broadcastItem = function(){
//        $rootScope.$broadcast('handleBroadcast');
//    };
//
//    return educationInfoSharedService;
//});
//
////app.controller('controllerEducationInfo',function($scope){
////    $scope.units = [
////        {'id': 1, 'label': 'Graduated'},
////        {'id': 2, 'label': 'Graduating'},
////        {'id': 3, 'label': 'Enrolled'},
////        {'id': 3, 'label': 'Deffered'},
////        {'id': 3, 'label': 'Transferred'},
////    ]
////     $scope.data= $scope.units[0];
////});
//
//app.controller('controllerEducationInfo',['$scope','sharedEducationInfoService',function($scope, educationInfoSharedService){
//    $scope.units = [
//        {'id': 1, 'label': 'Graduated'},
//        {'id': 2, 'label': 'Graduating'},
//        {'id': 3, 'label': 'Enrolled'},
//        {'id': 3, 'label': 'Deffered'},
//        {'id': 3, 'label': 'Transferred'},
//    ]
//     $scope.data= $scope.units[0];
//    $scope.handleClick = function(eduInstituteName,degreeLevel,percentageObtained,location,yearOfGraduation,educationDescription){
//        educationInfoSharedService.prepForBroadcastGeneralInfo(eduInstituteName,degreeLevel,percentageObtained,location,yearOfGraduation,educationDescription);
//    };
//
//    $scope.$on('handleBroadcast',function(){
//        $scope.eduInstituteName = educationInfoSharedService.eduInstituteName;
//        $scope.degreeLevel = educationInfoSharedService.degreeLevel;
//        $scope.percentageObtained = educationInfoSharedService.percentageObtained;
//        $scope.location = educationInfoSharedService.location;
//        $scope.yearOfGraduation = educationInfoSharedService.yearOfGraduation;
//        $scope.educationDescription = educationInfoSharedService.educationDescription;
//    });
//}]);
//
//
//
//
//
//app.controller('controllerEducationInfoToDisplayData',['$scope','sharedEducationInfoService',function($scope, educationInfoSharedService){
//    $scope.$on('handleBroadcast',function(){
//        $scope.educationInfoDisplay = [];
//        $scope.eduInstituteName = educationInfoSharedService.eduInstituteName;
//        $scope.degreeLevel = educationInfoSharedService.degreeLevel;
//        $scope.percentageObtained = educationInfoSharedService.percentageObtained;
//        $scope.location = educationInfoSharedService.location;
//        $scope.yearOfGraduation = educationInfoSharedService.yearOfGraduation;
//        $scope.educationDescription = educationInfoSharedService.educationDescription;
//        $scope.educationInfoDisplay.push({eduInstituteName:$scope.eduInstituteName,degreeLevel:$scope.degreeLevel,percentageObtained:$scope.percentageObtained,location:$scope.location,yearOfGraduation:$scope.yearOfGraduation,educationDescription:$scope.educationDescription});
//
//        $scope.eduInstituteName = '';
//        $scope.degreeLevel = '';
//        $scope.percentageObtained = '';
//        $scope.location = '';
//        $scope.yearOfGraduation = '';
//        $scope.educationDescription = '';
//    });
//
//
//}]);
//
//
////
//
//app.factory('sharedResumeGeneralInfoService', function($rootScope){
//    var generalInfoSharedService ={};
//    generalInfoSharedService.nameOnResume = ''
//    generalInfoSharedService.email = ''
//    generalInfoSharedService.mobileNumber = ''
//    generalInfoSharedService.address = ''
//
//    generalInfoSharedService.prepForBroadcastGeneralInfo = function(nameOnResume,email,mobileNumber,address){
//        this.nameOnResume = nameOnResume;
//        this.email = email;
//        this.mobileNumber = mobileNumber;
//        this.address = address;
//        this.broadcastItem();
//    };
//
//    generalInfoSharedService.broadcastItem = function(){
//        $rootScope.$broadcast('handleBroadcast');
//    };
//
//    return generalInfoSharedService;
//});
//
//app.controller('controllerGeneralInfo',['$scope','sharedResumeGeneralInfoService',function($scope, generalInfoSharedService){
//    $scope.handleClick = function(nameOnResume,email,mobileNumber,address){
//        generalInfoSharedService.prepForBroadcastGeneralInfo(nameOnResume,email,mobileNumber,address);
//    };
//
//    $scope.$on('handleBroadcast',function(){
//        $scope.nameOnResume = generalInfoSharedService.nameOnResume;
//        $scope.email = generalInfoSharedService.email;
//        $scope.mobileNumber = generalInfoSharedService.mobileNumber;
//        $scope.address = generalInfoSharedService.address;
//    });
//}]);
//
//
//app.controller('controllerGeneralInfoToDisplayData',['$scope','sharedResumeGeneralInfoService',function($scope, generalInfoSharedService){
//    $scope.$on('handleBroadcast',function(){
//        $scope.nameOnResume = generalInfoSharedService.nameOnResume;
//        $scope.email = generalInfoSharedService.email;
//        $scope.mobileNumber = generalInfoSharedService.mobileNumber;
//        $scope.address = generalInfoSharedService.address;
//    });
//}]);
//
//
////controllerGeneralInfo.$injector = ['$scope','sharedResumeGeneralInfoService'];
////controllerGeneralInfoToDisplayData.$injector = ['$scope','sharedResumeGeneralInfoService'];
//
////app.controller('wysiwygeditor',function($scope) {
////      $scope.orightml = '';
////      $scope.htmlcontent = $scope.orightml;
////        $scope.disabled = false;
////  });
//
//app.factory('sharedObjectiveInfoService', function($rootScope){
//    var ObjectiveInfoSharedService ={};
//    ObjectiveInfoSharedService.objective = ''
//
//    ObjectiveInfoSharedService.prepForBroadcastObjectiveInfo = function(objective){
//        this.objective = objective;
//        this.broadcastItem();
//    };
//
//    ObjectiveInfoSharedService.broadcastItem = function(){
//        $rootScope.$broadcast('handleBroadcast');
//    };
//
//    return ObjectiveInfoSharedService;
//});
//
//app.controller('controllerObjectiveInfo',['$scope','sharedObjectiveInfoService',function($scope, ObjectiveInfoSharedService){
//    $scope.handleClick = function(objective){
//        ObjectiveInfoSharedService.prepForBroadcastObjectiveInfo(objective);
//    };
//
//    $scope.$on('handleBroadcast',function(){
//        $scope.objective = ObjectiveInfoSharedService.objective;
//    });
//}]);
//
//
//app.controller('controllerObjectiveInfoToDisplayData',['$scope','sharedObjectiveInfoService',function($scope, ObjectiveInfoSharedService){
//    $scope.$on('handleBroadcast',function(){
//        $scope.objective = ObjectiveInfoSharedService.objective;
//    });
//}]);
//
//
////Hobbies
//
//app.factory('sharedHobbiesInfoService', function($rootScope){
//    var HobbiesInfoSharedService ={};
//    HobbiesInfoSharedService.hobbies = ''
//
//    HobbiesInfoSharedService.prepForBroadcastHobbiesInfo = function(hobbies){
//        this.hobbies = hobbies;
//        this.broadcastItem();
//    };
//
//    HobbiesInfoSharedService.broadcastItem = function(){
//        $rootScope.$broadcast('handleBroadcast');
//    };
//
//    return HobbiesInfoSharedService;
//});
//
//app.controller('controllerHobbiesInfo',['$scope','sharedHobbiesInfoService',function($scope, HobbiesInfoSharedService){
//    $scope.handleClick = function(hobbies){
//        HobbiesInfoSharedService.prepForBroadcastHobbiesInfo(hobbies);
//    };
//
//    $scope.$on('handleBroadcast',function(){
//        $scope.hobbies = HobbiesInfoSharedService.hobbies;
//    });
//}]);
//
//
//app.controller('controllerHobbiesInfoToDisplayData',['$scope','sharedHobbiesInfoService',function($scope, HobbiesInfoSharedService){
//    $scope.$on('handleBroadcast',function(){
//        $scope.hobbies = HobbiesInfoSharedService.hobbies;
//    });
//}]);
//
////ProfessionalSkills
//
////app.controller('controllerProfessionalSkills',function($scope){
////    $scope.units = [
////        {'id': 1, 'label': 'Beginner'},
////        {'id': 2, 'label': 'Intermediate'},
////        {'id': 3, 'label': 'Advanced'},
////        {'id': 3, 'label': 'Expert'},
////    ]
////
////           $scope.data= $scope.units[0]; // Set by default the value "test1
////});
//
//app .controller("controllerProfessionalSkills", function($scope,$rootScope) {
//    $scope.skills = [];
//    $rootScope.allSkills = [];
//    $scope.level = [];
//     $scope.units = [
//        {'id': 1, 'label': 'Beginner'},
//        {'id': 2, 'label': 'Intermediate'},
//        {'id': 3, 'label': 'Advanced'},
//        {'id': 3, 'label': 'Expert'},
//    ]
//     $scope.data= $scope.units[0]; // Set by default the value "test1
//    $scope.addItem123 = function () {
//        $scope.skills.push($scope.addSkillType);
//        $scope.level.push($scope.data);
//        $rootScope.allSkills.push({levele:$scope.data,skill:$scope.addSkillType});
//        $scope.addSkillType = '';
//        $scope.data= $scope.units[0];
//    }
//    $scope.removeItem = function (x) {
//        $rootScope.allSkills.splice(x, 1);
//    }
//});
//
////LanguagesKnown
//
//app .controller("controllerLanguagesSkills", function($scope,$rootScope) {
//    $scope.language = [];
//    $rootScope.allLanguages = [];
//    $scope.level = [];
//     $scope.units = [
//        {'id': 1, 'label': 'Beginner'},
//        {'id': 2, 'label': 'Conversational'},
//        {'id': 3, 'label': 'Fluent'},
//        {'id': 3, 'label': 'Native'},
//    ]
//     $scope.data= $scope.units[0]; // Set by default the value "test1
//    $scope.addItem = function () {
//        $scope.language.push($scope.languages);
//        $scope.level.push($scope.data);
//        $rootScope.allLanguages.push({level:$scope.data,lang:$scope.languages});
//        $scope.languages = '';
//        $scope.data= $scope.units[0];
//    }
//    $scope.removeItem = function (x) {
//        $rootScope.allLanguages.splice(x, 1);
//    }
//});
//
////Employment
//
//app .controller("controllerEmploymentSkills", function($scope,$rootScope) {
//    $scope.showAdditionOfEmployment = false;
//    $rootScope.jobTitles = [];
//    $scope.companies = [];
//    $scope.locations = [];
//    $scope.startDates = [];
//    $scope.endDates = [];
//    $scope.compensations = [];
//    $scope.employmentDescriptions = [];
//    $scope.currency = [];
//    $scope.intervals = [];
//    $rootScope.employmentRelatedInformations = [];
//    $scope.units1 = [
//        {'id': 1, 'label': 'USD'},
//        {'id': 2, 'label': 'EUR'},
//        {'id': 3, 'label': 'GBP'},
//        {'id': 3, 'label': 'CAD'},
//        {'id': 3, 'label': 'AUD'},
//        {'id': 3, 'label': 'CNY'},
//        {'id': 3, 'label': 'UAH'},
//        {'id': 3, 'label': 'RUB'},
//    ]
//     $scope.data1= $scope.units1[0];
//
//    $scope.units2 = [
//        {'id': 1, 'label': 'Annually'},
//        {'id': 2, 'label': 'Monthly'},
//        {'id': 3, 'label': 'Daily'},
//        {'id': 3, 'label': 'Hourly'},
//    ]
//     $scope.data2= $scope.units2[0];
//
//    $scope.addEmployment = function(){
//        $scope.showAdditionOfEmployment = $scope.showAdditionOfEmployment ? false : true;
//    }addItem
//
//    $scope.addTheList = function(){
//        $rootScope.jobTitles.push($scope.jobTitle);
//        $scope.companies.push($scope.company);
//        $scope.locations.push($scope.location);
//        $scope.startDates.push($scope.startDate);
//        $scope.endDates.push($scope.endDate);
//        $scope.compensations.push($scope.compensation);
//        $scope.employmentDescriptions.push($scope.employmentDescription);
//        $scope.currency.push($scope.data1);
//        $scope.intervals.push($scope.data2);
//        $rootScope.employmentRelatedInformations.push({jobTitle:$scope.jobTitle,company:$scope.company,location:$scope.location,starDate:$scope.startDate,endDate:$scope.endDate,compensation:$scope.compensation,currency:$scope.data1,intervals:$scope.data2,Description:$scope.employmentDescription});
//        $scope.jobTitle = '';
//        $scope.company = '';
//        $scope.location = '';
//        $scope.startDate = '';
//        $scope.endDate = '';
//        $scope.compensation = '';
//        $scope.employmentDescription = '';
//        $scope.data1= $scope.units1[0];
//        $scope.data2= $scope.units2[0];
//        $scope.showAdditionOfEmployment = $scope.showAdditionOfEmployment ? false : true;
//    }
//
//    $scope.removeItem = function (x) {
//        $rootScope.employmentRelatedInformations.splice(x, 1);
//        console.log($scope.employmentRelatedInformations);
//    }
//});
//
////Reference
//
//app .controller("controllerReferences", function($scope,$rootScope) {
//    $scope.showAdditionOfReferences = false;
//    $scope.name = [];
//    $scope.relationship = [];
//    $scope.phone = [];
//    $scope.company = [];
//    $scope.email = [];
//    $scope.address = [];
//    $scope.address1 = [];
//    $scope.descriptions = [];
//    $rootScope.referenceRelatedInformations = [];
//
//    $scope.addReferences = function(){
//        $scope.showAdditionOfReferences = $scope.showAdditionOfReferences ? false : true;
//    }
//
//    $scope.addTheList = function(){
//        $scope.name.push($scope.referenceName);
//        $scope.relationship.push($scope.referenceRelationship);
//        $scope.phone.push($scope.referencePhone);
//        $scope.company.push($scope.referenceCompany);
//        $scope.email.push($scope.referenceEmailID);
//        $scope.address.push($scope.referenceAddress);
//        $scope.address1.push($scope.referenceAddress1);
//        $scope.descriptions.push($scope.referenceDescription);
//        $rootScope.referenceRelatedInformations.push({referenceName:$scope.referenceName,referenceRelationship:$scope.referenceRelationship,referencePhone:$scope.referencePhone,referenceCompany:$scope.referenceCompany,referenceEmailID:$scope.referenceEmailID,referenceAddress:$scope.referenceAddress,referenceAddress1:$scope.referenceAddress1,referenceDescription:$scope.referenceDescription});
//        $scope.referenceName = '';
//        $scope.referenceRelationship = '';
//        $scope.referencePhone = '';
//        $scope.referenceCompany = '';
//        $scope.referenceEmailID = '';
//        $scope.referenceAddress = '';
//        $scope.referenceAddress1 = '';
//        $scope.referenceDescription = '';
//        $scope.showAdditionOfReferences = $scope.showAdditionOfReferences ? false : true;
//    }
//
//    $scope.removeItem = function (x) {
//        $rootScope.referenceRelatedInformations.splice(x, 1);
//    }
//});

///new code

app.controller('controllerGeneralInfoToDisplayData',function($scope,$rootScope,$http,$location){
            $scope.selectedSection = "basic_info.html";
            $scope.language = [];
            $rootScope.allLanguages = [];
            $scope.level = [];
            $scope.saveEducationChanges = false;
            $scope.addingEducation = true;
            $scope.showRemove = true;
//            $scope.showRemoveEdu = true;
            $scope.addingEmployment = true;
            $scope.saveEmploymentChanges = false;
            $scope.saveAddSkill = true;
            $scope.showAddSkill = true;
            $scope.showAdditonOfSkillsOperation = true;
            $scope.addingReferences = true;
            $scope.saveReferenceChanges = false;
            $scope.showAddLanguages = true;
            $scope.saveKnownLanguages = true;
            $scope.showAdditonOfLanguagesOperation = true;

            if($scope.nameOnResume == "" || $scope.email == "" || $scope.mobileNumber == "" || $scope.address == "" ){
                alert("Please enter the complete information to proceed");
            }


            //generalInfo

            $scope.nameOnResume = '';
            $scope.email = '';
            $scope.mobileNumber = '';
            $scope.address = '';

            //references
                $scope.showAdditionOfReferences = false;
                $scope.name = [];
                $scope.relationship = [];
                $scope.phone = [];
                $scope.company = [];
                $scope.email = [];
                $scope.address = [];
                $scope.address1 = [];
                $scope.descriptions = [];
                $rootScope.referenceRelatedInformations = [];
            $scope.changeSelectedResumeSection = function(section) {
                $scope.selectedSection = section;
            }

            //professionalSkills

                $scope.skills = [];
                $rootScope.allSkills = [];
                $scope.level = [];
                 $scope.units321 = [
                    {'id': 1, 'label': 'Beginner'},
                    {'id': 2, 'label': 'Intermediate'},
                    {'id': 3, 'label': 'Advanced'},
                    {'id': 3, 'label': 'Expert'},
                ]
                 $scope.data321= $scope.units321[0]; // Set by default the value "test1

            //employmentHistory

                     $scope.showAdditionOfEmployment = false;
                     $rootScope.jobTitles = [];
                     $scope.companies = [];
                     $scope.locations = [];
                     $scope.startDates = [];
                     $scope.endDates = [];
                     $scope.compensations = [];
                     $scope.employmentDescriptions = [];
                     $scope.currency = [];
                     $scope.intervals = [];
                     $rootScope.employmentRelatedInformations = [];
                     $scope.units1 = [
                         {'id': 1, 'label': 'USD'},
                         {'id': 2, 'label': 'EUR'},
                         {'id': 3, 'label': 'GBP'},
                         {'id': 3, 'label': 'CAD'},
                         {'id': 3, 'label': 'AUD'},
                         {'id': 3, 'label': 'CNY'},
                         {'id': 3, 'label': 'UAH'},
                         {'id': 3, 'label': 'RUB'},
                     ]
                      $scope.data1= $scope.units1[0];

                     $scope.units2 = [
                         {'id': 1, 'label': 'Annually'},
                         {'id': 2, 'label': 'Monthly'},
                         {'id': 3, 'label': 'Daily'},
                         {'id': 3, 'label': 'Hourly'},
                     ]
                      $scope.data2= $scope.units2[0];

            //education
                $scope.showAdditionOfEducation = false;
                $scope.eduInstitutes = [];
                $scope.degrees = [];
                $scope.percentageObtain = [];
                $scope.locations = [];
                $scope.yearOfGraduations = [];
                $scope.educationDescriptions = [];
                $scope.levels=[];
                $rootScope.educationRelatedInformations = [];

                    $scope.units3 = [
                        {'id': 1, 'label': 'Graduated'},
                        {'id': 2, 'label': 'Graduating'},
                        {'id': 3, 'label': 'Enrolled'},
                        {'id': 3, 'label': 'Deffered'},
                        {'id': 3, 'label': 'Transferred'},
                    ]
                     $scope.data= $scope.units3[0];



            $scope.returnSelectedResumeSection = function() {
                return absolute_path+"ResumeBuilder/subSections/"+ $scope.selectedSection;
            }

            $scope.units = [
                    {'id': 1, 'label': 'Beginner'},
                    {'id': 2, 'label': 'Conversational'},
                    {'id': 3, 'label': 'Fluent'},
                    {'id': 3, 'label': 'Native'},
                ]
                 $scope.data= $scope.units[0]; // Set by default the value "test1
                $scope.addItem = function () {
                    $scope.language.push($scope.languages);
                    $scope.level.push($scope.data);
                    $rootScope.allLanguages.push({level:$scope.data,lang:$scope.languages});
                    $scope.languages = '';
                    $scope.data= $scope.units[0];
                }
                $scope.removeItemLanguages = function (x) {
                    $rootScope.allLanguages.splice(x, 1);
                }

                    $scope.addReferences = function(){
                        $scope.showAdditionOfReferences = $scope.showAdditionOfReferences ? false : true;
                    }

                    $scope.addTheListReferences = function(){
                    if($scope.referenceName == null || $scope.referenceName == "" || $scope.referenceRelationship == "" || $scope.referencePhone == "" || $scope.referenceCompany == "" || $scope.referenceEmailID == "" || $scope.referenceAddress == ""){
                                                        alert("Please Enter the required information");
                                                    }else{
                                                        $scope.saveReferenceChanges = true;

                        $scope.name.push($scope.referenceName);
                        $scope.relationship.push($scope.referenceRelationship);
                        $scope.phone.push($scope.referencePhone);
                        $scope.company.push($scope.referenceCompany);
                        $scope.email.push($scope.referenceEmailID);
                        $scope.address.push($scope.referenceAddress);
                        $scope.address1.push($scope.referenceAddress1);
                        $scope.descriptions.push($scope.referenceDescription);
                        $rootScope.referenceRelatedInformations.push({referenceName:$scope.referenceName,referenceRelationship:$scope.referenceRelationship,referencePhone:$scope.referencePhone,referenceCompany:$scope.referenceCompany,referenceEmailID:$scope.referenceEmailID,referenceAddress:$scope.referenceAddress,referenceAddress1:$scope.referenceAddress1,referenceDescription:$scope.referenceDescription});
                        $scope.referenceName = '';
                        $scope.referenceRelationship = '';
                        $scope.referencePhone = '';
                        $scope.referenceCompany = '';
                        $scope.referenceEmailID = '';
                        $scope.referenceAddress = '';
                        $scope.referenceAddress1 = '';
                        $scope.referenceDescription = '';
                        $scope.showAdditionOfReferences = $scope.showAdditionOfReferences ? false : true;
                    }
                    }

                    $scope.removeItemReferences = function (x) {
                        $rootScope.referenceRelatedInformations.splice(x, 1);
                    }

                        $scope.addItem123 = function () {
                            $scope.skills.push($scope.addSkillType);
                            $scope.level.push($scope.data);
                            $rootScope.allSkills.push({levele:$scope.data,skill:$scope.addSkillType});
                            $scope.addSkillType = '';
                            $scope.data= $scope.units[0];
                        }
                        $scope.removeItemSkills = function (x) {
                            $rootScope.allSkills.splice(x, 1);
                        }


                            $scope.addEmployment = function(){
                                $scope.showAdditionOfEmployment = $scope.showAdditionOfEmployment ? false : true;
                            }

                            $scope.addTheListEmployment = function(){
                                if($scope.jobTitle == "" || $scope.company == "" || $scope.location == "" || $scope.startDate == "" || $scope.endDate == "" || $scope.compensation == ""){
                                    alert("Please fill in the Required information");
                                }else{
                                    $scope.saveEmploymentChanges = true;

                                $rootScope.jobTitles.push($scope.jobTitle);
                                $scope.companies.push($scope.company);
                                $scope.locations.push($scope.location);
                                $scope.startDates.push($scope.startDate);
                                $scope.endDates.push($scope.endDate);
                                $scope.compensations.push($scope.compensation);
                                $scope.employmentDescriptions.push($scope.employmentDescription);
                                $scope.currency.push($scope.data1);
                                $scope.intervals.push($scope.data2);
                                $rootScope.employmentRelatedInformations.push({jobTitle:$scope.jobTitle,company:$scope.company,location:$scope.location,starDate:$scope.startDate,endDate:$scope.endDate,compensation:$scope.compensation,currency:$scope.data1,intervals:$scope.data2,Description:$scope.employmentDescription});
                                $scope.jobTitle = '';
                                $scope.company = '';
                                $scope.location = '';
                                $scope.startDate = '';
                                $scope.endDate = '';
                                $scope.compensation = '';
                                $scope.employmentDescription = '';
                                $scope.data1= $scope.units1[0];
                                $scope.data2= $scope.units2[0];
                                $scope.showAdditionOfEmployment = $scope.showAdditionOfEmployment ? false : true;
                            }
                            }

                            $scope.removeItem = function (x) {
                                $rootScope.employmentRelatedInformations.splice(x, 1);
                                console.log($scope.employmentRelatedInformations);
                            }

                            $scope.addEducation = function(){
                                $scope.showAdditionOfEducation = $scope.showAdditionOfEducation ? false : true;
                            }

                            $scope.addTheList = function(){
                                if($scope.eduInstituteName == "" || $scope.degreeLevel == "" || $scope.percentageObtained == "" || $scope.location == "" || $scope.yearOfGraduation == "" ){
                                    alert("Please enter the required information to proceed");
                                }else{
                                    $scope.saveEducationChanges = true;

                                $scope.eduInstitutes.push($scope.eduInstituteName);
                                $scope.degrees.push($scope.degreeLevel);
                                $scope.percentageObtain.push($scope.percentageObtained);
                                $scope.locations.push($scope.location);
                                $scope.yearOfGraduations.push($scope.yearOfGraduation);
                                $scope.educationDescriptions.push($scope.educationDescription);
                                $scope.levels.push($scope.data);
                                $rootScope.educationRelatedInformations.push({eduInstituteName:$scope.eduInstituteName,degreelevel:$scope.degreeLevel,percentageObtained:$scope.percentageObtained,location:$scope.location,yearOfGraduation:$scope.yearOfGraduation,levels:$scope.data,educationDescription:$scope.educationDescription});

                                $scope.eduInstituteName = '';
                                $scope.degreeLevel = '';
                                $scope.percentageObtained = '';
                                $scope.location = '';
                                $scope.yearOfGraduation = '';
                                $scope.educationDescription = '';
                                $scope.data= $scope.units1[0];
                                $scope.showAdditionOfEducation = $scope.showAdditionOfEducation ? false : true;
                            }
                            }

                            $scope.removeItem = function (x) {
                                $rootScope.educationRelatedInformations.splice(x, 1);
                                console.log($scope.educationRelatedInformations);
                            }

                            $scope.removeItemEmp = function (x) {
                                                            $rootScope.employmentRelatedInformations.splice(x, 1);
                                                            console.log($scope.employmentRelatedInformations);
                                                        }

                             $scope.sendBasicInfoData = function(){
                             if($scope.nameOnResume == "" || $scope.email == "" || $scope.mobileNumber == "" || $scope.address == ""){
                                alert("Please enter the complete information to proceed");
                             }
                             else{
                                            var basicInformation = {
                                                Full_Name : $scope.nameOnResume,
                                                Email_Address : $scope.email,
                                                Mobile_Number : $scope.mobileNumber,
                                                Resident_Address : $scope.address
                                            }
                                            console.log("Information")
                                            console.log(basicInformation);
                                            $http.post("http://localhost:8080/v1/api/resume/",basicInformation,{headers: {'Content-Type': 'application/json'} })
                                            .success(function(data,status,header,config) {
                                                console.log("Information Posted Successfully");
                                                $scope.resumeID = data;
                                            })
                                            .error(function(data,status,header,config) {
                                                console.log("Error Encountered while posting : "+status);
                                            });
                                 }
                             };

                             $scope.handleClick = function(objective){
                                $scope.saveButtonObjective = true;
                                $scope.editButtonObjective = true;
                                $scope.saveButtonHobbies = true;
                                $scope.editButtonHobbies = true;
                             };

                             $scope.saveObjectiveInfo = function(){
                                $scope.saveButtonObjective = false;
                                $scope.editButtonObjective = false;
                                var objective = {
                                    Objective_Explanation : $scope.objective
                                }
                                console.log(objective);
                                $http.put("http://localhost:8080/v1/api/resume/"+$scope.resumeID,objective,{headers: {'Content-Type': 'application/json'} })
                                .success(function(data,status,header,config) {
                                    console.log("Information Posted Successfully");
                                })
                                .error(function(data,status,header,config) {
                                    console.log("Error Encountered while posting : "+status);
                                });
                             }

                             $scope.postEducationData = function(){
                                $scope.showRemove = false;
                                $scope.addingEducation = false;
                                var Education = $rootScope.educationRelatedInformations;
                                console.log(Education);
                                $http.put("http://localhost:8080/v1/api/resume/"+$scope.resumeID,Education,{headers: {'Content-Type': 'application/json'} })
                                .success(function(data,status,header,config) {
                                    console.log("Information Posted Successfully");
                                })
                                .error(function(data,status,header,config) {
                                    console.log("Error Encountered while posting : "+status);
                                });
                             }

                             $scope.postReferencesData = function(){
                                $scope.showRemove = false;
                                $scope.addingReferences = false;
                                var References = $rootScope.referenceRelatedInformations;
                                console.log(References);
                                $http.put("http://localhost:8080/v1/api/resume/"+$scope.resumeID,References,{headers: {'Content-Type': 'application/json'} })
                                .success(function(data,status,header,config) {
                                    console.log("Information Posted Successfully");
                                })
                                .error(function(data,status,header,config) {
                                    console.log("Error Encountered while posting : "+status);
                                });
                             }

                             $scope.postEmploymentData = function(){
                                $scope.showRemove = false;
                                $scope.addingEmployment = false;
                                var Employment = $rootScope.employmentRelatedInformations;
                                console.log(Employment);
                                $http.put("http://localhost:8080/v1/api/resume/"+$scope.resumeID,Employment,{headers: {'Content-Type': 'application/json'} })
                                                                .success(function(data,status,header,config) {
                                                                    console.log("Information Posted Successfully");
                                                                })
                                                                .error(function(data,status,header,config) {
                                                                    console.log("Error Encountered while posting : "+status);
                                                                });

                             }

                             $scope.saveHobbiesInfo = function(){
                                                             $scope.saveButtonHobbies = false;
                                                             $scope.editButtonHobbies = false;
                                                             var Hobbies_And_Interest = {
                                                                 HobbiesAndInterest : $scope.hobbies
                                                             }
                                                             console.log(Hobbies_And_Interest);
                                                             $http.put("http://localhost:8080/v1/api/resume/"+$scope.resumeID,Hobbies_And_Interest,{headers: {'Content-Type': 'application/json'} })
                                                             .success(function(data,status,header,config) {
                                                                 console.log("Information Posted Successfully");
                                                             })
                                                             .error(function(data,status,header,config) {
                                                                 console.log("Error Encountered while posting : "+status);
                                                             });
                                                          }

                             $scope.saveSkills = function(){
                                if($rootScope.allSkills.length == 0){
                                    alert("Please enter you skill to add more value to Resume");
                                }
                                else{
                                    $scope.showAddSkill = false;
                                    $scope.saveAddSkill = false;
                                    $scope.showRemove = false;
                                    $scope.showAdditonOfSkillsOperation = false;
                                    var professionalSkills = [];
                                    for(var i =0;i<$rootScope.allSkills.length;i++){
                                        var data = $rootScope.allSkills[i];
                                        professionalSkills.push({"skillType":data.skill,"level":data.levele.label});
                                    }
                                    console.log(professionalSkills);
                                    $http.put("http://localhost:8080/v1/api/resume/"+$scope.resumeID,professionalSkills,{headers: {'Content-Type': 'application/json'} })
                                                                                                 .success(function(data,status,header,config) {
                                                                                                     console.log("Information Posted Successfully");
                                                                                                 })
                                                                                                 .error(function(data,status,header,config) {
                                                                                                     console.log("Error Encountered while posting : "+status);
                                                                                                 });
                                }
                             }

                             $scope.saveLanguagesKnown = function(){
                                if($rootScope.allLanguages.length == 0){
                                    alert("Please enter the languages you know to add more value to Resume");
                                }
                                else{
                                    $scope.showAddLanguages = false;
                                    $scope.saveKnownLanguages = false;
                                    $scope.showRemove = false;
                                    $scope.showAdditonOfLanguagesOperation = false;
                                    var languages = [];
                                    for(var i =0;i<$rootScope.allLanguages.length;i++){
                                       var data = $rootScope.allLanguages[i];
                                       languages.push({"name":data.lang,"level":data.level.label});
                                    }
                                    console.log(languages);
                                    $http.put("http://localhost:8080/v1/api/resume/"+$scope.resumeID,languages,{headers: {'Content-Type': 'application/json'} })
                                         .success(function(data,status,header,config) {
                                             console.log("Information Posted Successfully");
                                         })
                                         .error(function(data,status,header,config) {
                                             console.log("Error Encountered while posting : "+status);
                                         });
                                }
                             }






});

