#!/bin/bash

LYCHEEJS_ROOT=$(cd "$(dirname "$(readlink -f "$0")")/../../../"; pwd);
PROJECT_ROOT=$(cd "$(dirname "$(readlink -f "$0")")/../"; pwd);
PROJECT_BUILD="$1";
PROJECT_TITLE="awesome-project";


if [ -d $PROJECT_ROOT/build ]; then

	cd $PROJECT_ROOT;

	if [ "$PROJECT_BUILD" == "html/main" ]; then

		cd "$PROJECT_ROOT/build/$PROJECT_BUILD";
		zip -qr "$PROJECT_ROOT/build/${PROJECT_TITLE}_browser_all.zip" ./*;


		rm -rf "$PROJECT_ROOT/build/$PROJECT_BUILD";

	elif [ "$PROJECT_BUILD" == "html-nwjs/main" ]; then

		cd "$PROJECT_ROOT/build/$PROJECT_BUILD-linux/x86_64";
		zip -qr "$PROJECT_ROOT/build/${PROJECT_TITLE}_linux_x86_64.zip" ./*;
		rm -rf "$PROJECT_ROOT/build/$PROJECT_BUILD-linux";

		cd "$PROJECT_ROOT/build/$PROJECT_BUILD-osx/x86_64";
		zip -qr "$PROJECT_ROOT/build/${PROJECT_TITLE}_osx_x86_64.zip" ./*;
		rm -rf "$PROJECT_ROOT/build/$PROJECT_BUILD-osx";

		cd "$PROJECT_ROOT/build/$PROJECT_BUILD-windows/x86_64";
		zip -qr "$PROJECT_ROOT/build/${PROJECT_TITLE}_windows_x86_64.zip" ./*;
		rm -rf "$PROJECT_ROOT/build/$PROJECT_BUILD-windows";


		rm -rf "$PROJECT_ROOT/build/$PROJECT_BUILD";

	elif [ "$PROJECT_BUILD" == "html-webview/main" ]; then

		cp "$PROJECT_ROOT/build/$PROJECT_BUILD-android/app-release-unsigned.apk" "$PROJECT_ROOT/build/${PROJECT_TITLE}_android_all.apk";
		rm -rf "$PROJECT_ROOT/build/$PROJECT_BUILD-android";

		cp "$PROJECT_ROOT/build/$PROJECT_BUILD-firefoxos/app.zip" "$PROJECT_ROOT/build/${PROJECT_TITLE}_firefoxos_all.zip";
		rm -rf "$PROJECT_ROOT/build/$PROJECT_BUILD-firefoxos";

		cp "$PROJECT_ROOT/build/$PROJECT_BUILD-ubuntu/${PROJECT_TITLE}-1.0.0-all.deb" "$PROJECT_ROOT/build/${PROJECT_TITLE}_ubuntutouch_all.deb";
		rm -rf "$PROJECT_ROOT/build/$PROJECT_BUILD-ubuntu";


		rm -rf "$PROJECT_ROOT/build/$PROJECT_BUILD";

	fi;


	echo "SUCCESS";
	exit 0;

else

	echo "FAILURE";
	exit 1;

fi;

