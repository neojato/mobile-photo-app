/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    
    // Application Constructor
    initialize: function() {        
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        console.log("binding events");
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        console.log("the device is ready");
        app.receivedEvent('deviceready');
    },

    getImage: function() {
      navigator.camera.getPicture(
        app.onImageSuccess,
        app.onImageFail,
        {
          quality: 100,
          destinationType: Camera.DestinationType.FILE_URI,
          targetWidth: 150,
          targetHeight: 150,
          saveToPhotoAlbum: false
        }
      );
    },

    onImageSuccess: function(imageURI) {
      var img = document.createElement('img');
      img.src = imageURI;
      img.dataset.originalsrc = imageURI;

      // Perform grolocation lookup here
      // Grab the coords
      navigator.geolocation.getCurrentPosition(
        function(position) {
          img.dataset.latitude = position.coords.latitude;
          img.dataset.longitude = position.coords.longitude;

          // add mapping request here
          img.dataset.mapURL = 'http://maps.googleapis.com/maps/api/staticmap?center=' + img.dataset.latitude + ',' + img.dataset.longitude + '&zoom=13&size=600x300&maptype=roadmap&sensor=true&markers=%7c' + img.dataset.latitude + ',' + img.dataset.longitude;
console.log(img.dataset.mapURL);
          img.onclick = function() {
            app.toggleMap(this);
          };
        }
      , app.onGeoError);

      var polaroids = document.getElementById('polaroid-images');
      polaroids.appendChild(img);
    },

    onImageFail: function(message) {
      alert('Failed because: ' + message);
    },

    onGeoError: function(error) {
      alert(error.code + ': ' + error.message);
    },

    toggleMap: function(element) {
      if(element.className == 'mapit') {
        element.className = '';
        element.src = element.dataset.originalsrc;
      } else {
        element.className += 'mapit';
        element.dataset.originalsrc = element.src;
        element.src = element.dataset.mapurl;
      }
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
    
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log("Cordova has connected. Let the good times roll.");
            
        // START capture elements
        var captureElements = document.body.querySelectorAll('.capture');
        for(var i=0; i<captureElements.length; i++) {
          captureElements[i].setAttribute('style', 'display:block;');
        }

        var capButton = document.getElementById('capButton');
        capButton.onclick = function() {
          app.getImage();
        };
        // END capture elements
    }
};
