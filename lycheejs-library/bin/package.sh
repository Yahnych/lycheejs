#!/bin/bash


_get_version () {

	local old_ver=$(cd $PROJECT_ROOT && cat bower.json | grep version | cut -d\" -f4);
	local new_ver="${LYCHEEJS_VERSION/-Q/.}.0";
	local cur_ver=`echo -e "$old_ver\n$new_ver" | sort -V | tail -n1`;

	echo $cur_ver;

}

NPM_BIN=`which npm`;
LYCHEEJS_ROOT=$(cd "$(dirname "$0")/../../../"; pwd);
LYCHEEJS_VERSION=$(cd $LYCHEEJS_ROOT && cat ./libraries/crux/source/lychee.js | grep VERSION | cut -d"'" -f2);
PROJECT_ROOT=$(cd "$(dirname "$0")/../"; pwd);
LYCHEEJS_HELPER="$LYCHEEJS_ROOT/bin/helper/helper.sh";


if [ "$NPM_BIN" == "" ]; then
	echo "FAILURE: Install NPM first.";
	exit 1;
fi;


if [ -x "$LYCHEEJS_HELPER" ]; then

	cd $PROJECT_ROOT;
	old_version=`git tag | tail -n1`;
	new_version="$(_get_version)";

	if [ "$old_version" != "$new_version" ]; then

		cd $PROJECT_ROOT;

		sed -i "s|$old_version|$new_version|g"                   ./bower.json;
		sed -i "s|$old_version|$new_version|g"                   ./package.json;
		sed -i 's|2[0-9][0-9][0-9]-Q[1-4]|'$LYCHEEJS_VERSION'|g' ./README.md;

		git add ./bin;
		git add ./build;
		git add ./bower.json;
		git add ./package.json;
		git add ./README.md;

		git_diff=`git diff`;

		if [ "$git_diff" == "" ]; then

			git commit -m ":construction: lychee.js Library $LYCHEEJS_VERSION CI build :construction:";
			git tag $new_version;

		fi;

	fi;


	echo "SUCCESS";
	exit 0;

else

	echo "FAILURE";
	exit 1;

fi;

