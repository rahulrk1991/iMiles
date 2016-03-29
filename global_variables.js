// GLOBAL VARIABLE FILE //

//APIs

//URL BUILDER
var protocol = "http://";
var host_name = "localhost";
var port_number = "8000";
var API_Start = protocol+host_name+":"+port_number;

//Questions API
var questions_End_Point = "/"+"question/question";
var questions_API = API_Start + questions_End_Point;

//Post MCQ questions
var post_mcq_questions_End_Point = "/"+"question/question_mcq/";
var post_mcq_Questions_API = API_Start + post_mcq_questions_End_Point;

//Post Descriptive questions
var post_descriptive_questions_End_Point = "/"+"question/question_des/";
var post_descriptive_questions_API = API_Start + post_descriptive_questions_End_Point;

//Choices of MCQ Questions API
var questions_choices_mcq_End_Point = "/"+"question/question_mcq/choice/";
var questions_choices_mcq_API = API_Start + questions_choices_mcq_End_Point;

//OTHER VARIABLES
var absolute_path = "iMiles/";

var mcq_kind = "mcq";
var descriptive_kind = "descriptive";
var question_types = [mcq_kind, descriptive_kind];

var getQuestionInfo = {};

    getQuestionInfo['mcq'] = {   
                                title : mcq_kind,
                                templateFile : absolute_path+"questionstructure_fragment_mcq.html",
                                postFragment : absolute_path+"questionpost_structure_MCQ.html"
                            };
    getQuestionInfo['descriptive'] = {
                                title : descriptive_kind,
                                templateFile : absolute_path+"questionstructure_fragment_descriptive.html",
                                postFragment : absolute_path+"questionpost_structure_non_MCQ.html"
                            };

var choice_structure_file = absolute_path+'choice_structure.html';
var DEFAULT_DIFFICULTY = 5;
var DEFAULT_NUMBER_OF_CHOICES = 4;
