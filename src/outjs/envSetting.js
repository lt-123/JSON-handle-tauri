/**
	_pri["request"] = JH.request(_pub);
	"setIniRequest" : _pri.request.create(JH.request.NS.jsonH, 'setIni'),
	"getIniRequest" : _pri.request.create(JH.request.NS.jsonH, 'getIni'),

	
	"setIni" : _pri.request.create(JH.request.NS.opt, 'setIni'),
	"getIni" : function (cb) {
		_pri.request.create(JH.request.NS.opt, 'getIni', {
			succeed : function (oIni) {
				cb(oIni);
			}
		}).send();
	},
*/

var config = {
	mode : 'request'
};




JH.request = JH.newFun(function (JH) {
	var _fun = function (oSrc) {
		var _oSrc = oSrc, _oRequestData, _oResponseData;

		//JH.modNS.jsonH.language = 'zh-cn';
		return {
			"create" : function (ns, sKey, oSpec) {
				var oRe;
				var buildSend = function (fn) {
					return {
						send : function (oRequestData) {//console.log(oRequestData);
							fn(oRequestData, function (oData) {
								if(oSpec && oSpec.succeed) {
									oSpec.succeed.apply(_oSrc, [oData, oRequestData]);
								}
							});
						}
					};
				};

				switch(sKey) {
					case 'openTab':
						oRe = buildSend(function (oRequestData, fResponse) {
							chrome.runtime.sendMessage({cmd:'openTab', data:oRequestData}, function(response) {
								var oData = {
									code : 1,
									msg : 'ok',
									data : response
								};
								fResponse(oData);
							});
						});
						break;
					case 'getJson':
						oRe = buildSend(function (oRequestData, fResponse) {
							chrome.runtime.sendMessage({cmd:'getJson', id: oRequestData}, function(response) {
								var oData = {
									code : 1,
									msg : 'ok',
									data : response
								};
								fResponse(oData);
							});
							
							// var oData = {
							// 	code : 1,
							// 	msg : 'ok',
							// 	data : oRequestData
							// };
							// fResponse(oData);
						});
						break;
					case 'getAdData':
						oRe = buildSend(function (oRequestData, fResponse) {
							chrome.runtime.sendMessage({
								cmd:'getAdData',
								data : {
									url : oRequestData.url
								}
							}, function(response) {
								var oData = {
									code : 1,
									msg : 'ok',
									data : response
								};
								fResponse(oData);
							});
						});
						break;
					case 'setIni':
						oRe = buildSend(function (oRequestData, fResponse) {
							jsonhandleCommon.setIni(oRequestData, function(oIni) {
								var oData = {
									code : 1,
									msg : 'ok',
									data : oRequestData
								};
								fResponse(oData);
							});
						});
						break;
					case 'getIni':
						oRe = buildSend(function (oRequestData, fResponse) {
							jsonhandleCommon.getIni(oIni => fResponse({
								code : 1,
								msg : 'ok',
								data : oIni
							}));
						});
						break;
					
				}

				return oRe;

			}
		};
	};

	return JH.mergePropertyFrom(_fun, {
		"NS" : {
			'jsonH' : {},
			'opt' : {}
		}
	});
});

parseHTML = {};
parseHTML.s = ['inner'];




JH["elementHtml"] = function (el, sHtml) {
	var s = parseHTML.s.concat(['HTM']).join('');
	if(sHtml !== undefined) {
		//parseHTML(document, sHtml, true, 'chrome://jsonhandle/content/JSON-handle/JSON-handle.html', false);
		el[s+'L'] = sHtml;
		return el;
	}else{
		return el[s+'L'];
	}
};


JH["parseHTML"] = function (html) {
	var eF = document.createDocumentFragment();
	//var parser = new DOMParser();
	//var doc = parser.parseFromString(html, 'text/html');
	
	//[].slice.call(doc.body.children).forEach(function (e) {
		//eF.appendChild(e);
	//});
	eF.innerHTML = html;

	return eF;
};











