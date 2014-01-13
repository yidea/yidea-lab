/*TODO:
 * MVC bb.rocks structure, bower, tests
 * requirejs AMD
 * Add Copy json code feature
 * */

// Util
var PresoJsonUtil = {
  minifyJSON: function (value) {
    //using minify.json.js
    if (!$.trim(value)) {
      throw new Error("minifyJSON: value is empty");
    }

    var jsonMinified = JSON.minify(value);
    if (!jsonMinified) {
      jsonMinified = value;
    }
    return jsonMinified;
  },

  formatJSON: function (json, numSpace) {
    if (!numSpace) {
      numSpace = 2; //reformat w 2 characters
    }
    return JSON.stringify(JSON.parse(json), null, numSpace);
  },

  encodeURL: function (value) {
    //http://meyerweb.com/eric/tools/dencoder/
    if (!$.trim(value)) {
      throw new Error("encodeURL: value is empty");
    }
    return encodeURIComponent(value).replace(/'/, "%27").replace(/"/g, "%22");
  },

  decodeURL: function (value) {
    if (!$.trim(value)) {
      throw new Error("decodeURL: value is empty");
    }
    return decodeURIComponent(value.replace(/\+/g, " "));
  },

  constructURL: function (url, param) {
    return url + param;
  },

  getNthPos: function (searchStr, char, pos) {
    var i,
      charCount = 0,
      strArr = searchStr.split(char);

    if (pos === 0) {
      return 0;
    }

    for (i = 0; i < pos; i++) {
      if (i >= strArr.length) {
        return -1;
      }

      // +1 because we split out some characters
      charCount += strArr[i].length + char.length;
    }

    return charCount;
  }
};

// config
var URL_PRESO = "http://preview.vsearcher-newsite.walmartlabs.com/preso/module_engine_category?module_config_json=";
var $txtJsonRaw = $("#json_raw"),
  $txtJsonMinfy = $("#json_minify"),
  $txtJsonEncode = $("#json_encode"),
  $txtJsonBuildUrl = $("#json_build_url");

var $appPreso2json = $("#app_preso2json"),
  $txtUrlRaw = $appPreso2json.find("#url_raw"),
  $output = $appPreso2json.find("#output_url2json");
  $alert = $appPreso2json.find(".alert");

// UI events
//$txtUrlRaw.val("http://preview.vsearcher-newsite.walmartlabs.com/preso/module_engine_category?module_config_json=%7Bzone%7D"); //error json

$txtUrlRaw.val("http://preview.vsearcher-newsite.walmartlabs.com/preso/module_engine_category?module_config_json=%7B%22zone%22%3A1%7D"); //correct json


$("#btn_url2preso").on("click", function () {
  var urlRaw = $txtUrlRaw.val();
  if (!$.trim(urlRaw)) {
    throw new Error("#btn_url2preso: value is empty");
  }

  var jsonEncoded = urlRaw.replace(URL_PRESO, ""),
    jsonDecoded = PresoJsonUtil.decodeURL(jsonEncoded),
    result;

  //validate json
  try {
    result = jsl.parser.parse(jsonDecoded);
    $.log("result=", result);

    if (result) {
      //success: output json and hide alert
      var jsonFormatted = PresoJsonUtil.formatJSON(jsonDecoded, 2);
      $alert.addClass("hidden");
      $output
        .removeClass("hidden")
        .find(".prettyprint")
        .removeClass("prettyprinted")
        .html(jsonFormatted);
      prettyPrint();
    }
  } catch (parseException) {
    //reformat for better error message
    try {
      var jsonVal = jsl.format.formatJson(jsonDecoded);
      result = jsl.parser.parse(jsonVal);

    } catch(parseException) {
      //error: alert and hide output
      $alert
        .removeClass("hidden")
        .html(parseException.message);
      $output.addClass("hidden");
    }
  }

  $.log("jsonEncoded=", jsonEncoded);
  $.log("jsonDecoded=", jsonDecoded);
});


$("#btn_one_click").on("click", function () {
  var jsonRaw = $txtJsonRaw.val(),
    jsonMinified,
    jsonEncoded,
    urlPresoCategory;

  if (!$.trim(jsonRaw)) {
    throw new Error("#btn_one_click: value is empty");
  }
//minify
  jsonMinified = PresoJsonUtil.minifyJSON(jsonRaw);

//encode URL
  jsonEncoded = PresoJsonUtil.encodeURL(jsonMinified);

//construct Preso URL
  urlPresoCategory = PresoJsonUtil.constructURL(URL_PRESO, jsonEncoded);

  $.log("jsonMinified=", jsonMinified);
  $.log("urlPresoCategory=", urlPresoCategory);

  $("#url_one_click").prop("href", urlPresoCategory).text("Generated Preso URL");
});


$("#btn_minify").on("click", function () {
  var jsonRaw = $txtJsonRaw.val(),
    jsonMinified;

  if ($.trim(jsonRaw)) {
    jsonMinified = PresoJsonUtil.minifyJSON(jsonRaw);
    $txtJsonMinfy.val(jsonMinified);

    $.log("jsonRaw=", jsonRaw);
    $.log("jsonMinified=", jsonMinified);
  }
});

$("#btn_encode").on("click", function () {
  var jsonMinified = $txtJsonMinfy.val(),
    jsonEncoded;
  if ($.trim(jsonMinified)) {
    $txtJsonEncode.val(PresoJsonUtil.encodeURL(jsonMinified));
  }
});

$("#btn_build").on("click", function _buildUrl() {
  var urlParam = $txtJsonEncode.val(),
    urlPresoCategory = "";

  if (urlParam) {
    urlPresoCategory = URL_PRESO + urlParam;
    $txtJsonBuildUrl.val(urlPresoCategory);
  }
});
