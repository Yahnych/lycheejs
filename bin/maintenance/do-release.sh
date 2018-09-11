#!/bin/bash


set -e;


ACCEPTED="false";
SIMULATION="false";


if [ "$1" == "--yes" ] || [ "$1" == "-y" ]; then
	ACCEPTED="true";
fi;

if [ "$1" == "--simulation" ] || [ "$1" == "-s" ] || [ "$2" == "--simulation" ] || [ "$2" == "-s" ]; then
	ACCEPTED="true";
	SIMULATION="true";
fi;



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


if [ "$RELEASE_FOLDER" != "" ]; then

	TARGET_FOLDER="$RELEASE_FOLDER";

else

	TMP_SIZE=$(df /tmp --output=avail | tail -n 1 | xargs);
	MNT_SIZE=$(df /mnt --output=avail | tail -n 1 | xargs);

	if [ "$TMP_SIZE" -gt "6144000" ]; then

		TARGET_FOLDER="/tmp/lycheejs";

	elif [ "$MNT_SIZE" -gt "6144000" ]; then

		TARGET_FOLDER="/mnt/lycheejs";

	else

		echo -e "\e[41m\e[97m";
		echo " (E) Not enough memory available:                      ";
		echo "     /tmp - $TMP_SIZE";
		echo "     /mnt - $MNT_SIZE";
		echo " (E) Please make space for 6G in either of above paths.";
		echo -e "\e[0m";

		exit 1;

	fi;


fi;



CURRENT_FOLDER=$(cd "$(dirname "$0")/../../"; pwd);
CURRENT_VERSION=$(cd $CURRENT_FOLDER && cat ./libraries/crux/source/lychee.js | grep VERSION | cut -d\" -f2);
TARGET_VERSION=$(_get_version);
LYCHEEJS_FERTILIZER="$TARGET_FOLDER/libraries/fertilizer/bin/fertilizer.sh";

GITHUB_TOKEN=$(cat /opt/lycheejs/.github/TOKEN);
NPM_BIN=`which npm`;


if [ "$GITHUB_TOKEN" == "" ]; then

	echo -e "\e[41m\e[97m";
	echo " (E) No GitHub Token found.                                      ";
	echo "     Use \"echo YOUR-GITHUB-TOKEN > /opt/lycheejs/.github/TOKEN\". ";
	echo -e "\e[0m";

	exit 1;

fi;


if [ "$NPM_BIN" == "" ]; then

	echo -e "\e[41m\e[97m";
	echo " (E) No NPM found.                                ";
	echo "     Please install NPM with the package manager. ";
	echo -e "\e[0m";

	exit 1;

else

	NPM_USER=`$NPM_BIN whoami`;

	if [ "$NPM_USER" != "artificial-engineering" ]; then

		echo -e "\e[41m\e[97m";
		echo " (E) NPM not logged in.                                   ";
		echo "     Use \"npm login\" with user \"artificial-engineering\".  ";
		echo -e "\e[0m";

		exit 1;

	fi;

fi;


if [ "$CURRENT_VERSION" != "$TARGET_VERSION" ]; then

	if [ "$ACCEPTED" == "false" ]; then

		echo " (L) ";
		echo -e "\e[42m\e[97m (I) lychee.js Release Tool \e[0m";
		echo " (L) ";
		echo " (L) All your data are belong to us.                     ";
		echo " (L) This tool creates a new lychee.js release.          ";
		echo " (L) ";
		echo " (L) You need to be member of the Artificial-Engineering ";
		echo " (L) organization and you will be questioned again when  ";
		echo " (L) the release is ready to publish it.                 ";
		echo " (L) ";
		echo " (L) Current: $CURRENT_VERSION in $CURRENT_FOLDER";
		echo " (L) Release: $TARGET_VERSION in $TARGET_FOLDER";
		echo " (L) ";
		echo " (L) ";

		read -p " (L) Continue (y/n)? " -r

		if [[ $REPLY =~ ^[Nn]$ ]]; then
			echo -e "\e[41m\e[97m (E) ABORTED \e[0m";
			exit 0;
		elif ! [[ $REPLY =~ ^[Yy]$ ]]; then
			echo -e "\e[41m\e[97m (E) INVALID SELECTION \e[0m";
			exit 1;
		fi;

	fi;



	#
	# INIT lycheejs
	#

	if [ -d $TARGET_FOLDER ]; then

		cd $TARGET_FOLDER;
		git checkout development;
		git pull origin development -f;

	else

		mkdir -p $TARGET_FOLDER;
		git clone git@github.com:Artificial-Engineering/lycheejs.git $TARGET_FOLDER;

	fi;


	if [ ! -d $TARGET_FOLDER/bin/runtime ]; then

		if [ ! -f $TARGET_FOLDER/bin/runtime.zip ]; then

			DOWNLOAD_URL=$(curl -s https://api.github.com/repos/Artificial-Engineering/lycheejs-runtime/releases/latest | grep browser_download_url | grep lycheejs-runtime | head -n 1 | cut -d'"' -f4);

			if [ "$DOWNLOAD_URL" != "" ]; then

				cd $TARGET_FOLDER/bin;
				curl -sSL $DOWNLOAD_URL > $TARGET_FOLDER/bin/runtime.zip;

			else

				echo -e "\e[41m\e[97m";
				echo " (E) No lycheejs-runtime download URL found.                                   ";
				echo "     Please download it manually to $TARGET_FOLDER/bin/runtime.zip.             ";
				echo "     https://github.com/Artificial-Engineering/lycheejs-runtime/releases/latest";
				echo -e "\e[0m";

				exit 1;

			fi;

		fi;


		mkdir $TARGET_FOLDER/bin/runtime;
		git clone --single-branch --branch master --depth 1 git@github.com:Artificial-Engineering/lycheejs-runtime.git $TARGET_FOLDER/bin/runtime;

		cd $TARGET_FOLDER/bin/runtime;
		unzip -nq ../runtime.zip;

		chmod +x $TARGET_FOLDER/bin/runtime/bin/*.sh     2> /dev/null;
		chmod +x $TARGET_FOLDER/bin/runtime/*/update.sh  2> /dev/null;
		chmod +x $TARGET_FOLDER/bin/runtime/*/package.sh 2> /dev/null;

		# XXX: Keep runtime.zip for continues after fails
		# rm $TARGET_FOLDER/bin/runtime.zip;

	fi;



	#
	# UPDATE lycheejs
	#

	cd $TARGET_FOLDER;
	git checkout development;

	sed -i 's|2[0-9][0-9][0-9]-Q[1-4]|'$TARGET_VERSION'|g' ./README.md;
	sed -i 's|2[0-9][0-9][0-9]-Q[1-4]|'$TARGET_VERSION'|g' ./libraries/crux/source/lychee.js;

	readme_diff=$(git diff README.md);
	lychee_diff=$(git diff ./libraries/crux/source/lychee.js);

	if [ "$readme_diff" != "" ] || [ "$lychee_diff" != "" ]; then

		git add ./README.md;
		git add ./libraries/crux/source/lychee.js;
		git commit -m "lychee.js $TARGET_VERSION release";

	fi;


	cd $TARGET_FOLDER;
	export LYCHEEJS_ROOT="$TARGET_FOLDER";
	bash $TARGET_FOLDER/bin/configure.sh;



	#
	# UPDATE lycheejs-runtime
	#

	cd $TARGET_FOLDER/bin/runtime;
	export LYCHEEJS_ROOT="$TARGET_FOLDER";
	bash $TARGET_FOLDER/bin/runtime/bin/do-update.sh;
	bash $TARGET_FOLDER/bin/runtime/bin/package.sh;



	#
	# UPDATE and FERTILIZE lycheejs-library
	#

	if [ ! -d "$TARGET_FOLDER/projects/lycheejs-library" ]; then

		git clone --single-branch --branch master git@github.com:Artificial-Engineering/lycheejs-library.git $TARGET_FOLDER/projects/lycheejs-library;

	else

		cd "$TARGET_FOLDER/projects/lycheejs-library";
		git checkout master;
		git pull origin master -f;

	fi;

	cd $TARGET_FOLDER;
	export LYCHEEJS_ROOT="$TARGET_FOLDER";
	$LYCHEEJS_FERTILIZER fertilize /projects/lycheejs-library;



	#
	# FERTILIZE lycheejs-bundle
	#

	if [ ! -d "$TARGET_FOLDER/projects/lycheejs-bundle" ]; then

		git clone --single-branch --branch master git@github.com:Artificial-Engineering/lycheejs-bundle.git $TARGET_FOLDER/projects/lycheejs-bundle;

	else

		cd "$TARGET_FOLDER/projects/lycheejs-bundle";
		git checkout master;
		git pull origin master -f;

	fi;

	cd $TARGET_FOLDER;
	export LYCHEEJS_ROOT="$TARGET_FOLDER";
	$LYCHEEJS_FERTILIZER fertilize /projects/lycheejs-bundle;



	if [ "$ACCEPTED" == "false" ]; then

		echo " (L) ";
		echo " (L) Somebody set us up the bomb.                    ";
		echo " (L) ";
		echo " (L) If no error occured, you can publish the new    ";
		echo " (L) lychee.js release to GitHub and the peer cloud. ";
		echo " (L) ";
		echo -e "\e[43m\e[97m";
		echo " (W) WARNING: The publish process is irreversible.   ";
		echo "     It is wise to manually check $TARGET_FOLDER now. ";
		echo -e "\e[0m";
		echo " (L) ";
		echo " (L) ";

		read -p " (L) Continue (y/n)? " -r

		if [[ $REPLY =~ ^[Nn]$ ]]; then
			echo -e "\e[41m\e[97m (E) ABORTED \e[0m";
			exit 0;
		elif ! [[ $REPLY =~ ^[Yy]$ ]]; then
			echo -e "\e[41m\e[97m (E) INVALID SELECTION \e[0m";
			exit 1;
		fi;

	fi;



	#
	# PUBLISH lycheejs
	#

	cd $TARGET_FOLDER;

	if [ "$SIMULATION" == "false" ]; then
		git checkout development;
		git push origin development;
	fi;

	git checkout master;
	git merge --squash --no-commit development;
	git commit -m "lychee.js $TARGET_VERSION release";

	if [ "$SIMULATION" == "false" ]; then
		git checkout master;
		git push origin master;
	fi;



	#
	# PUBLISH lycheejs-library
	#

	if [ "$SIMULATION" == "false" ]; then
		cd $TARGET_FOLDER/projects/lycheejs-library;
		bash $TARGET_FOLDER/projects/lycheejs-library/bin/publish.sh;
	fi;



	#
	# PUBLISH lycheejs-runtime
	#

	if [ "$SIMULATION" == "false" ]; then
		cd $TARGET_FOLDER/bin/runtime;
		bash $TARGET_FOLER/bin/runtime/bin/publish.sh;
	fi;



	#
	# PUBLISH lycheejs-bundle
	#

	if [ "$SIMULATION" == "false" ]; then
		cd $TARGET_FOLDER/projects/lycheejs-bundle;
		bash $TARGET_FOLDER/projects/lycheejs-bundle/bin/publish.sh;
	fi;


	if [ "$SIMULATION" == "true" ]; then

		echo " (L) ";
		echo -e "\e[42m\e[97m (I) SUCCESS \e[0m";
		echo " (L) ";
		echo " (L) Simulation complete.";
		echo " (L) ";

	else

		echo " (L) ";
		echo -e "\e[42m\e[97m (I) SUCCESS \e[0m";
		echo " (L) ";
		echo " (L) Release complete.";
		echo " (L) ";
		echo " (L) - Create $TARGET_VERSION release of lycheejs-website repository. ";
		echo " (L) ";

	fi;

	exit 0;

else

	echo " (L) ";
	echo -e "\e[42m\e[97m (I) lychee.js Release Tool \e[0m";
	echo " (L) ";
	echo -e "\e[42m\e[97m (I) lychee.js $TARGET_VERSION release already done. \e[0m";
	echo " (L) ";

	exit 0;

fi;
