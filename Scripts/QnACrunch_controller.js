app.controller("questionsController",function($rootScope,$scope,$http,$sce,userService,$tooltip,$cookies,$alert,$anchorScroll) {

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
                        return className
                    default:
                        return "";
                }

            }


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
                            
                            var myAlert = $alert({title: "Question!"+question.id+" marked for later!", content: "", placement:'alert-box', type: 'success', show: true,duration:5});

                        })
                     .error(function(response) {
                        console.log("Error:Question could not be marked for later");                //in case there is an error
                        var myAlert = $alert({title: 'Error:Question could not be marked for later!', content: 'Check the logs to know more.', placement:'alert-box', type: 'danger', show: true,duration:5});

                     });

            }


            $scope.displaySolution = function(question) {

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
                                    }
                                }
                                else {
                                    $scope.questionIdToChoicesDictionary[question.id][i]["is_correct"] = false;
                                }
                                console.log($scope.questionIdToChoicesDictionary[question.id][i]);
                            }
                            var myAlert = $alert({title: "Question!"+question.id+" solved!", content: "", placement:'alert-box', type: 'success', show: true,duration:5});
                            question.isSolved = true;
                            question.isSelected = index;
                        })
                     .error(function(response) {
                        console.log("Error:Question could not be marked for later");                //in case there is an error
                        var myAlert = $alert({title: 'Error:Question could not be marked for later!', content: 'Check the logs to know more.', placement:'alert-box', type: 'danger', show: true,duration:5});

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
                    return "choice-red"
                }
            }

        })