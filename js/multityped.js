// The MIT License (MIT)

// Multityped.js | Copyright (c) 2016 Patrick Morgan | 

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

! function($) {

    "use strict";
	
	var Multityped = function(el, options) {
        // chosen element to manipulate text
        this.el = $(el);
        
        // options
        this.options = $.extend({}, $.fn.multityped.defaults, options);
        
        // multityped options
		this.inputFile = this.options.inputFile;
        this.linePrefix = this.options.linePrefix;
        this.content;
        
        // typed.js options
        this.typeSpeed = this.options.typeSpeed;
        this.startDelay = this.options.startDelay;
        this.showCursor = this.options.showCursor;
		this.cursorChar = this.options.cursorChar;
        this.contentType = this.options.contentType;
        
        // initialize
        this.init();
    };
    
    Multityped.prototype = {

        constructor: Multityped,
        
        init: function() 
        {
        	var self = this;
        	$.get(this.inputFile, function(content) {
				// split input text into array of lines
				self.typing(content.split("\n"), 0);
			}).fail(function() {
				self.typing(['Multityped.js error: "'+self.inputFile+'" not found.'], 0);
			});
        },
        
        typing: function(content, lineNum) 
        {
			var lineString = content[lineNum];
			
			var line = this.parseLine(lineString);
			
			// append the target element with a new line
			var lineHTML =  '<div id="typed-line-'+lineNum+'" class="typed`-line" style="white-space:pre;">' +
								this.linePrefix + '<span id="typed-text-'+lineNum+'" class="typed-text"></span>' +
							'</div>';
			this.el.append(lineHTML);
			
			// keep scrolled down if required
			this.el.scrollTop(this.el[0].scrollHeight);
			
			// type line
			this.typeLine(content, line, lineNum);
		},
        
        typeLine: function(content, line, lineNum)
        {
        	var self = this;
        	
        	$('#typed-text-' + lineNum).typed({
				strings: [line['text']],
				
				// pass through typed.js options
				typeSpeed: this.typeSpeed,
				startDelay: this.startDelay,
				cursorChar: this.cursorChar,
				showCursor: this.showCursor,
				contentType: this.contentType,
				
				// call before typing
				preStringTyped: function() {
					eval(line['pre']);
				},
				
				// call after typing
				callback: function() {
					eval(line['post']);
					
					if (lineNum+1 < content.length) {
						$('.typed-cursor').hide();
						self.typing(content, lineNum+1);
					}
				},
			});
        },
		
        parseLine: function(s)
        {
        	var start, end;
        	
        	var startToken = '{{';
        	var endToken = '}}';
        	
        	// get pre script
        	if ((start = s.indexOf(startToken)) == 0  && (end = s.indexOf(endToken)) != -1)
        	{
        		start = start + startToken.length;
        		var pre = s.substring(start, end);
        		s = s.replace(s.substring(start - startToken.length, end + endToken.length), '');
        	}
        	
        	// get post script
        	if ((start = s.indexOf(startToken)) != -1  && (end = s.indexOf(endToken)) != -1)
        	{
        		start = start + startToken.length;
        		var post = s.substring(start, end);
        		s = s.replace(s.substring(start - startToken.length, end + endToken.length), '');
        	}
        	
        	return {
        		text: s,
        		pre: pre,
        		post: post
        	};
        }
    };
    
    $.fn.multityped = function(option) 
    {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('multityped');
            var options = typeof option == 'object' && option;
            
            if (!data) $this.data('multityped', (data = new Multityped(this, options)));
            if (typeof option == 'string') data[option]();
        });
    };
    
    $.fn.multityped.defaults = {
    	inputFile: 'multityped.txt',
    	linePrefix: '',
    };
} (window.jQuery);


