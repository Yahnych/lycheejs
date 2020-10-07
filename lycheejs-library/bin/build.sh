#!/bin/bash


LYCHEEJS_ROOT=$(cd "$(dirname "$0")/../../../"; pwd);
PROJECT_ROOT=$(cd "$(dirname "$0")/../"; pwd);
LYCHEEJS_FERTILIZER="$LYCHEEJS_ROOT/libraries/fertilizer/bin/fertilizer.sh";
LYCHEEJS_HELPER="$LYCHEEJS_ROOT/bin/helper/helper.sh";


_concat_lychee() {

	platform="$1";
	target="$PROJECT_ROOT/build/$platform/lychee.js";
	folder=$(dirname "$target");
	core="$LYCHEEJS_ROOT/libraries/crux/build/$platform/dist.js";
	dist="$LYCHEEJS_ROOT/libraries/lychee/build/$platform/dist/index.js";


	if [ ! -d "$folder" ]; then
		mkdir -p "$folder";
	fi;


	cat $core > $target;
	echo -e "\nlychee.init(null);\n" >> $target;

	cat $dist >> $target;
	echo -e "\nlychee.inject(lychee.ENVIRONMENTS[\"/libraries/lychee/dist\"]);\n" >> $target;

}

_concat_library() {

	platform="$1";
	library="$2";
	target="$PROJECT_ROOT/build/$platform/$library.js";
	folder=$(dirname "$target");
	core="$LYCHEEJS_ROOT/libraries/crux/build/$platform/dist.js";
	dist="$LYCHEEJS_ROOT/libraries/$library/build/$platform/dist/index.js";


	if [ ! -d "$folder" ]; then
		mkdir -p "$folder";
	fi;


	cat $core > $target;
	echo -e "\nlychee.init(null);\n" >> $target;

	cat $dist >> $target;
	echo -e "\nlychee.inject(lychee.ENVIRONMENTS[\"/libraries/$library/dist\"]);\n" >> $target;
	cat $core $dist > $target;

}


if [ -x "$LYCHEEJS_FERTILIZER" ] && [ -x "$LYCHEEJS_HELPER" ]; then

	cd $LYCHEEJS_ROOT;

	"$LYCHEEJS_FERTILIZER" fertilize /libraries/lychee html/dist;
	"$LYCHEEJS_FERTILIZER" fertilize /libraries/lychee html-nwjs/dist;
	"$LYCHEEJS_FERTILIZER" fertilize /libraries/lychee html-webview/dist;
	"$LYCHEEJS_FERTILIZER" fertilize /libraries/lychee node/dist;
	"$LYCHEEJS_FERTILIZER" fertilize /libraries/lychee node-sdl/dist;

	"$LYCHEEJS_FERTILIZER" fertilize /libraries/breeder node/dist;
	"$LYCHEEJS_FERTILIZER" fertilize /libraries/fertilizer node/dist;
	"$LYCHEEJS_FERTILIZER" fertilize /libraries/harvester node/dist;
	"$LYCHEEJS_FERTILIZER" fertilize /libraries/strainer node/dist;


	if [ -d $PROJECT_ROOT/build ]; then
		cd $PROJECT_ROOT;
		rm -rf ./build;
	fi;

	_concat_lychee html;
	_concat_lychee html-nwjs;
	_concat_lychee html-webview;
	_concat_lychee node;
	# _concat_lychee node-sdl;

	_concat_library node breeder;
	_concat_library node fertilizer;
	_concat_library node harvester;
	_concat_library node strainer;


	echo "SUCCESS";
	exit 0;

else

	echo "FAILURE";
	exit 1;

fi;

