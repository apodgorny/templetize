#Contemplate.js

###Complete javascript templating solution

- Works equally well on server and on client side
- No syntax limitations
- Extensible syntax with user-defined macros
- Running at native speeds (browser or nodejs)
- The entire thing is ~40 lines of code! You can safely slab it onto a webpage ))

License: MIT

[See usage example in JSFiddle](http://jsfiddle.net/D6yb8/1/)

##Usage

1. Create a data object:

```javascript
{
	item_name  : "item",
	things     : ["shoe","another shoe","hat","pants","cup","shirt","laptop"]
}
```

2. Refer to the data object as "this" within template using full javascript syntax and/or additional macro syntax:

```html
<b>I have <?= this.things.length ?> different <?=this.item_name?>s:</b>
<ul>
	<? for (var n=0; n<this.things.length; n++) { ?>
		<li><?= n+1 ?>) <?= this.things[n]; ?></li>
	<? } ?>
</ul>
```

2a. Alternatively, you can use pre-defined or your own macros:

```html
<b>I have <?= this.things.length ?> different <?=this.item_name?>s:</b>
<ul>
	<? FOR var n=0; n<this.things.length; n++ : ?>
		<li><?= n+1 ?>) <?= this.things[n]; ?></li>
	<? ENDFOR; ?>
</ul>
```

3. Render template

```javascript
 Contemplate.render(sTemplate, oData);
```

4. Display result:

```html
<b>I have 7 different items:</b>
<ul>
	
		<li>1) shoe</li>
	
		<li>2) another shoe</li>
	
		<li>3) hat</li>
	
		<li>4) pants</li>
	
		<li>5) cup</li>
	
		<li>6) shirt</li>
	
		<li>7) laptop</li>
	
</ul>
```

5. [Optional] Create your own macro

```javascript
Contemplate.macro(\^dostuff\, function(sExpression) {
	return dostuff(sExpression);
}); 
```

This will find anything looking like `<?dostuff my code?>` and evaluate javascript outputted by `dostuff()`

Enjoy!
Respectfully, Lex Podgorny




