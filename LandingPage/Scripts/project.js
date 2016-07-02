$(document).keypress(function(e){
    if(e.which == 27 )
        $(".modal .close").click;
});

$(document).ready(function(){
    $(".list").click(function(){
        $(".list").css("background",'white');  
        $(this).css({"background":'#556B2F'});
    })
});

$(document).ready(function(){
    $(".ImageOnOff").hover(function(){
        if($(this).attr("src").toString().indexOf('tech1.jpg')!=-1){
            this.src=this.src.replace("tech1.jpg","tech2.jpeg");
        }
        if($(this).attr("src").toString().indexOf('HR.png')!=-1){
            this.src=this.src.replace("HR.png","HR1.png");
        }
        if($(this).attr("src").toString().indexOf('puzzles.jpeg')!=-1){
            this.src=this.src.replace("puzzles.jpeg","puzzle1.jpeg");
        }
        if($(this).attr("src").toString().indexOf('resume3.jpeg')!=-1){
            this.src=this.src.replace("resume3.jpeg","resume2.jpeg");
        }
        if($(this).attr("src").toString().indexOf('job1.jpeg')!=-1){
            this.src=this.src.replace("job1.jpeg","job2.jpeg");
        }
        if($(this).attr("src").toString().indexOf('interview3.jpeg')!=-1){
            this.src=this.src.replace("interview3.jpeg","interview2.jpeg");
        }
    },
                           function(){
        if($(this).attr("src").toString().indexOf('tech2.jpeg')!=-1){
            this.src=this.src.replace("tech2.jpeg","tech1.jpg");
        }
        if($(this).attr("src").toString().indexOf('HR1.png')!=-1){
            this.src=this.src.replace("HR1.png","HR.png");
        }
        if($(this).attr("src").toString().indexOf('puzzle1.jpeg')!=-1){
            this.src=this.src.replace("puzzle1.jpeg","puzzles.jpeg");
        }
        if($(this).attr("src").toString().indexOf('resume2.jpeg')!=-1){
            this.src=this.src.replace("resume2.jpeg","resume3.jpeg");
        }
        if($(this).attr("src").toString().indexOf('job2.jpeg')!=-1){
            this.src=this.src.replace("job2.jpeg","job1.jpeg");
        }
        if($(this).attr("src").toString().indexOf('interview2.jpeg')!=-1){
            this.src=this.src.replace("interview2.jpeg","interview3.jpeg");
        }
    })
});

$(document).ready(function(){
    $('div.img').mouseover(function() {
  $('.desc').css("visibility","visible");
});

$('div.img').mouseout(function() {
  $('.desc').css("visibility","hidden");
})
});

//$(document).ready(function(){
//    $("#startWithResumeBuilding").click(function(e) {
//      e.preventDefault();
//      $('.divMainResume1').fadeOut('slow');
//      $('.' + $(this).data('rel')).fadeIn('slow');
//});
//});

$(document).ready(function(){
    $("#startWithResumeBuilding").click(function(e){
        e.preventDefault();
        $('.' + $(this).data('rel')).slideDown(500);
        $(".divMainResume1").slideUp(500);
        $('.' + $(this).data('rel')).css("visibility",'visible');
        $("body").css("overflow",'auto');
    }) 
    
    $("#previewResume").click(function(e){
        e.preventDefault();
        $('.' + $(this).data('rel')).slideDown(500);
        $(".divMainResume3").slideUp(500);
        $('.' + $(this).data('rel')).css({"visibility":"visible","min-height":"800px","background-color":"black"});
        $("body").css("overflow",'auto');
    }) 
    
    $("#gotoResumeHomePage").click(function(e){
        e.preventDefault();
        $(".divMainResume1").slideDown(500);
        $("body").css("overflow",'hidden');
    })
    
    $("#gotoResumeGeneralSection").click(function(e){
        if(!($("#enterNameOnResume").val() == "" || $("#enterEmailOnResume").val() == "" || $("#enterMobileNumberOnResume").val() == "" || $("#enterAddressOnResume").val() == "")){
        e.preventDefault();
        $('.' + $(this).data('rel')).slideDown(500);
        $(".divMainResume2").slideUp(500);
        $('.' + $(this).data('rel')).css({"visibility":"visible","max-height":"900px"});
        $(".contentHolderForTemplate").css({"visibility":"visible","max-height":"600px","margin-top":"140px","background-color":"white"});
        $(".leftSelectionSideOfTemplate").css("max-height",'600px');
        $(".tab-content").css({"max-height":"600px","overflow":"auto"});
        $("body").css("overflow",'auto');
        }
    })
    
    $("#gotoTemplateSelectionPage").click(function(e){
        e.preventDefault();
        $(".divMainResume2").slideDown(500);
        $(".divMainResume3").css({"visibility":"hidden","min-height":"0px","margin-top":"0px"});
        $(".contentHolderForTemplate").css({"visibility":"hidden","min-height":"0px","margin-top":"0px"});
        $(".leftSelectionSideOfTemplate").css("height",'0px');
    })

     $(".imageCarousel").click(function(e){
        e.preventDefault();
            $(".toDisplayTemplate").css("visibility",'visible');
    //        $(".divMainResume3").css({"visibility":"hidden","min-height":"0px","margin-top":"0px"});
    //        $(".displayUserQuestions").css("min-height","300px");
            var imageSource = $(this).data('picture');
            if(imageSource){
    //            $("#template-location").html('<center><div class="row" style="background-color:gray;max-width:500px;min-width:200px;"><div class="col-md-6"><br><br><h3 style="color:#FFFFFF;">Template Selected!</h3><br><a href="#" id="gotoResumeGeneralSection" data-rel="divMainResume3"><button class="btn btn-responsive" style="background-color:aqua;">Proceed</button></a></div><br><div class="col-md-6"><img src="'+imageSource+'" alt="Hello" height="200px" width="200px" style=""></div></div></center>');
                $("#template-location").html('<img src="'+imageSource+'" alt="Hello" height="200px" width="200px" style="">');
            }
            else{
                alert("No image Selected");
            }
        });
});

//$(document).ready(function(){
//    $(".imageCarousel").click(function(e){
//    e.preventDefault();
//        $(".toDisplayTemplate").css("visibility",'visible');
////        $(".divMainResume3").css({"visibility":"hidden","min-height":"0px","margin-top":"0px"});
////        $(".displayUserQuestions").css("min-height","300px");
//        var imageSource = $(this).data('picture');
//        if(imageSource){
////            $("#template-location").html('<center><div class="row" style="background-color:gray;max-width:500px;min-width:200px;"><div class="col-md-6"><br><br><h3 style="color:#FFFFFF;">Template Selected!</h3><br><a href="#" id="gotoResumeGeneralSection" data-rel="divMainResume3"><button class="btn btn-responsive" style="background-color:aqua;">Proceed</button></a></div><br><div class="col-md-6"><img src="'+imageSource+'" alt="Hello" height="200px" width="200px" style=""></div></div></center>');
//            $("#template-location").html('<img src="'+imageSource+'" alt="Hello" height="200px" width="200px" style="">');
//        }
//        else{
//            alert("No image Selected");
//        }
//    });
//});

$(document).ready(function(){
    $("img.imageCarousel").click(function(e){
        $('.alert').show();
        $('.alert').fadeOut(7000);
    })
});

$(document).ready(function(){
    
    $(".listItems").click(function(e){
        $(".listItems").removeClass("listItems");
        $(this).addClass("listItems");
    })
});