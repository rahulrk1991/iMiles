// GLOBAL VARIABLE FILE //

//APIs

//URL BUILDER
var protocol = "http://";
var host_name ="interviewmiles.com";
var port_number = "80";
var API_Start = protocol+host_name+":"+port_number;

//Questions API
var questions_End_Point = "/api/"+"question/question";
var questions_API = API_Start + questions_End_Point;

//Category enabled Questions API
var category_enabled_questions_End_Point = "/api/"+"question/question/category/";
var category_enabled_questions_API = API_Start + category_enabled_questions_End_Point;

//Category enabled API
var category_enabled_End_Point = "/api/"+"question/category/";
var category_enabled_API = API_Start + category_enabled_End_Point;


//Post MCQ questions
var post_mcq_questions_End_Point = "/api/"+"question/question_mcq/";
var post_mcq_Questions_API = API_Start + post_mcq_questions_End_Point;

//Post Descriptive questions
var post_descriptive_questions_End_Point = "/api/"+"question/question_des/";
var post_descriptive_questions_API = API_Start + post_descriptive_questions_End_Point;

//Choices of MCQ Questions API
var questions_choices_mcq_End_Point = "/api/"+"question/question_mcq/choice/";
var questions_choices_mcq_API = API_Start + questions_choices_mcq_End_Point;

//Categories API
var question_categories_End_Point = "/api/"+"question/category/all/";
var question_categories_API = API_Start + question_categories_End_Point;

//Mark For Later API
var question_mark_Later_End_Point = "/api/"+"question/marklater/";
var question_mark_Later_API = API_Start + question_mark_Later_End_Point;

//Unmark API
var question_unmark_Later_End_Point = "/api/"+"question/unmarklater/";
var question_unmark_Later_API = API_Start + question_unmark_Later_End_Point;

//Add choices API
var question_add_choices_End_Point = "/api/"+"question/choice/";
var question_add_choices_API = API_Start + question_add_choices_End_Point;

var user_token_End_Point = "/api/"+"user/token/";
var user_token_API = API_Start + user_token_End_Point;

var user_registration_End_Point = "/api/"+"user/register/";
var user_registration_API = API_Start + user_registration_End_Point;

var user_login_End_Point = "/api/"+"user/login/";
var user_login_API = API_Start + user_login_End_Point;

var user_isAdmin_End_Point = "/api/"+"user/isadmin/";
var user_isAdmin_API = API_Start + user_isAdmin_API;

var user_info_End_Point = "/api/" + "user/profile/";
var user_info_API = API_Start + user_info_End_Point;

var user_logout_End_Point = "/api/"+"user/logout";
var user_logout_API = API_Start + user_logout_End_Point;

var user_isLoggedIn_End_Point = "/api/"+"user/isloggedin/";
var user_isLoggedIn_API = API_Start + user_isLoggedIn_End_Point;

var mock_mocks_End_point = "/api/"+"mock/mocks/";
var mock_mock_API = API_Start + mock_mocks_End_point;

var mock_myresults_End_Point = "/api/"+"mock/myresults";
var mock_myresults_API = API_Start + mock_myresults_End_Point;

var mock_allMocks_End_Point = "/api/"+"mock/mocks/all";
var mock_allMocks_API = API_Start + mock_allMocks_End_Point;

//OTHER VARIABLES
var absolute_path = "/";

var mcq_kind = "mcq";
var descriptive_kind = "descriptive";
var question_types = [mcq_kind, descriptive_kind];

var getQuestionInfo = {};

    getQuestionInfo['mcq'] = {   
                                title : mcq_kind,
                                templateFile : absolute_path+"QnACrunch/DisplayQuestion/MCQTemplate/questionstructure_fragment_mcq.html",
                                postFragment : absolute_path+"PostQuestion/MCQTemplate/"+"questionpost_structure_MCQ.html",
                                editFragment : absolute_path+"QnACrunch/EditQuestion/EditMCQTemplate/questionpost_structure_MCQ.html",
                                viewFragment : absolute_path+"QnACrunch/ViewQuestion/MCQTemplate/questionstructure_fragment_mcq.html",
                                onlineMockTestFragment : absolute_path+"OnlineMockTests/MCQTemplate/questionstructure_fragment_mcq.html",
                                markLaterTemplateFile : absolute_path+"MarkLater/questionstructure_fragment_mcq.html"
                            };
    getQuestionInfo['descriptive'] = {
                                title : descriptive_kind,
                                templateFile : absolute_path+"QnACrunch/DisplayQuestion/DescriptiveTemplate/questionstructure_fragment_descriptive.html",
                                postFragment : absolute_path+"PostQuestion/DescriptiveTemplate/"+"questionpost_structure_non_MCQ.html",
                                editFragment : absolute_path+"QnACrunch/EditQuestion/EditDescriptiveTemplate/questionpost_structure_non_MCQ.html",
                                viewFragment : absolute_path+"QnACrunch/ViewQuestion/DescriptiveTemplate/questionstructure_fragment_descriptive.html",
                                onlineMockTestFragment : absolute_path+"OnlineMockTests/DescriptiveTemplate/questionstructure_fragment_descriptive.html",
                                markLaterTemplateFile : absolute_path+"MarkLater/questionstructure_fragment_descriptive.html"
                            };

var choice_structure_file = absolute_path+"PostQuestion/MCQTemplate/ChoiceTemplate/"+"choice_structure.html";
var tag_structure_file_postQuestion = absolute_path+"PostQuestion/tagTemplate.html";
var tag_structure_file_qna = absolute_path+"QnACrunch/DisplayQuestion/tagTemplate.html";
var tag_structure_file_search_bar = absolute_path+"QnACrunch/DisplayQuestion/tagTemplateForSearchBar.html";
var tag_structure_file_example_box = absolute_path+"QnACrunch/DisplayQuestion/tagTemplateForExampleBox.html";
var mock_summary_panel_unsolved = absolute_path+"OnlineMockTests/mockSummaryPanelUnsolved.html";
var mock_summary_panel_solved = absolute_path+"OnlineMockTests/mockSummaryPanelSolved.html";
var puzzlingPuzzles_file = absolute_path+"PuzzlingPuzzles/DescriptiveTemplate/questionstructure_fragment_descriptive.html";
var DEFAULT_DIFFICULTY = 5;
var DEFAULT_NUMBER_OF_CHOICES = 4;
var COMPANY_CATEGORY_ID = 46;
var PUZZLE_CATEGORY_ID = 7;