/**
 * Complete javascirpt templating solution
 *   - Works equally well on server and on client side
 *   - No syntax limitations
 *   - Extensible syntax with user-defined macros
 *   - Running at native speeds (browser or nodejs)
 *
 * @author Lex Podgorny
 */

var Contemplate = new function() {
	var _oMacros  = {};
	
	var _makeJs = function(aBlocks, aStatements) {
			var sJson = JSON.stringify(aBlocks);
			
			var s = 'var s = "",f=function(n){s+=' + sJson + '[n];};f(0);';
			for (var n=0; n<aStatements.length; n++) {
				s += aStatements[n] + 'f(' + (n+1) + ');'
			}
			s += 'return s;';
			return s;
		};
	
	/************************ PUBLIC ************************/
	
	/**
	 * Registers a macro to be applied to each javascript insert inside templates
	 * @param sPattern {string|regexp} Pattern matching javascript insert to modify
	 * @param fMacro   {function}      Function that receives string of inserted js,
	 *   and returns valid javascript fragment for evaluation
	 */
	this.macro = function(sPattern, fMacro) {
		sPattern = sPattern.source ? sPattern.source : sPattern;
		_oMacros[sPattern.toString()] = fMacro;
	}
	
	/**
	 * Generates html page (or any other text) with provided template and data object
	 * @param sTemplate {string} Template code, text or html with <? js ?> inserts
	 * @param oContext  {object} Data object that is referred to as "this" from within template
	 * @return {string}
	 */
	this.render = function(sTemplate, oContext) {
		sTemplate = ' ' + sTemplate + ' ';
		var aBlocks     = [],
			aStatements = [],
			aPair,
			a = sTemplate.split('<?');
			
		for (var n=0; n<a.length; n++) {
			aPair = a[n].split('?>');
			if (n > 0) {
				if (aPair.length < 2) {
					throw new Error('Missing closing template tag near "' + a[n] + '"');
				}
				aPair[0] = aPair[0].trim();
				for (var sPattern in _oMacros) {
					if (aPair[0].match(new RegExp(sPattern))) {
						aPair[0] = _oMacros[sPattern](aPair[0]);
					}
				}
				aStatements.push(aPair[0] || '');
				aBlocks.push(aPair[1]);
			} else {
				aBlocks.push(a[n]);
			}
		}
		try {
			var f = new Function(_makeJs(aBlocks, aStatements));
			return f.call(oContext);
		} catch (oError) {
			throw oError;
		}
	}
}

/******************* MACROS *******************/

// Add macro allowing: <?= value ?>
Contemplate.macro(/^=/, function(sExpression) {
	return 's+=' + sExpression.substr(1) + ';';
});

// Add macro allowing: <? IF expression : ?>
Contemplate.macro(/^IF/, function(sExpression) {
	return sExpression.replace(/^IF/, 'if (').replace(/:$/, ') {');
});

// Add macro allowing: <? ELSE IF expression : ?>
Contemplate.macro(/^ELSE[\s]*IF/, function(sExpression) {
	return sExpression.replace(/^ELSE[\s]*IF/, '} else if (').replace(/:$/, ') {');
});

// Add macro allowing: <? ELSE : ?>
Contemplate.macro(/^ELSE/, function(sExpression) {
	return sExpression.replace(/^ELSE/, '} else {').replace(/:$/, '');
});

// Add macro allowing: <? ENDIF ?>
Contemplate.macro(/^ENDIF/, function(sExpression) {
	return sExpression.replace(/^ENDIF/, '}');
});

// Add macro allowing: <? FOR exp; exp; exp : ?>
Contemplate.macro(/^FOR/, function(sExpression) {
	return sExpression.replace(/^FOR/, 'for (').replace(/:$/, ') {');
});

// Add macro allowing: <? ENDFOR ?>
Contemplate.macro(/^ENDFOR/, function(sExpression) {
	return sExpression.replace(/^ENDFOR/, '}');
});


/*****************************************************
NOTE: Remove the following line if using on client side
/*****************************************************/
module.exports = Contemplate;








