'use strict';
/* Controllers */
var AppControllers = angular.module('AppControllers', []);

AppControllers.controller('MainCtrl',
        function MainCtrl($scope, $location, $rootScope,DbService ) {
            
            DbService.getSubjects(function(subjects){
                $scope.subjects = subjects;
            });

        }
);

AppControllers.controller('DashBoardCtrl',
        function DashBoardCtrl($scope, $location, $rootScope,DbService ) {
          
           $scope.subjects = DbService.subjects; 
           
           var circle = $('<div class="col-xs-4"></div>');
           var width = window.innerWidth > 480 ? 150 : window.innerWidth/3.3;
           $scope.side = Math.floor(window.innerWidth/3.3);
           
           
           if(DbService.getIsLoaded()){
   
               DbService.getSubjects(function(subjects){
                    $scope.subjects = subjects;
                     for(var i=0;i<$scope.subjects.length;i++){
                         var a =  $scope.subjects[i];
                         $scope.subjects[i].percent = Math.floor(100*(a.total)/a.limit);
                     }
               });
           } else{
               DbService.getSubjects(function(subjects){
                $rootScope.$apply(function(){
                     $scope.subjects = subjects;
                     for(var i=0;i<$scope.subjects.length;i++){
                         var a =  $scope.subjects[i];
                         $scope.subjects[i].percent = Math.floor(100*(a.limit - a.total)/a.limit);
                     }
                });
               });
           }
           
            //alert($scope.subjects.length);
           

        }
);


AppControllers.controller('SubjectCtrl',
        function SubjectCtrl($scope, $location, $rootScope,DbService) {
            
            $scope.isAdding = false;
            
            var form  = $("#subjectform");
            form.validate();
            
            $scope.add = function(){
                if(!form.valid()||$scope.isAdding)return;
                
                if($scope.name != ""&& $scope.limit === parseInt( $scope.limit , 10)){
                    $scope.isAdding = true;
                    DbService.saveSubject($scope.name,$scope.limit,function(){
                        $rootScope.$apply(function(){
                             $scope.subjects[$scope.subjects.length] = $scope.name;
                             $scope.name = "";
                             $scope.limit = "";
                             $scope.isAdding = false;
                        });
                    }); 
                }
            }
            $scope.subjects = [];
            if(DbService.getIsLoaded()){
                 DbService.getSubjects(function(subjects){
                     $scope.subjects = subjects;
                }); 
            }else{
                DbService.getSubjects(function(subjects){
                    $rootScope.$apply(function(){
                         $scope.subjects = subjects;
                    });
                }); 
            }
           
            
            
            
           

        }
);


AppControllers.controller('NavCtrl',
        function NavListCtrl($scope, $rootScope, $location) {

             $scope.menu = [
             {name:'DashBoard', link: 'dashboard', img: './images/icons/home153.png'},
             {name:'Subjects', link: 'subjects', img: './images/icons/home153.png'},
             {name:'Record Bunk', link: 'record', img: './images/icons/home153.png'},             
             ]
             
             $scope.title = "Bunkometer";
             
             $scope.navigate = function(item){
                $scope.title = item.name; 
                $scope.close();
                $location.path(item.link);        
             }
             
             $scope.open = function(){
                var sidebar = document.querySelector('.sidebarcontainer');
                var l = sidebar.offsetWidth;
                dynamics.css(sidebar, {opacity: 0, translateX: -l,zIndex: 1001,display: 'block'});
                dynamics.animate(sidebar, {opacity: 1, translateX: 0}, {
                    type: dynamics.spring,
                    duration: 2000,
                    friction: 600,
                    complete: function () {

                    }
                });
               
             }
             
             $scope.close = function(){
                var sidebar = document.querySelector('.sidebarcontainer');
                var l = sidebar.offsetWidth;
                dynamics.animate(sidebar, {opacity: 0, translateX: -l}, {
                    type: dynamics.spring,
                    duration: 2000,
                    friction: 600,
                    complete: function () {

                    }
                });
             }
             

        }
);

