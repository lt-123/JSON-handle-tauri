
JH.mod.add(['JSON'], 'treeNav', function (modName, JH, $$) {
	var _interface = [], _pri_static = {}, _pro_static = {};

	var _pub_static = function (sId) {
		var _checkArgs, _parseDOM, _init, _uiEvt, _custEvt, _airEvt, _main, _this = this, _args = arguments, _pri = {}, _pro = {}, _pub = {__varyContext_:function (pro, pub) {_pro = pro;_pub = pub;}}, _mod, _base, _parent;



		_main = function () {
			_pub = JH.mod.init(_pub_static, _this, _pro, _pub, _pro_static, _interface).pub;
			_pub.JSON = $$.JSON();
			_pri.level = [0];
			_pri.event = JH.event.buildEvent(_pub);


		};



		_checkArgs = function () {
			if(!sId) {
				JH.throwLine('缺少模块入口节点id');
			}
		};




		_parseDOM = function () {

			_pri.checkCur();

		};




		_uiEvt = function () {
			$(sId).on('mousedown', '.elmBlock', _pri.uiEvtCallback.mousedowElmBlock);
			$(sId).on('dblclick', '.elmBlock', _pri.uiEvtCallback.dblclicElmBlock);
			$(sId).on('mouseover', '.elmBlock', _pri.uiEvtCallback.mouseoveElmBlock);
			$(sId).on('mouseout', '.elmBlock', _pri.uiEvtCallback.mouseouElmBlock);
			$(sId).on('click', '.table-view', _pri.uiEvtCallback.clickTableView);
		};



		_custEvt = function () {
			_pri.event.define('clickElm');
			_pri.event.define('overElm');
			_pri.event.define('outElm');
			_pri.event.define('drawElm');
		};




		_airEvt = function () {

		};



		JH.mergePropertyFrom(_pri, {

			uiEvtCallback : {
				clickTableView : function (evt) {
					var eT = $(evt.target);
                    var eElm = eT.closest('.elmBlock')[0];
					if(eElm) {
                        if (!_pro.clickTableViewCallback(eElm)) {
                            evt.stopPropagation();
                            evt.preventDefault();
                        }
					}
					return false;
				},
				dblclicElmBlock : function () {
					_pri.toggleList(this);
					return false;
				},
				mousedowElmBlock : function (evt) {;
					var eT = $(evt.target);
                    if ($(eT).closest('.table-view').length > 0) {
                        return;
                    }
                    if(
                        (eT.closest('.row').length > 0 && (eT.hasClass('ico') || eT.closest('.elmBox').length > 0))
                        || eT.closest('.elmTable').length > 0
                    ) {
                        _pri.actElm(this, evt);
                        return false;
                    }
					_pri.toggleList(this);
					return false;
				},
				mouseoveElmBlock : function (eBlock) {
					_pro.overElmCallback(this);
					_pri.event.fire('overElm', eBlock);
					return false;
				},
				mouseouElmBlock : function (eBlock) {
					_pro.outElmCallback(this);
					_pri.event.fire('outElm', eBlock);
					return false;
				}
			},
			"encodeToXMLchar" : function (sValue) {
				sValue += '';
				return sValue.replace(/\&/g,'&amp;').replace(/\</g,'&lt;').replace(/\>/g,'&gt;').replace(/\"/g,'&quot;');
			},
			"toggleList" : function (elm) {
				//$('>.elmList', elm).toggle();
				//if($('>.elmList', elm).css('display') === 'none') {
					//$(elm).removeClass('open');
				//}else{
					//$(elm).addClass('open');
				//}
				$(elm).toggleClass('open');
				_pro.changeFlodCallback();
			},
			"actCur" : function (eCurTemp) {
				eCurTemp.toggleClass('cur');
				_pri.eCur.toggleClass('cur');
				_pri.eCur = eCurTemp;
			},
			"checkCur" : function () {
				_pri.eCur = $('.cur').eq(0);
				$('.cur').removeClass('cur');
				_pri.eCur.addClass('cur');
			},
			"actElm" : function (eBlock, evt) {
				_pri.actCur($(eBlock));

				_pro.clickElmCallback(eBlock);
				_pri.event.fire('clickElm', {elm:eBlock, evt:evt});

			},
			"drawElmFunByHtml" : function (value, key) {
				return _pri.getDrawElmHtml(value, key, this);

			},
			"parsePath" : function (aPath) {
				aPath = [].concat(aPath);

				var sPath = '';
				var aPathObj = [];
				JH.forEach(aPath, function (o, i) {//debugger;
					var sKey = o + '';
					if(sKey.match(/^[a-zA-Z_]\w*$/)) {

						aPathObj.push({type:'point', value:sKey});
					}else if(sKey.match(/^\d+$/)) {

						aPathObj.push({type:'bracketNumber', value:sKey});
					}else{

						aPathObj.push({type:'bracket', value:sKey});
					}
				});
				var mergePath = function (aPathObj) {
					var sPath = '';
					JH.forEach(aPathObj, function (o) {
						if(o.type === 'point') {
							sPath += '.' + o.value;
						}else if(o.type === 'bracketNumber') {
							sPath += '[' + o.value + ']';
						}else{
							sPath += '["' + o.value + '"]';
						}
					});
					return sPath;
				};
				var sPath = mergePath(aPathObj).slice(1);
				aPathObj.pop();
				return {
					sParent : mergePath(aPathObj).slice(1),
					toString : function () {
						return sPath;
					},
					v : sPath
				};
			},
			"elmBlockHash":{},
			"nodePathCache":[],
			"fixStrNullBug": function (type, value) {
				if (type == 'string' && !value) {
					value = ' ';
				}
				return value;
			},
            "isValidArray": function (arr) {
                // 检查是否是数组
                if (!Array.isArray(arr)) {
                    return false;
                }
             
                // 如果没有元素，直接返回 true（可根据需求调整）
                if (arr.length < 1) {
                    return false;
                }
             
                // 获取第一个对象的 keys 作为基准
                const firstObjectKeys = Object.keys(arr[0]);
             
                // 检查每个元素是否都是对象，且 keys 一致，值不是数组或对象
                for (let i = 0; i < arr.length; i++) {
                    const item = arr[i];
             
                    // 检查是否是对象
                    if ({}.toString.call(item) != '[object Object]' || item === null) {
                        return false;
                    }
             
                    // 检查 keys 是否一致
                    const currentObjectKeys = Object.keys(item);
                    if (currentObjectKeys.sort().join(',') !== firstObjectKeys.sort().join(',')) {
                        return false;
                    }
             
                    // 检查每个值是否都不是数组或对象
                    for (const key in item) {
                        if (Array.isArray(item[key]) || {}.toString.call(item[key]) == '[object Object]') {
                            return false;
                        }
                    }
                }
             
                return true;
            },
			"getDrawElmHtml" : function (oData, sKey, targetBox) {//debugger;
				sKey = (sKey === undefined ? 'JSON' : sKey);
				_pri.nodePathCache.push(sKey);
				var sType, nextTarget = {}, elmBlock = {};
				oData = typeof oData === 'undefined' ? null : oData;
				targetBox = targetBox || {};
				_pri.level[_pri.level.length - 1] = _pri.level[_pri.level.length - 1] + 1;
				if(oData instanceof Array) {
					sType = 'array';
				}else if({}.toString.call(oData)  === '[object Number]') {
					sType = 'number';
				}else if(typeof oData === 'string') {
					sType = 'string';
				}else if(typeof oData === 'boolean') {
					sType = 'boolean';
				}else if(oData === null) {
					sType = 'null';
				}else{
					sType = 'object';
				}

				var sLevel = _pri.level.slice(0).join('_');
				if(targetBox.tagName && targetBox.tagName === 'UL') {
					elmBlock.tagName = ('li');
				}else{
					elmBlock.tagName = ('div');
				}
				elmBlock.className = 'elmBlock ' + _pro.icoConfig[sType].className;
				elmBlock.id = sId.slice(1) + '_l'+sLevel.slice(2);
				var showID = '', sValue = '';

				var sElmKeyType = 'object-key';
				if(targetBox.elmType === 'array') {
					sElmKeyType = 'array-key';
				}
				var leng = -1;
				if(sType === 'array') {
					leng = oData.length;
				}else if(sType === 'object') {
					leng = Object.keys(oData).length;
				}
                var canTable = false;
                if (sType == 'array' && leng > 1) {
                    canTable = _pri.isValidArray(oData);
                }
				var sImg = '', sHasImgClass = '';
				if(_pub.showAllImg) {
					if(_pri.isImgUrl(oData)) {
						sImg = '<br /><img src="'+_pri.encodeToXMLchar(sV.slice(1, -1))+'" />';
						elmBlock.className += ' imgUrl';
						sHasImgClass = 'has-img';
					}
				}

				if(sType === 'array' || sType === 'object') {
					nextTarget.tagName = 'UL';
					nextTarget.html = '<ul class="elmList">';
					nextTarget.htmlEnd = '</ul>';
				}

				var nextTargetHtml = [];

				if(sType === 'array') {
					_pri.level.push(0);
					nextTarget.elmType = 'array';
					JH.forEach(oData, function (v,k) {
						nextTargetHtml.push(_pri.drawElmFunByHtml.bind(nextTarget)(v,k));
					});
					_pri.level.pop();
				}else if(sType === 'object') {
					_pri.level.push(0);
					var aKey = Object.keys(oData);
					if (_pub.oIni.sortKey) {
						aKey = aKey.sort();
					}
					JH.forEach(aKey, function (k) {var v = oData[k];
						nextTargetHtml.push(_pri.drawElmFunByHtml.bind(nextTarget)(v,k));
					});
					_pri.level.pop();
				}
				nextTargetHtml = nextTargetHtml.join('');

				elmBlock.oData = oData;
				elmBlock.sKeyName = sKey;
				elmBlock.sType = sType;
				elmBlock.nodePath = _pri.parsePath(_pri.nodePathCache);
				_pri.elmBlockHash[elmBlock.id] = elmBlock;

				var sHTML = [
					'<'+elmBlock.tagName+' nodePath="'+_pri.encodeToXMLchar(elmBlock.nodePath)+'" class="'+elmBlock.className+'" id="'+elmBlock.id+'">',
					'<div class="row">',
						(_pub.oIni.showIco ? '<img class="ico" src="css/treePic/' + _pro.icoConfig[sType].icoName + '" alt="" />' : ''),
						'<div class="elmBox">',
							'<span class="elmSpan">',
								'<span class="elm '+sElmKeyType+'">' + _pri.encodeToXMLchar(sKey + showID) + '</span>',
								((sType !== 'object' && sType !== 'array') ?
									'<span class="value '+sHasImgClass+'">' + _pri.fixStrNullBug(sType, _pri.encodeToXMLchar(oData ? oData.toString() : oData + '')) + sImg +'</span>'
									: ''
								),
							'</span>',
							leng > -1 ? '<span class="array-leng">'+leng+'</span>' : '',
                            canTable ? (' <span class="table-view showTree"><span class="table-ico"><svg t="1741158162529" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2570" xmlns:xlink="http://www.w3.org/1999/xlink" width="13" height="13"><path d="M64 96v832h896v-832H64z m608 208H896V448h-224V304z m-320 560H128v-147.2h224v147.2z m0-211.2H128V512h224v140.8z m0-204.8H128V304h224V448z m256 416h-192v-147.2h192v147.2z m0-211.2h-192V512h192v140.8z m0-204.8h-192V304h192V448z m288 416h-224v-147.2H896v147.2z m0-211.2h-224V512H896v140.8z" fill="#3667ce" p-id="2571"></path></svg></span><span class="tree-ico" ><svg t="1741165086606" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14713" xmlns:xlink="http://www.w3.org/1999/xlink" width="13" height="13"><path d="M315.8 75.64m71.48 0l477.24 0q71.48 0 71.48 71.48l0 2.76q0 71.48-71.48 71.48l-477.24 0q-71.48 0-71.48-71.48l0-2.76q0-71.48 71.48-71.48Z" fill="#246CA8" p-id="14714"></path>'
                            +'<path d="M864.52 245.36H387.28A95.6 95.6 0 0 1 292 149.84v-2.72a95.6 95.6 0 0 1 95.28-95.48h477.24A95.6 95.6 0 0 1 960 147.12v2.72a95.6 95.6 0 0 1-95.48 95.52zM387.28 99.64A47.52 47.52 0 0 0 340 147.12v2.72a47.56 47.56 0 0 0 47.28 47.52h477.24A47.56 47.56 0 0 0 912 149.84v-2.72a47.52 47.52 0 0 0-47.48-47.48z" fill="#246CA8" p-id="14715"></path><path d="M528 457.24m69.52 0l268.96 0q69.52 0 69.52 69.52l0 6.68q0 69.52-69.52 69.52l-268.96 0q-69.52 0-69.52-69.52l0-6.68q0-69.52 69.52-69.52Z" fill="#246CA8" p-id="14716"></path><path d="M866.48 626.96h-268.96A93.64 93.64 0 0 1 504 533.4v-6.64a93.64 93.64 0 0 1 93.52-93.52h268.96A93.64 93.64 0 0 1 960 526.76v6.64a93.64 93.64 0 0 1-93.52 93.56z m-268.96-145.72A45.56 45.56 0 0 0 552 526.76v6.64a45.6 45.6 0 0 0 45.52 45.56h268.96A45.6 45.6 0 0 0 912 533.4v-6.64a45.56 45.56 0 0 0-45.52-45.52z" fill="#246CA8" p-id="14717"></path><path d="M528 793.84m69.52 0l268.96 0q69.52 0 69.52 69.52l0 6.68q0 69.52-69.52 69.52l-268.96 0q-69.52 0-69.52-69.52l0-6.68q0-69.52 69.52-69.52Z" fill="#246CA8" p-id="14718"></path><path d="M866.48 963.56h-268.96A93.64 93.64 0 0 1 504 870v-6.64a93.64 93.64 0 0 1 93.52-93.52h268.96A93.64 93.64 0 0 1 960 863.36v6.64a93.64 93.64 0 0 1-93.52 93.56z m-268.96-145.72A45.56 45.56 0 0 0 552 863.36v6.64a45.6 45.6 0 0 0 45.52 45.56h268.96A45.6 45.6 0 0 0 912 870v-6.64a45.56 45.56 0 0 0-45.52-45.52zM396 558.08H150.44a28 28 0 1 1 0-56H396a28 28 0 0 1 0 56z" fill="#246CA8" p-id="14719"></path><path d="M420 904H128a28 28 0 0 1-28-28V224a28 28 0 0 1 56 0v624h264a28 28 0 0 1 0 56z" fill="#246CA8" p-id="14720"></path><path d="M128 148.48m-73.68 0a73.68 73.68 0 1 0 147.36 0 73.68 73.68 0 1 0-147.36 0Z" fill="#246CA8" p-id="14721"></path><path d="M128 246.16a97.68 97.68 0 1 1 97.68-97.68A97.8 97.8 0 0 1 128 246.16z m0-147.32a49.68 49.68 0 1 0 49.68 49.64A49.72 49.72 0 0 0 128 98.84z" fill="#246CA8" p-id="14722"></path></svg></span></span>') : '',
						'</div>',
					'</div>',
					(nextTarget.html ? nextTarget.html + nextTargetHtml + nextTarget.htmlEnd : ''),
					'</'+elmBlock.tagName+'>',
				].join('');
				_pri.nodePathCache.pop();
				return sHTML;
			},
			// "drawElm" : function (oData, sKey, targetBox) {//debugger;
			// 	var sType, nextTarget, elmBlock;
			// 	oData = typeof oData === 'undefined' ? null : oData;
			// 	targetBox = targetBox || _pri.documentFragment;
			// 	sKey = (sKey === undefined ? 'JSON' : sKey);
			// 	_pri.level[_pri.level.length - 1] = _pri.level[_pri.level.length - 1] + 1;
			// 	if(oData instanceof Array) {
			// 		sType = 'array';
			// 	}else if({}.toString.call(oData)  === '[object Number]') {
			// 		sType = 'number';
			// 	}else if(typeof oData === 'string') {
			// 		sType = 'string';
			// 	}else if(typeof oData === 'boolean') {
			// 		sType = 'boolean';
			// 	}else if(oData === null) {
			// 		sType = 'null';
			// 	}else{
			// 		sType = 'object';
			// 	}

			// 	var sLevel = _pri.level.slice(0).join('_');

			// 	if(targetBox.tagName && targetBox.tagName === 'UL') {
			// 		elmBlock = document.createElement('li');
			// 	}else{
			// 		elmBlock = document.createElement('div');
			// 	}
			// 	elmBlock.className = 'elmBlock ' + _pro.icoConfig[sType].className;
			// 	elmBlock.id = sId.slice(1) + '_l'+sLevel.slice(2);
			// 	var showID = '', sValue = '';
			// 	//showID = ' | ' + elmBlock.id;
			// 	//debugger;
			// 	// sValue = JSON5.stringify(oData, null, 4);
			// 	// sValue = _pri.encodeToXMLchar(sValue);
			// 	var sElmKeyType = 'object-key';
			// 	if(targetBox.elmType === 'array') {
			// 		sElmKeyType = 'array-key';
			// 	}
			// 	var leng = -1;
			// 	if(sType === 'array') {
			// 		leng = oData.length;
			// 	}else if(sType === 'object') {
			// 		leng = Object.keys(oData).length;
			// 	}
			// 	var sHTML = [
			// 		'<div class="row">',
			// 			'<img class="ico" src="css/treePic/' + _pro.icoConfig[sType].icoName + '" alt="" />',
			// 			'<div class="elmBox">',
			// 				'<span class="elmSpan">',
			// 					'<span class="elm '+sElmKeyType+'"title="' + sValue + '">' + sKey + showID + '</span>',
			// 					((sType !== 'object' && sType !== 'array') ?
			// 						'<span class="value">' + _pri.encodeToXMLchar(oData ? oData.toString() : oData + '') +'</span>'
			// 						: ''
			// 					),
			// 				'</span>',
			// 				leng > -1 ? '<span class="array-leng">'+leng+'</span>' : '',
			// 			'</div>',
			// 		'</div>'
			// 	].join('');

			// 	JH.elementHtml(elmBlock, sHTML);
			// 	if(sType === 'array' || sType === 'object') {
			// 		nextTarget = document.createElement('ul');
			// 		nextTarget.className = 'elmList';
			// 		elmBlock.appendChild(nextTarget);
			// 	}

			// 	targetBox.appendChild(elmBlock);
			// 	elmBlock.oData = oData;
			// 	elmBlock.sKeyName = sKey;
			// 	elmBlock.sType = sType;
			// 	if(_pub.showAllImg) {
			// 		_pro.drawElmCallback(elmBlock, 1);
			// 		$('#jsonNav').addClass('hasLoadedValueImg');
			// 	}else{
			// 		_pro.drawElmCallback(elmBlock);
			// 	}

			// 	_pri.event.fire('drawElm', elmBlock);

			// 	if(sType === 'array') {
			// 		_pri.level.push(0);
			// 		nextTarget.elmType = 'array';
			// 		JH.forEach(oData, _pri.drawElmFun, nextTarget);
			// 		_pri.level.pop();
			// 	}else if(sType === 'object') {
			// 		_pri.level.push(0);
			// 		JH.forIn(oData, _pri.drawElmFun, nextTarget);
			// 		_pri.level.pop();
			// 	}

			// },
			"drawElmFun" : function (value, key) {
				_pri.drawElm(value, key, this);

			},
			"insertChildNodesTo" : function (eSrc, eTarget) {
				while(eSrc.firstChild) {
					eTarget.appendChild(eSrc.firstChild);
				}
			},
			"documentFragment" : document.createElement('div'),

			"drawElmCallback" : function (eBlock, bShowImg) {
				var sV = _pub.JSON.stringify(eBlock.oData);
				var sImg = '', sHasImgClass = '';
				//debugger;
				if(bShowImg && _pri.isImgUrl(sV)) {
					sImg = '<br /><img src="'+_pri.encodeToXMLchar(sV.slice(1, -1))+'" />';
					$(eBlock).addClass('imgUrl');
					sHasImgClass = 'has-img';
				}

				if($(eBlock).hasClass('node')) {
					$('.value', eBlock).addClass(sHasImgClass).append(sImg);
				}
			},

			"isImgUrl" : function (sV) {
				if ({}.toString.call(sV) !== '[object String]') {
					return false;
				}
				sV = sV.slice(1, -1);
				var bUrl = false;
				if(/^(http\:|https\:|file\:).+/.test(sV)) {
					bUrl = true;
				}
				if(bUrl) {
					var aP = sV.split('?');
					var sP = aP[0];
					if(/.+(\.jpg|\.jpeg|\.gif|\.png|\.ico|\.bmp)$/.test(sP)) {
						return  true;
					}
				}
				if(/^(data\:image\/).+/.test(sV)) {
					return  true;
				}
				return false;
			}

		});

		JH.mergePropertyFrom(_pro, {

			"icoConfig" : {
			 	'array' : {
			 		className : 'open folder array',
					insertName: 'arrayElm',
			 		icoName : 'arr.png'
			 	},
			 	'number' : {
			 		className : 'node number',
					 insertName: 'numberElm',
			 		icoName : 'num.png'
			 	},
			 	'string' : {
			 		className : 'node string',
					 insertName: 'stringElm',
			 		icoName : 'str.png'
			 	},
			 	'boolean' : {
			 		className : 'node boolean',
					 insertName: 'booleanElm',
			 		icoName : 'boolean.png'
			 	},
			 	'null' : {
			 		className : 'node null',
					 insertName: 'nullElm',
			 		icoName : 'null.png'
			 	},
			 	'object' : {
			 		className : 'open folder object',
					 insertName: 'objectElm',
			 		icoName : 'obj.png'
			 	}
			},
			"fixTreeView" : function (eTree) {
				// $('.elmList', eTree).each(function (iIndex, eUl) {
				// 	var eLastChild = $('>li:last-child', eUl)[0];
				// 	if(eLastChild) {
				// 		$(eLastChild).addClass('last');
				// 	}
				// 	if(!$('>*', eUl).length) {
				// 		$(eUl).parent().addClass('empty');
				// 	}
				// });
				eTree.querySelectorAll('.elmBlock').forEach(function (eDiv, iIndex) {
					if (eDiv.tagName === 'DIV') {
						$(eDiv).addClass('root');
					}
					var oHash = _pri.elmBlockHash[eDiv.id];
					if (oHash) {
						eDiv.oData = oHash.oData;
						eDiv.sKeyName = oHash.sKeyName;
						eDiv.sType = oHash.sType;
						eDiv.nodePath = oHash.nodePath;
					}
				});
			},
			"clickTableViewCallback" : function (eBlock) {


			},
			"clickElmCallback" : function (eBlock) {


			},
			"overElmCallback" : function (eBlock) {

			},
			"outElmCallback" : function (eBlock) {

			},
			"changeFlodCallback" : function (eBlock) {

			},
			"drawElmCallback" : function (eBlock) {
				_pri.drawElmCallback(eBlock);
			}


		});

		JH.mergePropertyFrom(_pub, {

			"build" : function (oData, sKey) {
				//alert(_pub.JSON.stringify(oData, null, 4));

				JH.elementHtml(JH.e(sId), '');
				JH.elementHtml(_pri.documentFragment, '');
				// JH.e(sId).setAttribute('data-json', JSON.stringify(oData, null, 4));
				_pro.data = oData;
				// _pri.drawElm(oData, sKey);
				var sss = _pri.getDrawElmHtml(oData, sKey);
				if(_pub.showAllImg) {
					$('#jsonNav').addClass('hasLoadedValueImg');
				}
				_pri.documentFragment.innerHTML = sss;
				JH.e(sId).appendChild(_pri.documentFragment);
				setTimeout(function () {
					_pro.fixTreeView(_pri.documentFragment);
					//debugger;
					_pub.expandCur('jsonNav_l');
					_pub.buildCallback();
				});
			},
			"buildCallback" : function () {

			},
			"expandCur" : function (sId, bAct) {
				sId = sId || '';
				if(sId) {
					sId = (sId.slice(0, 1) === '#' ? '' : '#') + sId;
				}
				var eCur = JH.e(sId);
				eCur = eCur || _pub.getCur();
				if(eCur) {
					bAct && _pri.actElm(eCur);
					$(eCur).parents('.elmList').each(function (i, e) {
						//$(e).show();
						$(e).parent().addClass('open');
					});
				}
				_pro.changeFlodCallback(sId === '#jsonNav_l');
				//location.hash = '';
				//location.hash = eCur.id;
				setTimeout(function () {
					$(document).scrollTop($(eCur).offset().top - 100);
				});
			},
			"getCurrElm" : function () {
				return _pri.eCur;
			},
			"gotoCurrElm" : function () {
				var eCur = _pub.getCurrElm();
				var iTop = $(eCur).offset().top;
				var iScroll = $('#jsonNav').scrollTop();
				iTop = iScroll + iTop - 100;
				if(eCur) {
					$(document).scrollTop(iTop);
					$('#jsonNav').scrollTop(iTop);
				}
			},
			"expandAll" : function () {
				$(sId + ' .elmList').each(function (i, e) {
					$(e).parent().addClass('open');
				});
				_pro.changeFlodCallback();
			},
			"collapseAll" : function () {
				$('.root>.elmList .elmList').each(function (i, e) {
					//$(e).hide();
					$(e).parent().removeClass('open');
				});
				_pro.changeFlodCallback();
			},
			"getCur" : function () {
				var eCur = null;
				if($(sId + ' .cur').length) {
					eCur = $('.cur')[0];
				}
				return eCur;
			},
			"checkValueImg" : function (eElmValue) {
				var eBlock = $(eElmValue).parents('.elmBlock')[0];
				var sV = _pub.JSON.stringify(eBlock.oData);
				$('>.row .elmSpan', eBlock).prop('jsonStr', sV);
				if(_pri.isImgUrl(sV)) {
					sImgHtml = '<img src="'+_pri.encodeToXMLchar(sV.slice(1, -1))+'" />';
					$(eBlock).addClass('imgUrl');
					$(eElmValue).addClass('has-img').append(sImgHtml);
				}
			},
			"renderValueImg" : function () {
				$('#jsonNav').addClass('hasLoadedValueImg');
				$('.elmBlock').each(function () {
					if(!$('.elmBlock', this).length) {
						$('.value', this).remove();
						_pro.drawElmCallback(this, true);
						_pri.event.fire('drawElm', this);
					}
				});
			},
			"destroy" : function(){
				if(_pub) {
					_pri = _pro = _pub = null;
				}
			}

		});



		_init= function(){
			_checkArgs();
			_parseDOM();
			_main();
			_uiEvt();
			_custEvt();
			_airEvt();
		};
		_init();



		return _pub;

	};

	return JH.mergePropertyFrom(_pub_static, {



	});
});
