"use strict" //no fetch, no let, and no const. because app must be backwards compatible with older phones.
var app = {
    action: "insert",
    review_id: 0,
    title: "",
    review_txt: "",
    rating: 0,
    image: "",
    imgOptions: null,
    imgData: null,
    uuid: null,
    urlGetAllReviews: "https://griffis.edumedia.ca/mad9022/reviewr/reviews/get/",
    urlGetReview: "https://griffis.edumedia.ca/mad9022/reviewr/review/get/",
    urlSetNewReview: "https://griffis.edumedia.ca/mad9022/reviewr/review/set/",
    //CAMERA FUNCTIONS//
    callCamera: function() {
        app.imgOptions = {
            quality: 75,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: false,
            encodingType: Camera.EncodingType.JPEG,
            mediaType: Camera.MediaType.PICTURE,
            targetWidth: 200,
            cameraDirection: Camera.Direction.FRONT,
            saveToPhotoAlbum: false
        };
        navigator.camera.getPicture(app.imgSuccess, app.imgFail, app.imgOptions);
    },
    imgSuccess: function(imageData) {
        //got an image back from the camera
        app.image.src = "data:image/jpeg;base64," + imageData;
        console.log(app.image.src);
        app.image = app.image.src;
        console.log("Image loaded into interface");
        //clear memory in app
        navigator.camera.cleanup();
    },
    imgFail: function(msg) {
        console.log("Failed to get image: " + msg);
    },
    //CAMERA FUNCTIONS - END//
    //DEVICE READY
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false); // For device testing **************
        //document.addEventListener("DOMContentLoaded", this.onDeviceReady); //For browser testing
    },
    onDeviceReady: function() {
        //Get the device uuid, Note: we will use the device plugin for this.
        app.uuid = device.uuid; //device.uuid ***********************************************************
        // using app.uuid hardcoding a device uuid instead of using device.uuid just so it works while testing in browser.
       // console.log(app.uuid);
        //Note: The FormData interface provides an easy way to costruct a 
        //set of key/value pairs representing form fields and their values
        //which can then be easily sent using the XMLHTTPRequest.send() method.
        // it uses the same format a form would use if the encoding type were set to "multipart/form data"
        var params = new FormData(); //creates a new formdata object.
        //Identify which page is active
        var reviewListPage = document.getElementById("reviewListPage");
        var picPage = document.getElementById("picPage");
        var singleReviewPage = document.getElementById("singleReviewPage");
        //********************************LISTVIEW PAGE**********************************// 
        //Update params
        params.append("uuid", app.uuid);
        //set up AJAX
        app.ajaxCall(app.urlGetAllReviews, params, app.gotList, app.ajaxErr);
        //Fix Header
        document.getElementById("mastHead").className = "reviewrHeaderAlign";
        //Add Event Listener to '+' Button
        var mc = new Hammer(document.getElementById("addBtn"));
        mc.on("tap", function(ev) {
            reviewListPage.className = "inactive-page";
            picPage.className = "active-page";
            document.getElementById("addBtn").className = "hide";
            document.getElementById("addBtn2").removeAttribute("class");
            //Add Camera and Back button
            document.getElementById("cameraBtn").removeAttribute("class");
            document.getElementById("backBin").removeAttribute("class");
            //Fix Header For PicPage
            document.getElementById("mastHead").removeAttribute("class");
            document.querySelector(".mainHeader").setAttribute("id", "reviewrHeader");
        });
        //********************************LISTVIEW PAGE - END **********************************//
        //********************************PIC PAGE**********************************//  
        //Add Event Listener to Back Button
        var mc = new Hammer(document.getElementById("backBin"));
        mc.on("tap", function(ev) {
            location.reload();
        });
        //Add click listeners to rating
        var starRating = document.getElementById("itemRating");
        var starRatingValue = 0;
        var mc = new Hammer(starRating.childNodes[1]);
        mc.on("tap", function(ev) {
            starRating.childNodes[1].setAttribute("id", "gold");
            starRating.childNodes[3].setAttribute("id", "");
            starRating.childNodes[5].setAttribute("id", "");
            starRating.childNodes[7].setAttribute("id", "");
            starRating.childNodes[9].setAttribute("id", "");
            starRatingValue = 1;
        });
        var mc = new Hammer(starRating.childNodes[3]);
        mc.on("tap", function(ev) {
            starRating.childNodes[3].setAttribute("id", "gold");
            starRating.childNodes[1].setAttribute("id", "gold");
            starRating.childNodes[5].setAttribute("id", "");
            starRating.childNodes[7].setAttribute("id", "");
            starRating.childNodes[9].setAttribute("id", "");
            starRatingValue = 2;
        });
        var mc = new Hammer(starRating.childNodes[5]);
        mc.on("tap", function(ev) {
            starRating.childNodes[5].setAttribute("id", "gold");
            starRating.childNodes[3].setAttribute("id", "gold");
            starRating.childNodes[1].setAttribute("id", "gold");
            starRating.childNodes[7].setAttribute("id", "");
            starRating.childNodes[9].setAttribute("id", "");
            starRatingValue = 3;
        });
        var mc = new Hammer(starRating.childNodes[7]);
        mc.on("tap", function(ev) {
            starRating.childNodes[7].setAttribute("id", "gold");
            starRating.childNodes[3].setAttribute("id", "gold");
            starRating.childNodes[5].setAttribute("id", "gold");
            starRating.childNodes[1].setAttribute("id", "gold");
            starRating.childNodes[9].setAttribute("id", "");
            starRatingValue = 4;
        });
        var mc = new Hammer(starRating.childNodes[9]);
        mc.on("tap", function(ev) {
            starRating.childNodes[9].setAttribute("id", "gold");
            starRating.childNodes[3].setAttribute("id", "gold");
            starRating.childNodes[5].setAttribute("id", "gold");
            starRating.childNodes[7].setAttribute("id", "gold");
            starRating.childNodes[1].setAttribute("id", "gold");
            starRatingValue = 5;
        });
        //CAMERA
        var mc = new Hammer(document.getElementById("cameraBtn"));
        mc.on("tap", function(ev) {
            app.callCamera();
            console.log("button listener added");
            document.querySelector("#reviewPicture").removeAttribute("class");
            app.image = document.querySelector("#reviewPicture");
        });
        //REVIEW NAME, AND DESCRIPTION
        var mc = new Hammer(document.getElementById("addBtn2"));
        mc.on("tap", function(ev) {
            //VALIDATION OF FIELDS
            var itemName = document.getElementById("itemName").value;
            if (itemName.length > 40) {
                alert("Item name is too long");
            } else if (itemName.length < 1) {
                alert("Please enter an item name");
            } else {
                app.title = itemName;
            }
            var itemDescription = document.getElementById("itemDescription").value;
            if (itemDescription.length > 255) {
                alert("Item description is too long");
            } else if (itemDescription.length < 1) {
                alert("Please enter an item description");
            } else {
                app.review_txt = itemDescription;
            }
            if (starRatingValue < 1) {
                alert("Please rate your item");
            } else {
                app.rating = starRatingValue;
            }
            if (app.image.length < 1) {
                alert("Please take a picture");
            //Fail-safe
            } else if((itemName.length === 0) || (itemDescription.length === 0) || (starRatingValue === 0) || (app.image.length === 0)){
                alert("Please fill in all fields");
            }else{
                //PREPARING FORMDATA AND SENDING TO SERVER
                params.append("action", app.action);
                params.append("title", app.title);
                params.append("review_txt", app.review_txt);
                params.append("rating", app.rating);
                params.append("img", app.image);
                app.ajaxCall(app.urlSetNewReview, params, app.dataSent, app.ajaxErr);
            }
        });
        //********************************PIC PAGE - END **********************************//
        //****************************SINGLE REVIEW PAGE**********************************// 
        //*****INSIDE THE 'GOTLIST' AND 'SINGLEREVIEWDATASENT'SUCCESS FUNCTION FROM AJAX CALLS//
        //****************************SINGLE REVIEW PAGE**********************************// 
    },
    ajaxCall: function(url, formData, success, fail) {
        //url - the url to call for xmlHTTPrequest
        //formData - the data to be sent to the AJAX call
        //success - the function to call when successful
        //fail - the function to call when there's an error
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.addEventListener("load", success);
        xhr.addEventListener("error", fail);
        xhr.send(formData);
    },
    gotList: function(ev) {
        console.dir(ev);
        //If it's the review list page, load list into page
        if (reviewListPage.className.indexOf("in") === -1) {
            var datData = JSON.parse(ev.currentTarget.response);
            //check if there's anything in the list
            console.log(datData);
            if (datData.reviews.length < 1) {
                document.getElementById("initialMsg").innerHTML = "You Have Nothing In Your List.";
            } else {
                document.getElementById("initialMsg").className = "hide";
                for (var i = 0; i < datData.reviews.length; i++) {
                    //Create list items
                    var listItems = document.createElement("li");
                    listItems.setAttribute("id", i);
                    listItems.innerHTML = datData.reviews[i].title + " - " + datData.reviews[i].rating + " / 5 Stars";
                    document.querySelector(".list-view").appendChild(listItems);
                    //Add Delete Button
                    var deleteBtn = document.createElement("i");
                    deleteBtn.setAttribute("id", "deleteBtn" + i);
                    listItems.appendChild(deleteBtn);
                    //Add Click Event For Single Review View
                    function getLiId(event) {
                        //Find the ID 
                        var retrievedId = event.target.getAttribute("id");
                        if (datData.reviews[retrievedId] === undefined) {
                            console.log("deleted list item");
                        } else {
                            var getId = datData.reviews[retrievedId].id;
                            app.review_id = getId;
                            //Navigate Pages
                            document.getElementById("reviewListPage").className = "inactive-page";
                            document.getElementById("singleReviewPage").className = "active-page";
                            //Remove / Add Icons
                            document.getElementById("addBtn").className = "hide";
                            document.getElementById("backBin").removeAttribute("class");
                            //Fix Header
                            document.getElementById("mastHead").removeAttribute("class");
                            document.querySelector(".mainHeader").setAttribute("id", "reviewrHeader");
                            //PREPARING FORMDATA AND SENDING TO SERVER
                            var singleReviewParams = new FormData();
                            singleReviewParams.append("uuid", app.uuid);
                            singleReviewParams.append("review_id", app.review_id);
                            app.ajaxCall(app.urlGetReview, singleReviewParams, app.singleReviewDataSent, app.ajaxErr);
                        }
                    }

                    function getIdFunc(touchedLi) {
                        var touchControl = new Hammer(touchedLi);
                        touchControl.on("tap", getLiId);
                    }
                    getIdFunc(listItems);

                    //**BONUS** DELETE BUTTON
                    //Swipe Left To Expose
                    function showDelete(event) {
                        //Find the ID 
                        var deleteToExpose = event.target.getAttribute("id");
                        var gotChya = document.getElementById("deleteBtn" + deleteToExpose)
                        gotChya.setAttribute("class", "fa fa-times fa-lg");

                        //Delete Entry $_POST['review_id']
                        var mc = new Hammer(event.target);
                        var parentLi = document.getElementById(deleteToExpose);
                        mc.on("tap", function(ev) {
                            parentLi.parentNode.removeChild(parentLi);
                            app.review_id = datData.reviews[deleteToExpose].id;
                            //delete from database
                            var paramsDelete = new FormData();

                            paramsDelete.append("uuid", app.uuid);
                            paramsDelete.append("action", "delete");
                            paramsDelete.append("review_id", app.review_id);

                            app.ajaxCall(app.urlSetNewReview, paramsDelete, app.deleteSuccess, app.ajaxErr);
                        });
                    }

                    function swipeDelete(swipedLi) {
                        var swipeControl = new Hammer(swipedLi);
                        swipeControl.on("swipeleft", showDelete);
                    }
                    swipeDelete(listItems);
                    //Swipe Right To Hide
                    function hideDelete(event) {
                        //Find the ID 
                        var deleteBtnToHide = event.target.getAttribute("id");
                        var gotChya2 = document.getElementById("deleteBtn" + deleteBtnToHide)
                        gotChya2.removeAttribute("class");
                    }

                    function swipeHideDelete(swipedHideLi) {
                        var swipeHideControl = new Hammer(swipedHideLi);
                        swipeHideControl.on("swiperight", hideDelete);
                    }
                    swipeHideDelete(listItems);
                }
            }
        }
    },
    dataSent: function(ev) {
        console.log(ev);
        alert("Review Uploaded Successfully!");
        //Reset fields
        location.reload();
    },
    singleReviewDataSent: function(ev) {
        //Parse Data
        var singleData = JSON.parse(ev.currentTarget.response);
        console.log(singleData);
        //Set Up Variables
        var singleReviewTitle = singleData.review_details.title;
        var singleReviewRating = singleData.review_details.rating;
        var singleReviewImg = singleData.review_details.img;
        var singleReviewDescription = singleData.review_details.review_txt;
        //Apply To Title
        document.getElementById("singleReviewPageHeader").innerHTML = singleReviewTitle;
        //Apply Rating
        var starRating = document.getElementById("singleReviewItemRating");
        console.log(singleReviewRating);
        switch (singleReviewRating) {
            case 1:
                starRating.childNodes[1].setAttribute("id", "gold");
                starRating.childNodes[3].setAttribute("id", "");
                starRating.childNodes[5].setAttribute("id", "");
                starRating.childNodes[7].setAttribute("id", "");
                starRating.childNodes[9].setAttribute("id", "");
                break;
            case 2:
                starRating.childNodes[1].setAttribute("id", "gold");
                starRating.childNodes[3].setAttribute("id", "gold");
                starRating.childNodes[5].setAttribute("id", "");
                starRating.childNodes[7].setAttribute("id", "");
                starRating.childNodes[9].setAttribute("id", "");
                break;
            case 3:
                starRating.childNodes[1].setAttribute("id", "gold");
                starRating.childNodes[3].setAttribute("id", "gold");
                starRating.childNodes[5].setAttribute("id", "gold");
                starRating.childNodes[7].setAttribute("id", "");
                starRating.childNodes[9].setAttribute("id", "");
                break;
            case 4:
                starRating.childNodes[1].setAttribute("id", "gold");
                starRating.childNodes[3].setAttribute("id", "gold");
                starRating.childNodes[5].setAttribute("id", "gold");
                starRating.childNodes[7].setAttribute("id", "gold");
                starRating.childNodes[9].setAttribute("id", "");
                break;
            case 5:
                starRating.childNodes[1].setAttribute("id", "gold");
                starRating.childNodes[3].setAttribute("id", "gold");
                starRating.childNodes[5].setAttribute("id", "gold");
                starRating.childNodes[7].setAttribute("id", "gold");
                starRating.childNodes[9].setAttribute("id", "gold");
                break;
            default:
                console.log("rating error");
                break;
        }
        //Apply Image
        var singleReviewImage = document.getElementById("singleReviewImage");
        singleReviewImage.setAttribute("src", singleReviewImg);
        //Apply Description
        var desc = document.createElement('p');
        desc.appendChild(document.createTextNode(singleReviewDescription));
        var bin = document.getElementById("descriptionBin");
        bin.appendChild(desc);
    },

    deleteSuccess: function(ev) {
        console.log(ev);
    },

    ajaxErr: function(err) {
        alert(err.message);
    }
};
app.initialize();