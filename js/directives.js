/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var appDirectives = angular.module('AppDirectives', []);

appDirectives.directive('percentDisplay', function () {       
        return {
            restrict: 'E',
            template:  '<div class="ngpercentdisplay" data-percent="{{ percent }}">' +
                            '<div class="ngperdispleft">' +
                                '<span></span>' +
                            '</div>' +
                            '<div class="ngperdispright">' +
                                '<span></span>' +
                           '</div>' +
                        '</div>',
            scope: { percent: '=' },
            link: function($scope, element, attrs) {  

                var jEle = $(element);
                var leftSide = jEle.find(".ngperdispleft span"),
                    rightSide = jEle.find(".ngperdispright span"),
                    side = attrs.side || 50,
                    fontSize = Math.floor(side / 5);
                    colors = attrs.colors.split(' ');
                var deg, strdeg;

                if (!colors[0]) { colors[0] = '#DADADA'; }
                if (!colors[1]) { colors[1] = '#606060'; }
                if (!colors[2]) { colors[2] = '#FFFFFF'; }

                jEle.find('.ngpercentdisplay').css({ 'width': side, 'height': side, 'font-size': fontSize, 'background-color': colors[0], 'color': colors[1] });
                jEle.find('.ngpercentdisplay span').css({ 'background-color': colors[1] });
                jEle.find('.ngpercentdisplay:before').css({ 'background-color': colors[2] });

                $scope.$watch('percent', function(newvalue, oldvalue){
                    if(newvalue<0){
                        var red = "#f1ccba";
                        var redlight = "#d83b3b";
                       jEle.find('.ngpercentdisplay').css({ 'width': side, 'height': side, 'font-size': fontSize, 'background-color': red, 'color': redlight });
                       jEle.find('.ngpercentdisplay span').css({ 'background-color': redlight });  
                    }
                    if (newvalue > -1 && newvalue < 101) {
                        if(newvalue <= 50) {
                            // Hide left
                            leftSide.hide();
                            
                            // Adjust right
                            deg = 180 - (newvalue / 100 * 360);
                           	strdeg = "rotateZ(-" + deg + "deg)";
                            rightSide.css({ "transform": strdeg, "-webkit-transform": strdeg, "-moz-transform": strdeg, "msTransform": "rotate(-" + deg + "deg)" });
                        } else {
                            // Adjust left
                            leftSide.show();
                            deg = 180 - ((newvalue - 50) / 100 * 360);
                            strdeg = "rotateZ(-" + deg + "deg)";
                            leftSide.css({ "transform": strdeg, "-webkit-transform": strdeg, "-moz-transform": strdeg, "msTransform": "rotate(-" + deg + "deg)" });
                            rightSide.css({ "transform": "rotateZ(0deg)", "-webkit-transform": "rotateZ(0deg)", "-moz-transform": "rotateZ(0deg)", "msTransform": "rotate(0deg)"  });
                        }
                    }
                });
            }
        }
    });

/*
appDirectives.directive('bullzImage', function() {
return {
template:'<div class="bullz-image"><img src="j"/><div class="prog"><md-progress-circular class="md-hue-2" md-mode="indeterminate"></md-progress-circular></div></div>',   
replace:true,
link:function(scope,element,attrs){
    var div = angular.element(element);
    var image = div.children("img");
    var progress = div.children(".prog");
    var img = null;
    var loadImage = function(){
        image.hide();
        progress.show();
        img = new Image();
        img.src = attrs.mySrc;
        img.onload = function(){
            image.attr('src',attrs.mySrc);
            image.show();
            progress.hide();
        }
    }
    scope.$watch((function(){
        return attrs.mySrc;
    }), function(newVal, oldVal){
        
       if(oldVal!=newVal){
           loadImage();
       } 
    });
}
};
});
*/






