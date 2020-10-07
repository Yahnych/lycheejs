#!/bin/bash

LYCHEEJS_ROOT="/opt/lycheejs";
PROJECT_ROOT=$(cd "$(dirname "$(readlink -f "$0")")/../"; pwd);
PROJECT_BUILD="$1";


if [ "$PROJECT_BUILD" == "html/main" ]; then

	cd $PROJECT_ROOT;

	mkdir -p $PROJECT_ROOT/libraries/lychee/build/html;
	cp $LYCHEEJS_ROOT/libraries/lychee/lychee.pkg               $PROJECT_ROOT/libraries/lychee/lychee.pkg;
	cp $LYCHEEJS_ROOT/libraries/lychee/build/html/core.js       $PROJECT_ROOT/libraries/lychee/build/html/core.js;
	cp $LYCHEEJS_ROOT/libraries/lychee/build/html/dist/index.js $PROJECT_ROOT/libraries/lychee/build/html/dist/index.js;

	mkdir -p $PROJECT_ROOT/libraries/strainer/build/html/dist;
	cp $LYCHEEJS_ROOT/libraries/strainer/lychee.pkg               $PROJECT_ROOT/libraries/strainer/lychee.pkg;
	cp $LYCHEEJS_ROOT/libraries/strainer/build/html/dist/index.js $PROJECT_ROOT/libraries/strainer/build/html/dist/index.js;


	echo "SUCCESS";
	exit 0;

elif [ "$PROJECT_BUILD" == "node/main" ]; then

	cd $PROJECT_ROOT;

	mkdir -p $PROJECT_ROOT/libraries/lychee/build/node;
	cp $LYCHEEJS_ROOT/libraries/lychee/lychee.pkg               $PROJECT_ROOT/libraries/lychee/lychee.pkg;
	cp $LYCHEEJS_ROOT/libraries/lychee/build/node/core.js       $PROJECT_ROOT/libraries/lychee/build/node/core.js;
	cp $LYCHEEJS_ROOT/libraries/lychee/build/node/dist/index.js $PROJECT_ROOT/libraries/lychee/build/node/dist/index.js;

	mkdir -p $PROJECT_ROOT/libraries/strainer/build/node/dist;
	cp $LYCHEEJS_ROOT/libraries/strainer/lychee.pkg               $PROJECT_ROOT/libraries/strainer/lychee.pkg;
	cp $LYCHEEJS_ROOT/libraries/strainer/build/node/dist/index.js $PROJECT_ROOT/libraries/strainer/build/node/dist/index.js;


	echo "SUCCESS";
	exit 0;

else

	echo "FAILURE";
	exit 1;

fi;

