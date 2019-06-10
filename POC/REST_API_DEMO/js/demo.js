/**
 * Created by ctouret on 7/20/16.
 */
function Demo() {};

var demo = new Demo();


Demo.prototype = function() {


    // ******** Configuration

    //REST Server
	var MyAuthValueIs ="";
    var RESTServerIP = "POTWSWD00035LA.stg-tfayd.com"; // Logical name of the REST Server
    var RESTServerPort = "8080"; // Port of the REST Server
    var ContentType = "application/json"; // To be added in each request as a request header
    var isHttps = false;
	var baseURLValue = "http://POTWSWD00035LA.stg-tfayd.com:8080/MicroStrategyLibrary/api";
	//var baseURLValue = "http://localhost:9191/MicroStrategyLibraryUP1/api";
	var dossierURL = "http://localhost:9191/MicroStrategyLibraryUP1/app"+"/31188E4E11E36E772CCE00802F37C64D/BA207C2F4538D02CECCD5D9B73B021F6"; //Selector Dossier
	var dossierURL1= "http://POTWSWD00035LA.stg-tfayd.com:8080/MicroStrategyLibrary/app/27DB4F8F4E17CD2FC97B05B96F292F5C/3B44E08940D77A280A62B68C76874F6B";
	var virtualDirectoryName = "/MicroStrategyLibraryUP1";
	var loginUrl = '/auth/login';
	//var finalLoginURL = baseURLValue+loginUrl;
	var finalLoginURL = "http://potwswd00035la.stg-tfayd.com:8080/MicroStrategyLibrary/api/auth/login";
    //MicroStrategy Intelligence Server
    var IServerName = "potapwd00068.stg-tfayd.com"; // Logical name of the MicroStrategy IServerName
    var IServerPort = 34952; // Port of the MicroStrategy IServer
    var projectName = "SMS"; // Name of the MicroStrategy Project
    var usernameVal = "206442196"; // Credentials to connect to the MicroStrategy Project
    var passwordVal = "1234";
    var loginModeVal = 1;
	var AuthTokenVal = "" ; 
	var jsonDataArray = [];
	var FilterValue = "2020";
    //var reportID = "EE4931FC49AE564BC6EF4B81D1B7622B";
    //var reportID = "524C755B4AE8373AE7D594ACAC0331FC"; -- 10.4
    //var reportID = "3655A4F24B501664FDE8B28F8FAF5F78";

    // var reportID = "81FE14354AAEBB6D20CADCBE24A09FAA"; Cube based report
  //  var reportID = "B3C459974563E17AC5FD86AE3C03A19B"; //Manali's report
   // var reportID = "18555F234F25596A1E87D79CACE87EE9"; //$B
	var reportID = "A1C0405F4BBBEA26037BD9ADF525E47E"; //$B COPY
    // var reportID = "E84C97164BBECE4C2686DF87A2BDAAE8";
    // var projectID = "31188E4E11E36E772CCE00802F37C64D";
    //file:///C:/Users/sbharal/Desktop/MSTR%20REST%20API%20DEMO/REST_API_DEMO_v1.0/MSTR_REST_API_SDK_DEMO.html
    // ******** Global variables

    // Endpoint URL variables
    var base_url;
    var base_url_reportData;
    var target = "datasets/";
    var endpoint_url;
    var endpoint_url_reportData;
    var json; // Contains the retrieved json output
    var authToken; // Contains the session id which will be used in every api call
	var authToken1="test";
    var editor; // Contains the ACE editor of the body request in json
    var reportJSONResponse;
    var jsonReportData;
    var mstrReportName;
	
	//GET REPORT Data variables
	 var trStartStringForHeader = "<tr class='reportHeaderClass' >";
     var trEndStringForHeader = "</tr>";
     var trStartStringForData = "<tr class='reportDataClass' >";
     var trEndStringForData = "</tr>";
	 var dataRow;
	 var headerRow;
     var attributeListLength;
     var metricListLength;
     var dataListLength;
     var headerIndex;
	 var dataRowCounter;
	 var value1 = '4,740,914,631';
	 var postData = {};
     postData.username = '206442196';
			postData.password = '1234';
            postData.loginMode = 1;
    // ******** Public Functions

	function formatValue(n, currency) 
	{
		return currency + n.toFixed(0).replace(/./g, function(c, i, a) 
	{
		return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
	});
	}
    var start = function start() {
            /*  Instructions to be done when loading the js*/
            initServerConfigurationVariables();

            initRequestEditor();

            initTabNav();

            createSession(); //Create session
        },
		embeddingAPIPage = function embeddingAPIPage()
		{
			embeddingAPIPageSetup();
		},
        searchPage = function searchPage() {
            setupSearchPage();
            $("#searchBody").css("visibility", "visible");
        },
        createDataset = function createDataset() {
            /*  Create a dataset using the request body and the chosen file */

            var requestBody = editor.getValue();
            var file = $('#upload-file').prop("files")[0];

            if (file || requestBody) {
                prepareAndSendDatasetCreationRequest(file, requestBody);
            }
        },
        sendReportDataRequest = function sendReportDataRequest() {
            console.log('Inside sendReportDataRequest');
            setReportIDWithSessionState();
            sendReportJSONDataRequest();
        },

        createSession = function() {
            /*  Create a session using the User Input set in the Servers Configuration tab */
            setServerConfigurationWithUserInputs();
            getMSTRToken();
            //sendSessionCreationRequest();
        };


    // ******** Internal Functions

    function initServerConfigurationVariables() {
        /*  Initialize the IServer and REST server configuration variables with user inputs  */

        $('#iserver-name')[0].value = IServerName;
        $('#iserver-port')[0].value = IServerPort;
        $('#project-name')[0].value = projectName;
        $('#username')[0].value = usernameVal;
        $('#password')[0].value = passwordVal;
        $('#reportid')[0].value = reportID;
        $('#rest-server-name')[0].value = RESTServerIP;
        $('#rest-server-port')[0].value = RESTServerPort;
        $('.myCheckbox').prop('checked', isHttps);
		$('#authTokenRESTAPI')[0].value = AuthTokenVal;
		$('#filterValue')[0].value = FilterValue;
    }

    function initRequestEditor() {
        /*  Initialize the Ace Editor used to create the body of the request in json */

        editor = ace.edit("editor");
        editor.setTheme("ace/theme/github");
        editor.getSession().setMode("ace/mode/json");
        editor.setValue(JSON.stringify(datasetCreator, null, '\t'), 1);
    }



    function initTabNav() {
        /*  Initialize the tabs used for navigation in the demo menu */

        $('#navTabs  a').click(function(e) {
            e.preventDefault()
            $(this).tab('show')
        })

    }
	

    function setupSearchPage() {
        var chart = c3.generate({
            bindto: '#chart_1',
		//	tooltip: {
		//			format: {
						//title: function (d) { return 'category ' + d; },
		//				value: function (value, ratio, id) 
		//					{
		//						var format = id === 'Revenue' ? d3.format(',') : d3.format('$');
		//						return format(value);
		//					}
		//				}
		//			},
					
			tooltip: {
      format: {
        /*...*/
      },
      contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
          var $$ = this, config = $$.config,
              titleFormat = config.tooltip_format_title || defaultTitleFormat,
              nameFormat = config.tooltip_format_name || function (name) { return name; },
              valueFormat = config.tooltip_format_value || defaultValueFormat,
              text, i, title, value, name, bgcolor;
			  
          for (i = 0; i < d.length; i++) 
		  {
			  console.log(i);
              if (! (d[i] && (d[i].value || d[i].value === 0))) { continue; }

              if (! text) {
                  title = titleFormat ? titleFormat(d[i].x) : d[i].x;
				  text = '';
                  text = "<table class='" + $$.CLASS.tooltip + "'>" + (title || title === 0 ? "<tr><th colspan='2'>" + title + "</th></tr>" : "");
              }

              name = nameFormat(d[i].name);
              value = valueFormat(d[i].value, d[i].ratio, d[i].id, d[i].index);
			  totalValue = formatValue(d[i].value,'$');
              bgcolor = $$.levelColor ? $$.levelColor(d[i].value) : color(d[i].id);
			  //text += "<tr class='" + $$.CLASS.tooltipName + "-" + d[i].id + "'>";
			  
			for (z=0;z<jsonDataArray.length;z++)
			{				
				for (k=0;k<jsonDataArray[z].length;k++)
				{
					console.log("Title is :-"+title);
					
					if(jsonDataArray[z][k].trim()===title.trim())
					{
						//console.log("Array is :-"+jsonDataArray[z][k]);
						//console.log("z: "+z	);
						text += "<tr>";
						text += "<td class='name'><span style='background-color:" + bgcolor + "'></span>" + 'Q'+ jsonDataArray[z][2]+ "</td>";
						text += "<td class='value'>" + jsonDataArray[z][3] + "</td>";
						text += "</tr>";
						text += "<tr>";
						console.log("Inside ToolTip Loop"+jsonDataArray[z][3]);
					}	
				}
			}
			  text += "<tr>";
			  text += "<td class='name'><span style='background-color:" + bgcolor + "'></span>" + 'Total' + "</td>";
              text += "<td class='value'>" + totalValue + "</td>";
              text += "</tr>";
			  
             /* 
			  console.log("Tooltip Name:- "+title);
              text += "<td class='name'><span style='background-color:" + bgcolor + "'></span>" + 'Q1' + "</td>";
              text += "<td class='value'>" + jsonDataArray[i][3] + "</td>";
              text += "</tr>";
			  text += "<tr>";
			  text += "<td class='name'><span style='background-color:" + bgcolor + "'></span>" + 'Q2' + "</td>";
              text += "<td class='value'>" + 	 + "</td>";
              text += "</tr>";
			  text += "<tr>";
			  text += "<td class='name'><span style='background-color:" + bgcolor + "'></span>" + 'Q3' + "</td>";
              text += "<td class='value'>" + value + "</td>";
              text += "</tr>";
			  text += "<tr>";
			  text += "<td class='name'><span style='background-color:" + bgcolor + "'></span>" + 'Q4' + "</td>";
              text += "<td class='value'>" + value + "</td>";
              text += "</tr>";
			  text += "<tr>";
			  text += "<td class='name'><span style='background-color:" + bgcolor + "'></span>" + 'Total' + "</td>";
              text += "<td class='value'>" + value + "</td>";
              text += "</tr>";*/
          }
          return text + "</table>";
      }
  },
    
			axis: {
					x: {
						label: 'Marketplace',
						type: 'category',
						categories: ['Not Returning Networks','Calendar', 'Olympics','Scatter','Super Bowl','Upfront','World Cup']
						},
					y: {
						label: 'Total Registration for Year:2018',
						max: 5000000000,
						min: 0,
						padding: {top:0, bottom:0},
						tick: {
								format: d3.format("$")
							  }
					}
					},
            data: {
                columns: [
					['Revenue',335737,555058814,490108272,9044533,37204700,5790372561,1098609]
                   // ['Revenue', 4740914631,1827018019, 490108272, 86998592, 37204700,908660, 618740]
                    //['data2', 120, 100, 140, 200, 150, 50]
                ],

                type: 'bar',
                onclick: function(d, i) {
                    console.log("in my chart " + authToken);
                }

            }

        });

        var chart = c3.generate({
            bindto: '#chart_2',
            data: {
                columns: [
                    ['data1', 30, 200, 100, 400, 150, 250],
                    ['data2', 130, 100, 140, 200, 150, 50],
                    ['data3', 10, 100, 180, 250, 190, 80]
                ],

                type: 'area-spline',
                onclick: function(d, i) {
                    console.log("in my chart " + authToken);
                }

            },
            donut: {
                title: "Iris Petal Width"
            }
        });
        var chart = c3.generate({
            bindto: '#chart_3',
            data: {
                columns: [
                    ['data1', 30],
                    ['data2', 120],
                    ['data3', 80],
                    ['data4', 40],
                ],
                type: 'donut',
                onclick: function(d, i) {

                    console.log("in my chart " + authToken);
                }

            },
            donut: {
                title: "Iris Petal Width"
            }
        });



        var chart = c3.generate({
            bindto: '#chart_4',
            data: {
                // iris data from R

                columns: [
                    ['data1', 30],
                    ['data2', 120]
                ],
                type: 'pie',
                onclick: function(d, i) {
                    console.log("onclick", d, i);
                },
                onmouseover: function(d, i) {
                    console.log("onmouseover", d, i);
                },
                onmouseout: function(d, i) {
                    console.log("onmouseout", d, i);
                }
            }
        });

        setTimeout(function() {
            chart.load({
                columns: [
                    ["setosa", 0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.3, 0.2, 0.2, 0.1, 0.2, 0.2, 0.1, 0.1, 0.2, 0.4, 0.4, 0.3, 0.3, 0.3, 0.2, 0.4, 0.2, 0.5, 0.2, 0.2, 0.4, 0.2, 0.2, 0.2, 0.2, 0.4, 0.1, 0.2, 0.2, 0.2, 0.2, 0.1, 0.2, 0.2, 0.3, 0.3, 0.2, 0.6, 0.4, 0.3, 0.2, 0.2, 0.2, 0.2],
                    ["versicolor", 1.4, 1.5, 1.5, 1.3, 1.5, 1.3, 1.6, 1.0, 1.3, 1.4, 1.0, 1.5, 1.0, 1.4, 1.3, 1.4, 1.5, 1.0, 1.5, 1.1, 1.8, 1.3, 1.5, 1.2, 1.3, 1.4, 1.4, 1.7, 1.5, 1.0, 1.1, 1.0, 1.2, 1.6, 1.5, 1.6, 1.5, 1.3, 1.3, 1.3, 1.2, 1.4, 1.2, 1.0, 1.3, 1.2, 1.3, 1.3, 1.1, 1.3],
                    ["virginica", 2.5, 1.9, 2.1, 1.8, 2.2, 2.1, 1.7, 1.8, 1.8, 2.5, 2.0, 1.9, 2.1, 2.0, 2.4, 2.3, 1.8, 2.2, 2.3, 1.5, 2.3, 2.0, 2.0, 1.8, 2.1, 1.8, 1.8, 1.8, 2.1, 1.6, 1.9, 2.0, 2.2, 1.5, 1.4, 2.3, 2.4, 1.8, 1.8, 2.1, 2.4, 2.3, 1.9, 2.3, 2.5, 2.3, 1.9, 2.0, 2.3, 1.8],
                ]
            });
        }, 1500);

        setTimeout(function() {
            chart.unload({
                ids: 'data1'
            });
            chart.unload({
                ids: 'data2'
            });
        }, 2500);

    }

    function getMSTRToken() {


        var data = JSON.stringify({
            "username": "206442196",
            "password": "1234",
            "loginMode": 1
        });

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        $("#create-session-button").button('loading'); // Start the loader
        $("#login-success-alert").hide();
        $("#login-failure-alert").hide();
        xhr.addEventListener("readystatechange", function() {
            if (this.readyState == this.HEADERS_RECEIVED) {
                // Get the raw header string
                var headers = this.getResponseHeader('X-MSTR-AuthToken');
                authToken = headers;
                console.log("AuthToken is :-" + authToken);
				MyAuthValueIs = authToken;
                if (authToken) {
						
                    $("#create-session-button").button('reset'); // Stop the loader
                    $("#login-success-alert").show();
					$('#authTokenRESTAPI')[0].value = authToken;
					//$('#auth-token-value').show();
					//$('#authToken-Value')[0].val('TEST');
				
                } else {
                    $("#create-session-button").button('reset'); // Stop the loader
                    $("#login-failure-alert").show();
                }
            }

        });

        //xhr.open("POST", "http://potwswi00013la.stg-tfayd.com:8080/MicroStrategyLibrary/api/auth/login");
		
		
        xhr.open("POST", finalLoginURL);
        xhr.setRequestHeader("content-type", "application/json");
        xhr.send(data);
    }
	function getEmbeddedAuthToken($http) {

    //application/x-www-form-encoded form data
    var credentials = 'username=' + '206442196' + '&loginMode=1&password=' + '1234';
    //var loginUrl = '/auth/login';
	//var BASE_EURL= baseURLValue;
    return $http({
        url: finalLoginURL,
        method: "POST",
        data: credentials,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest'
        }
    });
	}
	
	function getXHRRequestPromise(url, body, method, contentType, desiredHeader) {
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open(method, url);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send(JSON.stringify(body));

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 2) {
                    resolve(xhr.getResponseHeader(desiredHeader));
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                }
            };
        });
    };
	
  
  var promptFilters=[{

    "key": "2F5105034624445B3D10BB849BD9C00A",
    "selections": [{
      "id":"h2016;D97BBAAE4FB6F22915A833A8BBFF971B;2016"
    }]
  }];
	function embeddingAPIPageSetup()
	{	
		 FilterValue = $('#filterValue')[0].value;
		 var filterList = 
		 [
		 {
   "name": "Year", 
      "selections": [        
	  {"name":FilterValue} //You can change to the actual attribute element name.
      ]
    }
  ];
	//206502948
		var myDossier;
		var promptURL ="http://potwswd00035lb.stg-tfayd.com:8080/MicroStrategyLibrary/api/documents/3B44E08940D77A280A62B68C76874F6B/instances/D79C58314EF40AB0FFB6AAB71992BF3C/prompts/answers";
		var postData = {};
			postData.username = "206442196";
			postData.password = "1234";
			postData.loginMode = 1;
			
        var container = document.getElementById("mydossier"),
        //url = "http://localhost:9191/MicroStrategyLibrary11/app/31188E4E11E36E772CCE00802F37C64D/7F4DFD4C4EFB6DA6AFB18594882D403F";
		//url = "http://localhost:9191/MicroStrategyLibrary11/app/31188E4E11E36E772CCE00802F37C64D/FF879D34451DE672AD7A7FBC18E443D3"; Working URL 
		  url = baseURLValue+"/31188E4E11E36E772CCE00802F37C64D/BA207C2F4538D02CECCD5D9B73B021F6"; //Selector Dossier
		//url = "http://localhost:9191/MicroStrategyLibrary11/app/31188E4E11E36E772CCE00802F37C64D/8CB503A5486E6726C7FD50A116C188F3"; //Prompted Dossier
		//url = "http://localhost:9191/MicroStrategyLibrary11/app/31188E4E11E36E772CCE00802F37C64D/8E1EF87F4DD9F80E714F43AB398EF7C7" //Prompted selector Dossier
		//url ="http://localhost:9191/MicroStrategyLibrary11/app/31188E4E11E36E772CCE00802F37C64D/6AC258B140988286C90C11BA8FB5B06C"; //Selector Document
		
		//http://localhost:9191/MicroStrategyLibrary11/app/31188E4E11E36E772CCE00802F37C64D/BA207C2F4538D02CECCD5D9B73B021F6 --Dossier selector
		//url = "http://localhost:9191/MicroStrategyLibrary11/app/31188E4E11E36E772CCE00802F37C64D/5D6B0770473F8DE8EE994EA627EFF6E1";
       var getInstanceValue =  microstrategy.dossier.create({
          url: dossierURL1,
          enableResponsive: true,
		  enableCustomAuthentication: true,
		  customAuthenticationType: microstrategy.dossier.CustomAuthenticationType.AUTH_TOKEN,
          placeholder: container,
		// filters: filterList,
		// filters: promptFilters,
		  //navigationBar : {filter:false},
		  filterFeature: {enabled: true,edit: false, summary: false},
		 // loginWithToken:authToken
		 //promptsAnswers:[{"key":"73052CBA42EA3B980718D2B1FD7AB797@0@10","id":"73052CBA42EA3B980718D2B1FD7AB797","useDefault":false,"type":"ELEMENTS","answers":[{"name":"2020/2021"}]}];
		 // promptsAnswers : {"messageName":"$B_Quarterly Dollars over Marketplace - Prompted on Year","answers":[{"key":"2F5105034624445B3D10BB849BD9C00A@0@10","values":["D97BBAAE4FB6F22915A833A8BBFF971B:2019~1048576~2019"],"useDefault":false}]},
		  getLoginToken: function(){	
			return getXHRRequestPromise(finalLoginURL ,postData, 'POST','application/json','X-MSTR-AuthToken').then(function (authTokenEmd)
			{
					return authTokenEmd;
			});
			}
        });
     console.log("Value is := "+JSON.stringify(getInstanceValue));
		
		
	}
    function sendSessionCreationRequest() {
        /*  Send a session creation request  */

        $.ajax({
            type: 'POST',
            url: base_url + "sessions",
            beforeSend: function(xhr) {
                $("#create-session-button").button('loading'); // Start the loader
                $("#login-success-alert").hide();
                $("#login-failure-alert").hide();
            },
            success: function(response) {
                $("#create-session-button").button('reset'); // Stop the loader
                $("#login-success-alert").show();
                authToken = response.authToken;
				
				
            },
            error: function(error) {
                $("#create-session-button").button('reset'); // Stop the loader
                $("#login-failure-alert").show();
                console.log(JSON.Stringify(error));
            }
        });
    }

    function setServerConfigurationWithUserInputs() {
        /*  Set the server configuration variables with the user inputs  */

        IServerName = $('#iserver-name')[0].value;
        IServerPort = $('#iserver-port')[0].value;
        projectName = $('#project-name')[0].value
        username = $('#username')[0].value;
        password = $('#password')[0].value;

        RESTServerIP = $('#rest-server-name')[0].value;
        RESTServerPort = $('#rest-server-port')[0].value;
		AuthTokenVal = $('#authTokenRESTAPI')[0].value;
		FilterValue = $('#filterValue')[0].value;
        isHttps = $('.myCheckbox:checked').val();
		
        base_url = (isHttps ? "https" : "http") + "://" + RESTServerIP + ":" + RESTServerPort + virtualDirectoryName+"/api/auth/login";
        endpoint_url = base_url;
    }

    function setReportIDWithSessionState() {
        /*  Set the server configuration variables with the user inputs  */

        reportID = $('#reportid')[0].value;
        console.log('REPORTid :-', reportID);
        console.log(authToken);
        isHttps = $('.myCheckbox:checked').val();
        //http://localhost:9191/MicroStrategyLibrary10.11/api/reports/E84C97164BBECE4C2686DF87A2BDAAE8
        //http://localhost:9191/MicroStrategyLibrary10.11/api/reports/E84C97164BBECE4C2686DF87A2BDAAE8/instances?limit=1000
        base_url_reportData = (isHttps ? "https" : "http") + "://" + RESTServerIP + ":" + RESTServerPort + virtualDirectoryName+"/api/reports/" + reportID + "/instances?limit=-1";
        // base_url_reportData = "http://localhost:9191/MicroStrategyLibrary10.11/api/reports/E84C97164BBECE4C2686DF87A2BDAAE8/instances?limit=1000";
        console.log('base_url_reportData:-' + base_url_reportData);
        endpoint_url_reportData = base_url_reportData;

    }

    function sendReportJSONDataRequest(datasetCreator) {
        /*  Send the dataset creation request  */
        console.log('Inside sendReportJSONDataRequest ');
        var params = {
            type: 'POST',
            url: endpoint_url_reportData,
            beforeSend: function(xhr) {
                setUpRequestReportHeaders(xhr)
                $("#show-Report-button").button('loading');
            },
            success: function(response) {
                jsonReportData = response;
                console.log(jsonReportData.instanceId);
                console.log(jsonReportData.name);
                console.log(JSON.stringify(jsonReportData));
                mstrReportName = jsonReportData.name;
                attributeList = jsonReportData.result.definition.attributes;
                metricList = jsonReportData.result.definition.metrics;
                dataList = jsonReportData.result.data.root.children;
               // console.log("DATA CHILD COUNT IS :- " + dataList.length)
                //console.log(jsonReportData.result.data.root.children[0].metrics.+metricList[1].name+.fv);

                $("#show-Report-button").button('reset'); // Stop the loader

                console.log('Success:----' + response);
                reportJSONResponse = response;
                reportCreationSuccess(response)
                $("#show-Report-button").prop('value', 'Refresh Report')
            },
            error: function(error) {
                $("#show-Report-button").button('reset'); // Stop the loader
                console.log('ErrorSB:----' + JSON.stringify(error));
                reportCreationFailure(error)
            }
        };

        $.extend(params, {
            data: JSON.stringify(datasetCreator),
            contentType: ContentType
        });

        $.ajax(params);
    }

    function setUpRequestReportHeaders(xhr) {
        /*  Set up the request header needed for Data Rest API requests */

        xhr.setRequestHeader("X-MSTR-AuthToken", authToken);
        //xhr.setRequestHeader("X-MSTR-ProjectID","31188E4E11E36E772CCE00802F37C64D");
        //xhr.setRequestHeader("Accept", ContentType);
        //xhr.setRequestHeader("x-mstr-authtoken", "plub1lo6pu3m3gfvnqla7njkb");
        xhr.setRequestHeader("x-mstr-projectid", "31188E4E11E36E772CCE00802F37C64D");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("cache-control", "no-cache");
    }

    function reportCreationSuccess(response) {
		dataRow ='';
		dataRowCounter = 0;
		headerRow='';
		headerIndex =0;
		//jsonDataArray ='';
        /*  Handle what should be done once the dataset creation succeeded  */

        //  $("#json-response-container").css("visibility", "visible")
        $("#reportTable").empty();
        $("#label-MSTR-ReportName-successful").css("visibility", "visible");
        $("#show-Report-button").html("Refresh Report Data");
        console.log('MSTR Report Name:-' + mstrReportName);
        $("#label-MSTR-ReportName-successful").text('MSTR Report Name:-' + mstrReportName);
      
        $("#header1").text(attributeList[0].name);
        attributeListLength = attributeList.length;
        metricListLength = metricList.length;
        dataListLength = dataList.length;
        for (var i = 0; i < attributeListLength; i++) {
            headerRow = headerRow + ('<th id=header_' + i + '>' + attributeList[i].name + '</th>');
            headerIndex = headerIndex + i;
        }
        for (var j = 0; j < metricListLength; j++) {
            headerRow = headerRow + ('<th id=header_' + headerIndex + '>' + metricList[j].name + '</th>');
        }
        var finalHeaderRow = trStartStringForHeader + headerRow + trEndStringForHeader;
        $("#reportTable").append(finalHeaderRow);
        
        for (var x = 0; x < dataListLength; x++) 
		{
			
            dataRowCounter = 0;
            dataRow = dataRow + ('<td id=' + x + '_data_' + dataRowCounter + '>' + dataList[x].element.name + '</td>');
			console.log("Value in First"+dataList[x].element.name);
            dataRowCounter++;
            var arrayNode = dataList[x];
			var arrayNodeChild = dataList[x];
            var childrenCount = dataList[x].children.length;
            var subChildrenCount = 0;
            var children2Count = 0;
            //console.log('Children count is :-' + dataList[x].children.length)
            //console.log("CHILD 2 count IS :- " + children2Count);
            //jsonReportData.result.data.root.children;
           //console.log("Maxxxxx count IS :- " + arrayNode.children[0].children[3].element.name);
			//countChildrenNodes(arrayNode);
			var lengthVal = 0;
			

			
			for(h=0;h<childrenCount;h++)
			{
				if(dataList[x].children[h].children)
				{	
					subChildrenCount = dataList[x].children[h].children.length;
				}
			}
				/*
				console.log("ALLLLLL "+dataList[x].children[h].children[0].element.name);
				console.log("ALLLLLL "+dataList[x].children[h].children[1].element.name);
				console.log("ALLLLLL "+dataList[x].children[h].children[2].element.name);
				console.log("ALLLLLL "+dataList[x].children[h].children[3].element.name);
				console.log("METRIC " +Object.values(dataList[x].children[h].children[0].metrics)[0].fv);
				console.log("METRIC " +Object.values(dataList[x].children[h].children[1].metrics)[0].fv);
				console.log("METRIC " +Object.values(dataList[x].children[h].children[2].metrics)[0].fv);
				console.log("METRIC " +Object.values(dataList[x].children[h].children[3].metrics)[0].fv);
				
				//console.log("TEZ 12: " +childrenCount);
				}
				else
				{
					subChildrenCount = dataList[x].children.length;
					//console.log("TEZ 34: " +childrenCount);
					
				}*/
				//searchChildNode(arrayNode,subChildrenCount,metricListLength,h);
			//}
			
			//}
			searchChildNode(arrayNode,subChildrenCount,metricListLength,childrenCount);
			console.log("bachoo ka count hai :- "+children2Count);
            function searchChildNode(arrayNode,subChildrenCount,metricListLength,childrenCount) 
			{
				var keyValue;
				//console.log("SUB CHILD COUNT : "+l);
                $.each(arrayNode, function(key, value) 
				{
                    if (key == 'children') 
					{	
						keyValue= 'children';
						//console.log("Series " +JSON.stringify(arrayNode));
						if(arrayNode.children)
						{
						 
                        var dataListIndex = Number(p) + Number(attributeListLength + 1);
                        console.log('ChildrenValue =' + arrayNode.children[0].element.name);
                       // dataRow = dataRow + ('<td id=' + x + '_data_' + dataRowCounter + '>' + arrayNode.children[0].element.name + '</td>');
                        //dataRowCounter++;
                        arrayNode = arrayNode.children[0];	
						if(arrayNode.children)
						{
							researchChildNode(arrayNode,subChildrenCount,metricListLength,x,childrenCount,dataRow,dataRowCounter,keyValue);
						}
							searchChildNode(arrayNode,subChildrenCount,metricListLength,childrenCount);
						}
					}
                    if (key == 'metrics') 
					{
                        for (var p = 0; p < metricListLength; p++) 
						{
                           // dataRow = dataRow + ('<td id=' + x + '_data_' + dataRowCounter + '>' + Object.values(arrayNode.metrics)[p].fv + '</td>');
                           // dataRowCounter++;
							 keyValue = 'metrics';
                            console.log('ChildrenValue Metric ='+Object.values(arrayNode.metrics)[p].fv);
							//researchChildNode(arrayNode,subChildrenCount,metricListLength,x,childrenCount,dataRow,dataRowCounter,keyValue);
                        }
					}
            });
		//	 var finalDataRow = trStartStringForData + dataRow + trEndStringForData;
        //    $("#reportTable").append(finalDataRow);
            dataRow = '';
			
            
        }
    }
	createJsonData();
	}
	function createJsonData()
	{
		var viewData = { employees : [] };
		var rowNum = -1; 
		function onGeneratedRow(columnsResult)
		{
				var jsonData = {};
				columnsResult.forEach(function(column) 
				{
					var columnName = column.metadata.colName;
					jsonData[columnName] = column.value;
				});
			viewData.employees.push(jsonData);
		}
		
		for(i=0;i<jsonDataArray.length;i++)
		{
			console.log('JSONDATA ARRAY at '+[i]+'is :'+jsonDataArray[i]);
			console.log(jsonDataArray[i][3]);
		}
	}
	
	function researchChildNode(arrayNode,subChildrenCount,metricListLength,x,childrenCount,dataRow,dataRowCounter,keyValue) 
	{
		var childrenCount = dataList[x].children.length;
		for (h=0;h<childrenCount;h++)
		{
			dataRow = dataRow + ('<td id=' + x + '_data_' + dataRowCounter + '>' + dataList[x].children[h].element.name + '</td>');
            dataRowCounter++;
			dataRow = dataRow + ('<td id=' + x + '_data_' + dataRowCounter + '>'+'<table>');
			for(s=0;s<subChildrenCount;s++)
			{
				//console.log("TEZ: " +s);
				if(dataList[x].children[h])
				{	
				//subChildrenCount = dataList[x].children[h].children.length;
				var tempArray = [dataList[x].element.name,dataList[x].children[h].element.name,dataList[x].children[h].children[s].element.name,Object.values(dataList[x].children[h].children[s].metrics)[0].fv];
				 jsonDataArray.push(tempArray);
				 dataRow = dataRow + ('<tr><td>'+ dataList[x].children[h].children[s].element.name+'</td></tr>');
				 dataRowCounter++;
				 console.log("DataRow Counter 1:- "+dataRowCounter);
				 console.log("ALLLLLL "+dataList[x].children[h].children[s].element.name);
				
				}	
			}
			dataRow = dataRow +('</table>'+'</td>');
		}
		for (h=0;h<childrenCount;h++)
		{
			dataRow = dataRow + ('<td id=' + x + '_data_' + dataRowCounter + '>'+'<table>');
			for(s=0;s<subChildrenCount;s++)
			{
				
				if(dataList[x].children[h])
				{	
				 dataRow = dataRow + ( '<tr><td>'+Object.values(dataList[x].children[h].children[s].metrics)[0].fv+'<td></tr>');
                 dataRowCounter++;
				 console.log("DataRow Counter 2 :- "+dataRowCounter);
				 console.log("METRIC " +Object.values(dataList[x].children[h].children[s].metrics)[0].fv);
				}
				
			}	
			dataRow = dataRow +('</table>'+'</td>');
		}
		var finalDataRow = trStartStringForData + dataRow + trEndStringForData;
		$("#reportTable").append(finalDataRow);
		dataRow = '';
	}
	/*		
	for(r=0;r<subChildrenCount;r++)
	{
		//console.log("R counter is :" +r);
		$.each(arrayNode, function(key, value) 
				{
					if (key == 'children') 
					{
						if(arrayNode.children)
						{
							console.log('ChildrenChildValue =' + arrayNode.children[r].element.name);
						}
						arrayNode = arrayNode.children[r];
						researchChildNode(arrayNode,subChildrenCount,metricListLength,x);
					}
					if(key == 'metrics')
					{
						for (var p = 0; p < metricListLength; p++) 
						{
						console.log('ChildrenChildValue Metric ='+Object.values(arrayNode.metrics)[p].fv);
						}
					}
				}); */
					/*	
                    if (key == 'children') 
					{	
						//for(r=0;r<3;r++)
						//{
						console.log("Series " +JSON.stringify(arrayNode));
						if(arrayNode.children)
						{
                        dataListIndex = Number(p) + Number(attributeListLength + 1);
                        console.log('ChildrenValue =' + arrayNode.children[r].element.name);
                        dataRow = dataRow + ('<td id=' + x + '_data_' + dataRowCounter + '>' + arrayNode.children[r].element.name + '</td>');
                        dataRowCounter++;
                        arrayNode = arrayNode.children[r];	
						researchChildNode(arrayNode,l,metricListLength,x);
						//}
						}
					}
                    if (key == 'metrics') 
					{
                        for (var p = 0; p < metricListLength; p++) 
						{
                            dataRow = dataRow + ('<td id=' + x + '_data_' + dataRowCounter + '>' + Object.values(arrayNode.metrics)[p].fv + '</td>');
                            dataRowCounter++;
                            console.log('ChildrenValue Metric ='+Object.values(arrayNode.metrics)[p].fv);
                        }
					}
            });
			var finalDataRow = trStartStringForData + dataRow + trEndStringForData;
            $("#reportTable").append(finalDataRow);
            dataRow = '';*/
		//}
	//}

    function reportCreationFailure(error) {
        /*  Handle what should be done once the dataset creation failed  */

        // $("#json-response-container").css("visibility", "visible");
        $("#label-MSTR-ReportName-successful").css("visibility", "hidden");
        //  $("#json-response").append("\n"+ JSON.stringify(error, null, 4));
        console.log(error);
    }

    function prepareAndSendDatasetCreationRequest(fileInput, requestInput) {
        /*  From the chosen file and the body request, prepare and send the request for a dataset creation  */

        var reader = new FileReader();
        reader.readAsDataURL(fileInput);

        reader.onload = function() {
            var binaryString = reader.result;
            console.log('reader.result:- ' + binaryString);
            var binaryStringAdjusted = binaryString.split("base64,")[1];
            datasetCreator = prepareDatasetCreator(requestInput, binaryStringAdjusted);
            sendDatasetCreationRequest(datasetCreator)
        };
        reader.onerror = function(error) {
            console.log('Error: ', error);
        };
    }

    function prepareDatasetCreator(request, data) {
        /* Prepare the dataset creator  */

        var mDatasetCreator = JSON.parse(request); // Parse the request input into json
        mDatasetCreator.tables[0].data = data; // Add the data from the chosen file into the request
        //console.log('data:-'+JSON.stringify(data,null,4));
        //console.log('mDatasetCreator:-'+JSON.stringify(mDatasetCreator,null,4));
        return mDatasetCreator;
    }

    function sendDatasetCreationRequest(datasetCreator) {
        /*  Send the dataset creation request  */

        var params = {
            type: 'POST',
            url: baseURLValue+'/datasets',

            beforeSend: function(xhr) {
                setUpDataSetRequestHeaders(xhr)
                $("#create-dataset-button").button('loading'); // Start the loader
                $("#json-response").remove();
                
            },
            success: function(response) {
                $("#create-dataset-button").button('reset'); // Stop the loader

                datasetCreationSuccess(response)
            },
            error: function(error) {
                $("#create-dataset-button").button('reset'); // Stop the loader
                datasetCreationFailure(error)
            }
        };

        $.extend(params, {
            data: JSON.stringify(datasetCreator),
            contentType: ContentType
        });
        console.log('data:--' + JSON.stringify(datasetCreator));
        console.log();
        $.ajax(params);
    }

    function setUpDataSetRequestHeaders(xhr) {
        /*  Set up the request header needed for Data Rest API requests */

        xhr.setRequestHeader("X-MSTR-AuthToken", authToken);
        xhr.setRequestHeader("x-mstr-projectid", "31188E4E11E36E772CCE00802F37C64D");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.setRequestHeader("Accept", ContentType);
    }

    function datasetCreationSuccess(response) {
        /*  Handle what should be done once the dataset creation succeeded  */

        $("#json-response-container").css("visibility", "visible")
        $("#label-dataset-creation-successful").css("visibility", "visible")
        $("#json-response").append("\n" + JSON.stringify(response, null, 4));

    }

    function datasetCreationFailure(error) {
        /*  Handle what should be done once the dataset creation failed  */

        $("#json-response-container").css("visibility", "visible");
        $("#label-dataset-creation-successful").css("visibility", "hidden")
        $("#json-response").append("\n" + JSON.stringify(error, null, 4));
        console.log(error);
    }

    return {
        start: start,
        searchPage: searchPage,
		embeddingAPIPage: embeddingAPIPage,
        sendReportDataRequest: sendReportDataRequest,
        reportJSONResponse: reportJSONResponse,
        mstrReportName: mstrReportName,
        createDataset: createDataset,
        createSession: createSession
    };
}();