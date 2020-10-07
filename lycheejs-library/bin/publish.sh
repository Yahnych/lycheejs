#!/bin/bash

NPM_BIN=`which npm`;
LYCHEEJS_ROOT=$(cd "$(dirname "$0")/../../../"; pwd);
PROJECT_ROOT=$(cd "$(dirname "$0")/../"; pwd);


if [ "$NPM_BIN" != "" ]; then

	cd $PROJECT_ROOT;

	git push origin master;
	git push origin --tags;

	$NPM_BIN publish;


	echo "SUCCESS";
	exit 0;

else

	echo "FAILURE";
	exit 1;

fi;


