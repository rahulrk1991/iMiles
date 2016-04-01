
var app = angular
        .module("iMiles_Module",["ngRoute"])
        .config(function ($routeProvider,$locationProvider) {
            $routeProvider
            .when("/QnACrunch", {
                templateUrl: absolute_path+"QnACrunch/qnacrunch.html",
                controller:"questionsController"
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
        .controller("questionsController",function($scope,$http) {
            //get data using http
            $http.get(questions_API)
            .then(function(response) {
                var allQuestions = response.data;
                $scope.questions = allQuestions;            //Assigning the response data to questions in $scope object
                var dict = [];                              // dict['question id'] = choice
                for(var i=0;i<allQuestions.length;i++) {                //loop through the questions, and get the choices for each
                    var singleQuestion = allQuestions[i];
                    if(singleQuestion.kind==mcq_kind) {
                        //var the_url = 'http://localhost:8000/question/question_mcq/choice/'+singleQuestion.id;      //call to get choices
                        var the_url = questions_choices_mcq_API + singleQuestion.id;
                        $http.get(the_url)
                            .then(function(response) {
                                var allChoices = response.data;                     //get all the choices of a question in allChoices
                                dict[allChoices[0].question] = allChoices;          //allChoices[0]. question is the question id
                            })
                    }
                }
                $scope.choiceDict = dict;                   //assign this dictionary to the scope to access in the view

            });
            
            $scope.getQuestionTemplateByType = function(question) {
                
                return getQuestionInfo[question.kind].templateFile;         //returning the template file from getQuestonInfo using question 

            }

            $scope.validateChoice = function(question,choice) {     //returing if the selected choice is the correct choice
                alert(choice.is_correct);
            }
        })
        .controller("postQuestion",function($scope,$http) {

            //Scope Variables default values;
            $scope.question_types = question_types;
            $scope.load_question = getQuestionInfo[mcq_kind].postFragment;
            $scope.question = {};
            $scope.question.difficulty = DEFAULT_DIFFICULTY;
            $scope.number_of_choices = DEFAULT_NUMBER_OF_CHOICES;
            


            $scope.selectQuestionToPost = function(question_type) {
                    console.log(question_type);
                    $scope.load_question = getQuestionInfo[question_type].postFragment;     //Selects the template of the question to post
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

            $scope.postDescriptiveQuestion = function() {
                var x = $scope.questionText
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
                    "answer": "This is a dummy answer"
                }];
                $http.post( url, body)
                     .success(function(response) {
                        console.log("Descriptive question posted successfully");        //on successfull posting of question
                        alert("Question posted successfully");
                        })
                     .error(function(response) {
                        console.log("The question could not be posted");                //in case there is an error
                        alert("Error in posting question");
                     });
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

            //$scope.choices_MCQ = {};
            $scope.doSomethingElse = function() {                       //temporary function
                //x = $scope.choiceText
                console.log($scope.question.choices.choiceText);
                console.log($scope.question.choices.choicesCorrect);

                for(i=0;i<n;i++) {
                    if(!$scope.question.choices.choicesCorrect[i])
                        $scope.question.choices.choicesCorrect[i]=false;   
                }

                var choiceBody = [];

                for(i=0;i<n;i++) {
                    var text = $scope.question.choices.choiceText[i];
                    var isTrue = $scope.question.choices.choicesCorrect[i];
                    var singleChoice = {
                        "choiceText" : text,
                        "isTrue" : isTrue 
                    }
                    choiceBody[i] = singleChoice;

                }
                console.log(choiceBody);
                return choiceBody;
            }

            $scope.postMCQQuestion = function () {
                console.log("Trying to post MCQ question...");
                if(!$scope.question.questionText) {
                    alert("Question has to have a title!");
                    return;
                }
                url = "http://localhost:8000/question/question_mcq/";
                body =  [{
                    "title": $scope.question.questionText,
                    "difficulty_level": $scope.question.difficulty,
                    "kind": mcq_kind,
                }];
                $http.post( url, body)
                     .success(function(response) {
                        console.log("MCQ question posted successfully");

                        //Add the choices to the question here!

                        alert("Question posted successfully");
                        })
                     .error(function(response) {
                        console.log("The question could not be posted");
                        //Delete the questions since choices were not added!
                        alert("Error in posting question");
                     });
            }

        });