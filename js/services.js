'use strict';

var AppServices = angular.module('AppServices', ['ngResource']);

//subject Object
function Subject(name, limit) {
    this.name = name;
    this.total = 0;
    this.limit = limit;
    this.history = "";
}


AppServices.service('DbService',
        function DbService() {

            var dbName = "bunkd";
            //var dbName = "bunkdb";
            var dbVersion = 1;

            var isLoaded = false;
            var subjects = [];
            var callbacks = [];

            var getSubjects = function (callback) {
                if (!isLoaded) {
                    callbacks[callbacks.length] = callback;
                    return;
                } else {
                    callback(subjects);
                }
            }
            var DBDeleteRequest = window.indexedDB.deleteDatabase("bunkdb");

            DBDeleteRequest.onerror = function(event) {
              console.log("Error deleting database.");
            };

            DBDeleteRequest.onsuccess = function(event) {
              console.log("Database deleted successfully");

              console.log(request.result); // should be null
            };
            
            
            
            var db;
            var request = indexedDB.open(dbName, dbVersion);

            request.onerror = function (event) {
                console.error("Can't open indexedDB!!!", event);
            };
            request.onsuccess = function (event) {
                console.log("Database opened ok");
                db = event.target.result;
            };
            
            request.onupgradeneeded = function (event) {
                db = event.target.result;
                if (!db.objectStoreNames.contains(dbName)) {
                    var objectStore = db.createObjectStore(dbName, {
                        keyPath: "id",
                        autoIncrement: true
                    });
                    objectStore.createIndex("name", "name", {
                        unique: true
                    });
                   
                }
            };

            function saveSubject(sub, limit, callback) {
                var subject = new Subject(sub, limit);
                if (!isLoaded) {
                    return;
                }
                var transaction = db.transaction([dbName], "readwrite");
                transaction.oncomplete = function (event) {
                    console.log("Saved");
                };
                transaction.onerror = function (event) {
                    console.error("Error saving subject:", event);
                };
                var objectStore = transaction.objectStore(dbName);
                var request = objectStore.put(subject);
                
                request.onsuccess = function (event) {
                    console.log("Subject saved with id: " + request.result);
                    var id = request.result;
                    subject.id = id;
                    subjects[subjects.length] = subject;
                    callback();
                };
            }

            function editSubject(id,name,total,limit,callback) {
                if(!db)return;
                alert(id+name+total+limit);
                var s = new Subject(name,limit);
                s.id = id;
                s.limit = limit;
                
                var objectStore = db.transaction([dbName], "readwrite").objectStore(dbName);
                var request = objectStore.put(s);
                request.onerror = function (event) {
                };
                request.onsuccess = function (event) {
                  
                        for(var i=0;i<subjects.length;i++){
                            if(subjects[i].name == name){
                                subjects[i].total = total;
                                subjects[i].limit = limit;
                                callback();
                            }
                        }
                    
                };


            }


            var getAll = function () {
                if (!db) {
                    //db not ready yet
                    console.warn("Database is not ready yet");
                    setTimeout(getAll, 1000);
                    return;
                }
                var objectStore = db.transaction(dbName).objectStore(dbName);
                var subs = [];
                objectStore.openCursor().onsuccess = function (event) {
                    var cursor = event.target.result;
                    if (cursor) {
                        console.log("Found memo #" + cursor.value.name + "-" + cursor.value.limit);
                        var sub = new Subject(cursor.value.name, cursor.value.limit);
                        sub.total = cursor.value.total;
                        sub.id = cursor.value.id;
                        subs[subs.length] = sub;
                        cursor.continue();
                    } else {
                        //end
                        update(subs);
                        isLoaded = true;
                    }
                };

            }
            getAll();


            var update = function (p) {
                subjects = p;
                for (var i = 0; i < callbacks.length; i++) {
                    var call = callbacks.pop();
                    call(subjects);
                }
            }

            var getIsLoaded = function () {
                return isLoaded;
            }

            return{
                subjects: subjects,
                getSubjects: getSubjects,
                saveSubject: saveSubject,
                getIsLoaded: getIsLoaded,
                editSubject:editSubject
            }
        }

);


