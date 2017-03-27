#!/bin/bash

_get_version () {

	local year=`date +%Y`;
	local month=`date +%m`;
	local version="";

	if [ $month -gt "09" ]; then
		version="$year-Q4";
	elif [ $month -gt "06" ]; then
		version="$year-Q3";
	elif [ $month -gt "03" ]; then
		version="$year-Q2";
	else
		version="$year-Q1";
	fi;

	echo $version;

}


OLD_FOLDER=$(cd "$(dirname "$0")/../../"; pwd);
NEW_FOLDER="/tmp/lycheejs";
LYCHEEJS_FERTILIZER="$NEW_FOLDER/libraries/fertilizer/bin/fertilizer.sh";
OLD_VERSION=$(cd $OLD_FOLDER && cat ./libraries/lychee/source/core/lychee.js | grep VERSION | cut -d\" -f2);
NEW_VERSION=$(_get_version);

GITHUB_TOKEN=$(cat /opt/lycheejs/.github/TOKEN);
NPM_BIN=`which npm`;


if [ "$GITHUB_TOKEN" == "" ]; then
	echo "Please setup GitHub Token first.";
	echo "";
	echo "echo \"YOUR-GITHUB-TOKEN\" > /opt/lycheejs/.github/TOKEN";
	exit 1;
fi;


if [ "$NPM_BIN" == "" ]; then
	echo "Please install NPM first.";
	exit 1;
fi;


if [ "$OLD_VERSION" != "$NEW_VERSION" ]; then

	echo "";
	echo -e "\e[37m\e[42m lychee.js Release Tool \e[0m";
	echo "";
	echo " All your data are belong to us.                     ";
	echo " This tool creates a new lychee.js release.          ";
	echo "                                                     ";
	echo " You need to be member of the Artificial-Engineering ";
	echo " organization and you will be questioned again when  ";
	echo " the release is ready for publishing.                ";
	echo "                                                     ";
	echo " Old lychee.js Folder:  $OLD_FOLDER                  ";
	echo " Old lychee.js Version: $OLD_VERSION                 ";
	echo "                                                     ";
	echo " New lychee.js Version: $NEW_VERSION                 ";
	echo " New lychee.js Folder:  $NEW_FOLDER                  ";
	echo "";

	read -p "Continue (y/n)? " -r

	if [[ $REPLY =~ ^[Yy]$ ]]; then
		echo "";
	else
		exit 1;
	fi;



	#
	# INIT lycheejs
	#

	if [ -d $NEW_FOLDER ]; then
		rm -rf $NEW_FOLDER;
	fi;

	mkdir $NEW_FOLDER;
	git clone git@github.com:Artificial-Engineering/lycheejs.git $NEW_FOLDER;


	DOWNLOAD_URL=$(curl -s https://api.github.com/repos/Artificial-Engineering/lycheejs-runtime/releases/latest | grep browser_download_url | grep lycheejs-runtime | head -n 1 | cut -d'"' -f4);

	if [ "$DOWNLOAD_URL" != "" ]; then

		cd $NEW_FOLDER/bin;
		curl -sSL $DOWNLOAD_URL > $NEW_FOLDER/bin/runtime.zip;

		mkdir $NEW_FOLDER/bin/runtime;
		git clone --single-branch --branch master --depth 1 git@github.com:Artificial-Engineering/lycheejs-runtime.git $NEW_FOLDER/bin/runtime;

		cd $NEW_FOLDER/bin/runtime;
		unzip -nq ../runtime.zip;

		chmod +x $NEW_FOLDER/bin/runtime/bin/*.sh;
		chmod +x $NEW_FOLDER/bin/runtime/*/update.sh;
		chmod +x $NEW_FOLDER/bin/runtime/*/package.sh;

		rm $NEW_FOLDER/bin/runtime.zip;

	fi;


	cd $NEW_FOLDER;
	git checkout development;

	sed -i 's|2[0-9][0-9][0-9]-Q[1-4]|'$NEW_VERSION'|g' ./README.md;
	sed -i 's|2[0-9][0-9][0-9]-Q[1-4]|'$NEW_VERSION'|g' ./libraries/lychee/source/core/lychee.js;

	git add ./README.md;
	git add ./libraries/lychee/source/core/lychee.js;
	git commit -m "lychee.js $NEW_VERSION release";


	cd $NEW_FOLDER;
	$NEW_FOLDER/bin/configure.sh --sandbox;



	#
	# BUILD AND UPDATE lycheejs-runtime
	#

	cd $NEW_FOLDER/bin/runtime;
	./bin/do-update.sh;

	# XXX: lycheejs-bundle requires new runtimes
	# cd $NEW_FOLDER/bin/runtime;
	# ./bin/do-release.sh;



	#
	# BUILD AND PACKAGE lycheejs-harvester
	#

	cd $NEW_FOLDER;
	export LYCHEEJS_ROOT="$NEW_FOLDER";
	git clone --single-branch --branch master git@github.com:Artificial-Engineering/lycheejs-harvester.git $NEW_FOLDER/projects/lycheejs-harvester;
	$LYCHEEJS_FERTILIZER node/main /projects/lycheejs-harvester;



	#
	# BUILD AND PACKAGE lycheejs-library
	#

	cd $NEW_FOLDER;
	export LYCHEEJS_ROOT="$NEW_FOLDER";
	git clone --single-branch --branch master git@github.com:Artificial-Engineering/lycheejs-library.git $NEW_FOLDER/projects/lycheejs-library;
	$LYCHEEJS_FERTILIZER auto /projects/lycheejs-library;



	#
	# BUILD AND PACKAGE lycheejs-bundle
	#

	cd $NEW_FOLDER;
	export LYCHEEJS_ROOT="$NEW_FOLDER";
	git clone --single-branch --branch master git@github.com:Artificial-Engineering/lycheejs-bundle.git $NEW_FOLDER/projects/lycheejs-bundle;
	$LYCHEEJS_FERTILIZER auto /projects/lycheejs-bundle;



	echo "                                                     ";
	echo " Somebody set us up the bomb.                        ";
	echo "                                                     ";
	echo " If no error has occured, you can now publish the    ";
	echo " lychee.js release to GitHub and the peer cloud.     ";
	echo "                                                     ";
	echo -e "\e[37m\e[43m This is irreversible. It is wise to \e[0m ";
	echo -e "\e[37m\e[43m manually check /tmp/lycheejs now.   \e[0m ";
	echo "                                                     ";

	read -p "Continue (y/n)? " -r

	if [[ $REPLY =~ ^[Yy]$ ]]; then
		echo "";
	else
		exit 1;
	fi;



	#
	# PUBLISH lycheejs
	#

	cd $NEW_FOLDER;
	git push origin development;
	git checkout master;
	git merge --squash --no-commit development;
	git commit -m "lychee.js $NEW_VERSION release";
	git push origin master;



	#
	# PUBLISH lycheejs-runtime
	#

	cd $NEW_FOLDER/bin/runtime;
	./bin/do-release.sh;



	#
	# PUBLISH lycheejs-harvester
	#

	cd $NEW_FOLDER/projects/lycheejs-harvester;
	./bin/publish.sh;



	#
	# PUBLISH lycheejs-library
	#

	cd $NEW_FOLDER/projects/lycheejs-library;
	./bin/publish.sh;



	echo "";
	echo "";
	echo -e "\e[37m\e[42m SUCCESS \e[0m";
	echo "";
	echo " Manual Steps required to do now:                              ";
	echo "                                                               ";
	echo " - Create $NEW_VERSION release of lycheejs-bundle repository.  ";
	echo " - Create $NEW_VERSION release of lycheejs-website repository. ";
	echo "                                                               ";

	exit 0;

else

	echo "lychee.js Release for $NEW_VERSION already done.";
	exit 0;

fi;
