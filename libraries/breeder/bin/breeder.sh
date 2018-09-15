#!/bin/bash

LYCHEEJS_ROOT="/opt/lycheejs";
LYCHEEJS_HELPER=`which lycheejs-helper`;
PROJECT_ROOT="$PWD";


# XXX: Allow /tmp/lycheejs usage
if [[ "$PROJECT_ROOT" != "/opt/lycheejs"* ]] && [ "$PROJECT_ROOT" != "$LYCHEEJS_ROOT" ]; then

	if [[ "$PROJECT_ROOT" == *"/lycheejs/"* ]]; then
		LYCHEEJS_ROOT="${PROJECT_ROOT%/lycheejs*}/lycheejs";
		LYCHEEJS_HELPER="$LYCHEEJS_ROOT/bin/helper.sh";
		PROJECT_ROOT="${PROJECT_ROOT##$LYCHEEJS_ROOT}";
	fi;

elif [[ "$PROJECT_ROOT" == */lycheejs/* ]]; then

	PROJECT_ROOT="${PROJECT_ROOT##$LYCHEEJS_ROOT}";

fi;


if [ "$LYCHEEJS_HELPER" != "" ]; then

	cd $LYCHEEJS_ROOT;

	bash $LYCHEEJS_HELPER env:node ./libraries/breeder/bin/breeder.js --project=$PROJECT_ROOT "$1" "$2" "$3" "$4";

	exit $?;

else

	exit 1;

fi;

