==================
Javascript Montage
==================

A Javascript wrapper for the Montage API


Installation
============

Install dependencies::

  npm install

Run tests::

  gulp test

Compile to ES5::

  gulp build

Compile for the browser::
  
  webpack


Usage
=====
From a script tag::

  <script src="dist/montage.js"></script>
  <script type="text/javascript">
  console.log(Montage)
  </script>

Create a client object::

  import {Client, Query} from 'montagedata'

  //generate a token
  var client = new Montage.Client({
    username: "YOUR_USERNAME",
    passwod: "YOUR_PASSWORD",
    api_version: 1, //default
    domain: "test" //Your Montage subdomain
  });

  client.auth().then(response => {
    var token = response.token.value;
  });


  //client with only a token (recommended)
  var client = new Montage.Client({
    token: "YOUR_TOKEN",
    domain: "test" //Your Montage subdomain
  });


Or include it in a script tage
Using a client::

  var query = new Montage.Query()
    .where({"rating__gt": 4})
    .limit(10)
    .order("rating", -1);
  client.documents("movies", query).then(movies => {
    console.log(movies);
  });
