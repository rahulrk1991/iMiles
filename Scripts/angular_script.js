
var app = angular
        .module("iMiles_Module",["ngRoute","mgcrea.ngStrap"])
        .config(function ($routeProvider,$locationProvider) {
            $routeProvider
            .when("/", {
                templateUrl: absolute_path+"LandingPage/landing_page.html"
            })
            .when("/ResumeBuilder", {
                templateUrl: absolute_path+"ResumeBuilder/resume_builder.html",
                controller:"questionsController"
            })
            .when("/QnACrunch", {
                templateUrl: absolute_path+"QnACrunch/DisplayQuestion/qnacrunch.html",
                controller:"questionsController"
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
        .controller("viewQuestionsController",function($scope,$http,$routeParams) {
            $scope.load_question = getQuestionInfo[$routeParams.kind].viewFragment;
            $scope.question = {};
            $scope.panel={};
            $scope.panel.title="Click here to view Solution";
            $scope.panel.body="Solution body";

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
                console.log($scope.question);
                console.log($scope.question.id);

            });

            $scope.getChoiceStructure = function() {
                return absolute_path+"QnACrunch/ViewQuestion/MCQTemplate/ChoiceTemplate/choice_structure.html"
            }

        })
        .controller("editQuestionsController",function($scope,$http,$routeParams) {
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
                body =  [{
                    "title": $scope.question.title,
                    "description": $scope.question.description,
                    "difficulty_level": $scope.question.difficulty_level,
                    "answer": $scope.question.answer
                }];
                $http.put( url, body)
                     .success(function(data,status,header,config) {
                        console.log("Descriptive question edited successfully");        //on successfull posting of question
                        alert("Question edited successfully");
                        })
                     .error(function(response) {
                        console.log("The question could not be edited");                //in case there is an error
                        alert("Error in editing question");
                     });
            }

            $scope.deleteQuestion = function() {
                $http.delete( url)
                     .success(function(response) {
                        console.log("Descriptive question deleted successfully");        //on successfull posting of question
                        alert("Question deleted successfully");
                        })
                     .error(function(response) {
                        console.log("The question could not be deleted");                //in case there is an error
                        alert("Error in deleted question");
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
        .controller("questionsController",function($scope,$http) {


            //Variable to display tags/search them in autocomplete search bar
            $scope.tags = {};
            $scope.tags.allTagNames = [];
            $scope.tags.allTagId = [];
            $scope.tags.tagsNamesToAddToQuestion = [];

            choiceDict = [];
            categoryDict = [];

            //Get all the question data using http get
            $http.get(questions_API)
                .then(function(response) {
                    var allQuestions = response.data;
                    $scope.questions = allQuestions;            //Assigning the response data to questions in $scope object
                    var dict = [];                              // dict['question id'] = choice
                    for(var i=0;i<allQuestions.length;i++) {                //loop through the questions, and get the choices for each
                        var singleQuestion = allQuestions[i];
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
                
                return getQuestionInfo[question.kind].templateFile;         //returning the template file from getQuestonInfo using question 

            }

            $scope.validateChoice = function(question,choice) {     //returing if the selected choice is the correct choice
                alert(choice.is_correct);
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