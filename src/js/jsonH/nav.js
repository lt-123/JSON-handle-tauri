
JH.mod.add(['treeNav'], 'jsonH.nav', function (modName, JH, $$) {

		var _interface = [];





		var _pri_static = {

		};



		var _pro_static = {

		};


	var _pub_static = function (opts) {
		var _main, _this = this, _args = arguments, _pri = {}, _pro = {}, _pub = {__varyContext_:function (pro, pub) {_pro = pro;_pub = pub;}}, _mod, _base, _parent;
		_base =$$.treeNav;


		_main = function () {

			_mod = JH.mod.init(_pub_static, _this, _pro, _pub, _pro_static, _interface, _base, _args);
			_pro = _mod.pro;
			_pub = _mod.pub;
			_parent = _mod.parent;




		};


		JH.mergePropertyFrom(_pri, {


			"encodeToXMLchar" : function (sValue) {
				return sValue.replace(/\&/g,'&amp;').replace(/\</g,'&lt;').replace(/\>/g,'&gt;').replace(/\"/g,'&quot;');
			},
			"parsePathByElm" : function (eBlock) {
				if (eBlock.nodePath) {
					return eBlock.nodePath;
				}
				var aPath = [eBlock];
				$(eBlock).parents('.elmBlock').each(function (sKey, eB) {
					aPath.push(eB);
				});

				var sPath = '';
				aPath = aPath.reverse();
				var aPathObj = [];
				JH.forEach(aPath, function (o, i) {//debugger;
					var sKey = o.sKeyName + '';
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
					}
				};
			},
			"filterStringValue" : function (sTxt) {
				//sTxt = sTxt.replace(/\\n/g, '\n').replace(/\\r/g, '').replace(/\\t/g, '\t');
				if(sTxt.match(/(http|https):\/\/.+/)) {
					_pri.showLink(sTxt);
				}
				return '"' + sTxt + '"';
			},
            "renderTable": function (data) {
                const table = document.createElement('table');
                table.className = 'elmTable';

                const thead = document.createElement('thead');
                const headerRow = document.createElement('tr');

                const th = document.createElement('th');
                // th.textContent = 'Index';
                headerRow.appendChild(th);

                Object.keys(data[0]).forEach(key => {
                    const th = document.createElement('th');
                    th.textContent = key;
                    headerRow.appendChild(th);
                });

                thead.appendChild(headerRow);
                table.appendChild(thead);

                const tbody = document.createElement('tbody');

                data.forEach((item, i) => {
                    const row = document.createElement('tr');
                    
                    let eTdIndex = document.createElement('td');
                    eTdIndex.textContent = i;
                    row.appendChild(eTdIndex);

                    Object.values(item).forEach(value => {
                        const td = document.createElement('td');
                        let eP = document.createElement('p');
                        eP.textContent = value;
                        td.appendChild(eP);
                        row.appendChild(td);
                    });
                    
                    tbody.appendChild(row);
                });

                table.appendChild(tbody);

                return table;
            },
			"showLink" : function (sLink) {
				$('#showLink').attr('href', sLink).show();
			},
			"hideLink" : function () {
				$('#showLink').hide().attr('');
			}


		});

		JH.mergePropertyFrom(_pro, {


			// "icoConfig" : {
			// 	'array' : {
			// 		className : 'open folder array',
			// 		icoName : 'arr.png'
			// 	},
			// 	'number' : {
			// 		className : 'node number',
			// 		icoName : 'num.png'
			// 	},
			// 	'string' : {
			// 		className : 'node string',
			// 		icoName : 'str.png'
			// 	},
			// 	'boolean' : {
			// 		className : 'node boolean',
			// 		icoName : 'boolean.png'
			// 	},
			// 	'null' : {
			// 		className : 'node null',
			// 		icoName : 'null.png'
			// 	},
			// 	'object' : {
			// 		className : 'open folder object',
			// 		icoName : 'obj.png'
			// 	}
			// },
			"clickElmCallback" : function (eBlock) {


				var oPath = _pri.parsePathByElm(eBlock);
				$('#showPath').val(oPath);
				$('#showPath').attr('parentPath', oPath.sParent);

				_pri.hideLink();

				var sTxt ;
				if(typeof eBlock.oData === 'string') {
					sTxt = _pri.filterStringValue(eBlock.oData);
				}else{
					sTxt = jsonhandleCommon.JSON.stringify(eBlock.oData, null, 4);
				}
				$('#showValue')
					.val(sTxt)
					.prop('oData', eBlock.oData)
				;
				$('#showKey').val(eBlock.sKeyName);
				$('#showKey').attr('oldValue', eBlock.sKeyName);
				var parentElm = $(eBlock).parents('.elmBlock');//debugger;
				if(parentElm.length && parentElm[0].sType === 'array') {
					$('#showKey').attr('readonly', 'readonly');
					$('#showKey').addClass('isArrayElm');
				}else{
					//$('#showKey').removeAttr('readonly');
					$('#showKey').attr('readonly', 'readonly');
					$('#showKey').removeClass('isArrayElm');
				}

			},
			"clickTableViewCallback" : function (eBlock) {
                let $tree = $(eBlock).find('>.elmList').eq(0);
                let $tableTool = $(eBlock).find('.row>.elmBox>.table-view').eq(0);
                let $TableElm = $(eBlock).find('>.elmTable').eq(0);
                if ($tableTool.hasClass('showTree')) {
                    $tableTool.removeClass('showTree');
                    if ($TableElm.length < 1) {
                        $tree.before(_pri.renderTable(eBlock.oData));
                    }
                    $TableElm.show();
                    $tree.hide();
                }else{
                    $tree.show();
                    $TableElm.hide();
                    $tableTool.addClass('showTree');
                }
                return false;
			},
			"overElmCallback" : function (eBlock) {
				$('#pathTips').text($(eBlock).attr('nodePath'));
			},
			"outElmCallback" : function (eBlock) {
				$('#pathTips').html('');


			},
			"changeFlodCallback" : function (b) {_pub.changeFlodCallback && _pub.changeFlodCallback(b)},
			"drawElmCallback" : function (eBlock) {
				_parent._pro.drawElmCallback(eBlock);
				$(eBlock).attr('nodePath', _pri.parsePathByElm(eBlock));
			}


		});

		JH.mergePropertyFrom(_pub, {

			"getData" : function () {
				return _pro.data;
			},
			"destroy" : function(){
				if(_pub) {

					_pri = _pro = _pub = null;
				}
			}

		});


		_main();


		return _pub;

	};

	return JH.mergePropertyFrom(_pub_static, {



	});
});
