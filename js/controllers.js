'use strict';
/* Controllers */
var AppControllers = angular.module('AppControllers', []);

AppControllers.controller('MainCtrl',
        function MainCtrl($scope, $location, $rootScope, DbService) {
            DbService.getSubjects(function (subjects) {

            });
        }
);


AppControllers.controller('RecordCtrl',
        function RecordCtrl($scope, $routeParams, $location, $rootScope, DbService) {

            $scope.id = $routeParams.id;
            var id = parseInt($scope.id);
            var isLoaded = false;
            var subject;
            var sub = DbService.get(id, function (bunk) {
                subject = bunk;
                isLoaded = true;
                $rootScope.$apply(function () {
                    $scope.name = subject.name;
                    $scope.total = subject.total;
                    $scope.limit = subject.limit;
                });

            });
            $scope.isBunking = false;
            $scope.bunk = function () {
                if (!isLoaded || $scope.isBunking)
                    return;
                $scope.isBunking = true;
                DbService.updateBunk(subject.id, subject.name, $scope.total + 1, subject.limit, subject.history, function () {
                    $scope.isBunking = false;
                    $rootScope.$apply(function () {
                        $scope.total += 1;
                        $scope.isBunking = false;
                        DbService.updateTotal(subject.id, $scope.total);
                    });
                });
            }


        }
);

AppControllers.controller('DashBoardCtrl',
        function DashBoardCtrl($scope, $location, $rootScope, DbService) {

            $scope.subjects = DbService.subjects;

            $scope.noSubs = false;

            var blue = "#badbf1";
            var bluelight = "#3A98D8";
            var red = "#f1ccba";
            var redlight = "#d83b3b";

            var circle = $('<div class="col-xs-4"></div>');
            var width = window.innerWidth > 480 ? 150 : window.innerWidth / 3.3;
            $scope.side = Math.floor(window.innerWidth / 3.3);

            if (DbService.getIsLoaded()) {
                DbService.getSubjects(function (subjects) {
                    $scope.subjects = subjects;
                    if (subjects.length == 0) {
                        $scope.noSubs = true;
                    }
                    for (var i = 0; i < $scope.subjects.length; i++) {
                        var a = $scope.subjects[i];
                        var percent, cl, cllight;
                        if (a.total <= a.limit) {
                            percent = Math.floor(100 * (a.total) / a.limit);
                            cl = blue;
                            cllight = bluelight;
                        } else {
                            percent = Math.floor(100 * (a.total - a.limit) / a.limit);
                            cl = red;
                            cllight = redlight;
                        }
                        $scope.subjects[i].percent = percent;
                        $scope.subjects[i].bold = cl;
                        $scope.subjects[i].light = cllight;
                    }
                });
            } else {
                DbService.getSubjects(function (subjects) {
                    $rootScope.$apply(function () {
                        $scope.subjects = subjects;
                        if (subjects.length == 0) {
                            $scope.noSubs = true;
                        }
                        for (var i = 0; i < $scope.subjects.length; i++) {
                            var a = $scope.subjects[i];
                            var percent, cl, cllight;
                            if (a.total <= a.limit) {
                                percent = Math.floor(100 * (a.total) / a.limit);
                                cl = blue;
                                cllight = bluelight;
                            } else {
                                percent = - Math.floor(100 * (a.total - a.limit) / a.limit);
                                cl = red;
                                cllight = redlight;
                            }
                            $scope.subjects[i].percent = percent;
                            $scope.subjects[i].bold = cl;
                            $scope.subjects[i].light = cllight;
                        }
                    });
                });
            }

            $scope.isBunking = false;
            $scope.bunk = function (subject) {
                if (!DbService.getIsLoaded() || $scope.isBunking)
                    return;
                $scope.isBunking = true;
                console.log("bunking" + JSON.stringify(subject));
                DbService.updateBunk(subject.id, subject.name, subject.total + 1, subject.limit, subject.history, function () {
                    $scope.isBunking = false;
                    $rootScope.$apply(function () {
                        DbService.updateTotal(subject.id, subject.total + 1);
                        for (var i = 0; i < $scope.subjects.length; i++) {
                            if ($scope.subjects[i].id == subject.id) {
                                var a = $scope.subjects[i];
                                var percent, cl, cllight;
                                
                                if (a.total <= a.limit) {
                                    percent = Math.floor(100 * (a.total) / a.limit);
                                    cl = blue;
                                    cllight = bluelight;
                                    console.log("blue");
                                } else {
                                    percent = - Math.floor(100 * (a.total - a.limit) / a.limit);
                                    cl = red;
                                    cllight = redlight;
                                    console.log("red");
                                }
                                $scope.subjects[i].percent = percent;
                                $scope.subjects[i].bold = cl;
                                $scope.subjects[i].light = cllight;
                                break;
                            }
                        }
                        $scope.isBunking = false;

                    });
                });
            }


        }
);


AppControllers.controller('SubjectCtrl',
        function SubjectCtrl($scope, $location, $rootScope, DbService) {

            $scope.isAdding = false;

            var form = $("#subjectform");
            form.validate();

            $scope.add = function () {
                if (!form.valid() || $scope.isAdding)
                    return;

                if ($scope.name != "" && $scope.limit === parseInt($scope.limit, 10)) {
                    $scope.isAdding = true;

                    DbService.add($scope.name, $scope.limit, function (id) {
                        $rootScope.$apply(function () {
                            //(id,name,limit,total,history)
                            var s = new Subject(id, $scope.name, $scope.limit, 0, []);
                            $scope.subjects[$scope.subjects.length] = s;
                            $scope.name = "";
                            $scope.limit = "";
                            $scope.isAdding = false;
                        });
                    });
                }
            }

            $scope.delete = function (subject) {
                DbService.deleteBunk(subject.id, function () {
                    DbService.getSubjects(function (subjects) {
                        $rootScope.$apply(function () {
                            $scope.subjects = subjects;
                        });
                    });
                });
            }

            $scope.subjects = [];
            if (DbService.getIsLoaded()) {
                DbService.getSubjects(function (subjects) {
                    $scope.subjects = subjects;
                });
            } else {
                DbService.getSubjects(function (subjects) {
                    $rootScope.$apply(function () {
                        $scope.subjects = subjects;
                    });
                });
            }






        }
);


AppControllers.controller('NavCtrl',
        function NavListCtrl($scope, $rootScope, $location) {

            $scope.menu = [
                {name: 'Bunkometer', link: 'dashboard', img: './images/icons/home153.png'},
                {name: 'Subjects', link: 'subjects', img: './images/icons/home153.png'},
            ]

            $scope.title = "Bunkometer";

            $scope.navigate = function (item) {
                $scope.title = item.name;
                $scope.close();
                $location.path(item.link);
            }

            $scope.open = function () {
                var sidebar = document.querySelector('.sidebarcontainer');
                var l = sidebar.offsetWidth;
                dynamics.css(sidebar, {opacity: 0, translateX: -l, zIndex: 1001, display: 'block'});
                dynamics.animate(sidebar, {opacity: 1, translateX: 0}, {
                    type: dynamics.spring,
                    duration: 2000,
                    friction: 600,
                    complete: function () {

                    }
                });

            }

            $scope.close = function () {
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

