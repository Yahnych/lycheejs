#!/usr/bin/env bash

set -u;
set -e;

RUNTIME_ROOT=$(cd "$(dirname "$0")/../"; pwd);
ERROR_HAPPENED="false";
ZIP_BIN=`which zip`;



if [ -f "$RUNTIME_ROOT/lycheejs-runtime.zip" ]; then
	rm "$RUNTIME_ROOT/lycheejs-runtime.zip";
fi;



echo " (L) PACKAGE lycheejs-runtime.zip ...";

if [ "$ZIP_BIN" != "" ] && [ ! -f "$RUNTIME_ROOT/lycheejs-runtime.zip" ]; then

	cd $RUNTIME_ROOT;
	$ZIP_BIN -r lycheejs-runtime.zip README.md ./bin ./html-nwjs ./html-webview ./nidium ./node ./.gitignore;

	if [ $? == 0 ]; then
		echo -e "\e[42m\e[97m (I) SUCCESS \e[39m\e[49m\e[0m";
	else
		ERROR_HAPPENED="true";
		echo -e "\e[41m\e[97m (E) FAILURE \e[39m\e[49m\e[0m";
	fi;

else
	ERROR_HAPPENED="true";
	echo -e "\e[41m\e[97m (E) FAILURE \e[39m\e[49m\e[0m";
fi;



if [ -f "$RUNTIME_ROOT/lycheejs-runtime-only-node.zip" ]; then
	rm "$RUNTIME_ROOT/lycheejs-runtime-only-node.zip";
fi;



echo " (L) PACKAGE lycheejs-runtime-only-node.zip ...";

if [ "$ZIP_BIN" != "" ] && [ ! -f "$RUNTIME_ROOT/lycheejs-runtime-only-node.zip" ]; then

	cd $RUNTIME_ROOT;
	$ZIP_BIN -r lycheejs-runtime-only-node.zip README.md ./bin ./html-nwjs ./html-webview ./nidium ./node ./.gitignore \
		-x "./html-nwjs/aws.xml" "./html-nwjs/files.txt" "./html-nwjs/hashes.txt" "./html-nwjs/linux/*" "./html-nwjs/osx/*" "./html-nwjs/windows/*" \
		"./html-webview/android-toolchain/*" \
		"./nidium/downloads.html" "./nidium/linux/*" "./nidium/osx/*";

	if [ $? == 0 ]; then
		echo -e "\e[42m\e[97m (I) SUCCESS \e[39m\e[49m\e[0m";
	else
		ERROR_HAPPENED="true";
		echo -e "\e[41m\e[97m (E) FAILURE \e[39m\e[49m\e[0m";
	fi;

else
	ERROR_HAPPENED="true";
	echo -e "\e[41m\e[97m (E) FAILURE \e[39m\e[49m\e[0m";
fi;



if [ "$ERROR_HAPPENED" == "false" ]; then
	exit 0;
else
	exit 1;
fi;

