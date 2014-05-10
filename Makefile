BROWSERIFY = node_modules/.bin/browserify
STYLUS = node_modules/.bin/stylus

all: public/dist.js public/app.css

public/dist.js: public/app.js
	$(BROWSERIFY) -t reactify public/app.js > public/dist.js

public/app.css: public/app.styl
	$(STYLUS) < public/app.styl --include node_modules/nib/lib > public/app.css
