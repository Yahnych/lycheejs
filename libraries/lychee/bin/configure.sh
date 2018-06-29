#!/bin/bash

LYCHEEJS_ROOT=$(cd "$(dirname "$(readlink -f "$0")")/../../../"; pwd);
LYCHEEJS_HELPER="$LYCHEEJS_ROOT/bin/helper.sh";
PROJECT_ROOT=$(cd "$(dirname "$(readlink -f "$0")")/../"; pwd);
PROJECT_BUILD="$1";


cd $PROJECT_ROOT;

if [ -d "$PROJECT_ROOT/api" ]; then
	rm -rf "$PROJECT_ROOT/api";
fi;

if [ -d "$PROJECT_ROOT/build/$PROJECT_BUILD" ]; then
	rm -rf "$PROJECT_ROOT/build/$PROJECT_BUILD";
fi;


$LYCHEEJS_HELPER env:node ./bin/configure.js;

