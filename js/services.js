'use strict';

var AppServices = angular.module('AppServices', ['ngResource']);

//subject Object
function Subject(id,name,limit,total,history) {
    this.id = id;
    this.name = name;
    this.total = total;
    this.limit = limit;
    this.history = history;
}


AppServices.service('DbService',
        function DbService() {



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
           
            var bunks = new IDBStore({
                dbVersion: 1,
                storeName: 'bunks',
                keyPath: 'id',
                autoIncrement: true,
                onStoreReady: function () {
                    console.log('Store ready!');
                    All();
                }
            });
            function add(sub, limit, callback) {
                if (!isLoaded) {
                    return;
                }
                var bunk = {name: sub, limit: limit, total: 0,history: []};
                var onsuccess = function (id) {
                    console.log('Yeah, dude inserted! insertId is: ' + id);
                    callback(id);
                }
                var onerror = function (error) {
                    console.log('Oh noes, sth went wrong!', error);
                }
                bunks.put(bunk, onsuccess, onerror);
            }
            function get(id,callback) {
                if (!isLoaded) {
                    return;
                }
                var onsuccess = function (data) {
                    console.log('here is our dude:', data);
                    callback(data);
                }
                var onerror = function (error) {
                    console.log('Oh noes, sth went wrong!', error);
                }
                bunks.get(id, onsuccess, onerror);
            }

            function updateBunk(id, sub, total, limit, history, callback) {
                 if (!isLoaded) {
                    return;
                }
                var bunk = {id:id,name: sub, limit: limit, total: total,history: history};
                var onsuccess = function (id) {
                    console.log('Yeah, dude updated! id still is: ' + id);
                    callback();
                }
                var onerror = function (error) {
                    console.log('Oh noes, sth went wrong!', error);
                }
                bunks.put(bunk, onsuccess, onerror);
            }

            function All() {

                console.log("came");
                var onsuccess = function (data) {
                    console.log('Here is what we have in store (' + data.length + ' items in total):');
                    console.log(data[0]);
                    update(data);
                    isLoaded = true;    
                }
                var onerror = function (error) {
                    console.log('Oh noes, sth went wrong!', error);
                }

                bunks.getAll(onsuccess, onerror);
            }
            
            function updateTotal(id, total) {
                
                for(var i=0;i<subjects.length;i++){
                    if(subjects[i].id == id){
                        subjects[i].total = total;
                    }
                }
            
            }

            /*function saveSubject(id, sub, limit, callback) {
               
                var data = [
                    {id: 1, name: sub, limit: limit, history: ''},
                ];
                var subject = new Subject(sub, limit);

                db.insert({
                    store: table,
                    data: data,
                    success: function (rowsAdded, rowsFailed, objectStore, successEvent) {
                        subjects[subjects.length] = subject;
                        callback();
                    },
                    error: function (rowsAdded, rowsFailed, objectStore, failEvent) {

                    }
                });
            }

            function editSubject(id, name, total, limit, callback) {
                if (!db)
                    return;
                alert(id + name + total + limit);
                var s = new Subject(name, limit);
                s.id = id;
                s.limit = limit;

                var objectStore = db.transaction([dbName], "readwrite").objectStore(dbName);
                var request = objectStore.put(s);
                request.onerror = function (event) {
                };
                request.onsuccess = function (event) {

                    for (var i = 0; i < subjects.length; i++) {
                        if (subjects[i].name == name) {
                            subjects[i].total = total;
                            subjects[i].limit = limit;
                            callback();
                        }
                    }

                };


            }*/
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
                getIsLoaded: getIsLoaded,
                add:add,
                get:get,
                updateBunk:updateBunk,
                updateTotal:updateTotal
            }
        }

);


