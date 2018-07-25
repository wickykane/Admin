(function () {
    'use strict';

    angular
        .module('app')
        .controller('blog.create.controller', controller);

    /** @ngInject */
    function controller($scope, $rootScope, $controller, $uibModal, blogAPI, $stateParams, $timeout, $state, $localStorage, hotkeys) {
        $scope.createBlog = createBlog;
        $scope.blog = {};
        $scope.listFile = [];
        $scope.listMaster ={
            type:[]
        };
        /** Internal functions */

        (function onInit() {
            $scope.blog['status'] = 0;
            $scope.currDate = new Date();
            getBlogType();
        })();

        $scope.selectedImage = 0;
        $scope.setFiles = function (event) {
            $scope.selectedImage = 0;
            var files = event.target.files;
            $scope.listFile = files;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var reader = new FileReader();
                reader.onload = $scope.imageIsLoaded;
                reader.readAsDataURL(file);
            }

        }

        $scope.imageIsLoaded = function (e) {
            $scope.$apply(function () {
                $scope.listPreview = [];
                $scope.listPreview.push(e.target.result);
            });
        }
        $scope.selectedImage = 0;
        $scope.selectedImages = function (index) {
            $scope.selectedImage = index;
        }
       function getBlogType() {
            blogAPI.getBlogType().then(function (res) {               
                try {
                    $scope.listMaster.type = res.data.results
                } catch(e){ 
                    console.log(e);
                }
            })
        }

        function createBlog(type) {
          var dateForm = moment($scope.blog.auto_publish, "YYYY-MM-DDTHH:mm:ssZZ").format('MM/DD/YYYY');
          $scope.blog.auto_publish = dateForm;
          console.log($scope.blog.auto_publish);
            if (type == "draft") {
                var params = $scope.blog;
                params.draft = 1;
                blogAPI.postBlog(params, $scope.listFile).then(function (res) {
                    try {
                        if (res._type == 'success') {
                            toastr.success(res.message);
                            $timeout(function () {
                                $state.go("app.blog.list");
                            }, 500)

                        } else {
                            toastr.error(res.message);
                        }

                    } catch (e) {
                        console.log(e)
                    }
                })
            } else {
                var params = $scope.blog;
                params.draft = 0;
                blogAPI.postBlog(params, $scope.listFile).then(function (res) {
                    try {
                        if (res._type == 'success') {
                            toastr.success(res.message);
                            $timeout(function () {
                                $state.go("app.blog.list");
                            }, 500)

                        } else {
                            toastr.error(res.message);
                        }

                    } catch (e) {
                        console.log(e)
                    }
                })
            }

        }
        $scope.cancelBlog = function () {
            $state.go("app.blog.list");
        }

    }
})();
