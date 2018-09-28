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


REPO_LYCHEEJS="git@github.com:Artificial-Engineering/lycheejs.git";
REPO_LYCHEEJS_BUNDLE="git@github.com:Artificial-Engineering/lycheejs-bundle.git";
REPO_LYCHEEJS_LIBRARY="git@github.com:Artificial-Engineering/lycheejs-library.git";
REPO_LYCHEEJS_RUNTIME="git@github.com:Artificial-Engineering/lycheejs-runtime.git";
FILE_LYCHEEJS_RUNTIME="https://api.github.com/repos/Artificial-Engineering/lycheejs-runtime/releases/latest";



_check_or_exit () {

	local code="$1";

	if [ "$code" == "1" ]; then
		echo -e "\e[41m\e[97m (E) ABORTED DUE TO ERROR \e[0m";
		exit 1;
	fi;

}

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
CURRENT_VERSION=$(grep "VERSION" "$CURRENT_FOLDER/libraries/crux/source/lychee.js" | cut -d"'" -f2);
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

	echo " (L) ";
	echo " (L) > Initializing lychee.js Engine ...";

	if [ -d $TARGET_FOLDER ]; then

		echo " (L)   cd $TARGET_FOLDER";
		echo " (L)   git checkout development";
		cd $TARGET_FOLDER;
		git checkout development;
		_check_or_exit $?;

		echo " (L)   cd $TARGET_FOLDER";
		echo " (L)   git fetch --all";
		cd $TARGET_FOLDER;
		git fetch --all;
		_check_or_exit $?;

		echo " (L)   cd $TARGET_FOLDER";
		echo " (L)   git reset \"origin/development\" --hard";
		cd $TARGET_FOLDER;
		git reset "origin/development" --hard;
		_check_or_exit $?;

	else

		echo " (L)   mkdir -p $TARGET_FOLDER";
		echo " (L)   git clone $REPO_LYCHEEJS $TARGET_FOLDER";
		mkdir -p $TARGET_FOLDER;
		git clone $REPO_LYCHEEJS $TARGET_FOLDER;
		_check_or_exit $?;

	fi;


	echo " (L) ";
	echo " (L) > Initializing lychee.js Runtimes ...";

	if [ ! -d $TARGET_FOLDER/bin/runtime ]; then

		if [ ! -f $TARGET_FOLDER/bin/runtime.zip ]; then

			echo " (L)   (This might take a while)";

			DOWNLOAD_URL=$(curl -s "$FILE_LYCHEEJS_RUNTIME" | grep browser_download_url | grep lycheejs-runtime | head -n 1 | cut -d'"' -f4);

			if [ "$DOWNLOAD_URL" != "" ]; then

				echo " (L)   cd $TARGET_FOLDER/bin";
				echo " (L)   curl --location --retry 8 --retry-connrefused --progress-bar $DOWNLOAD_URL > $TARGET_FOLDER/bin/runtime.zip";
				cd $TARGET_FOLDER/bin;
				curl --location --retry 8 --retry-connrefused --progress-bar $DOWNLOAD_URL > $TARGET_FOLDER/bin/runtime.zip;
				_check_or_exit $?;

			else

				echo -e "\e[41m\e[97m";
				echo " (E) No lycheejs-runtime download URL found.                        ";
				echo "     Please download it manually to $TARGET_FOLDER/bin/runtime.zip. ";
				echo "     $FILE_LYCHEEJS_RUNTIME                                         ";
				echo -e "\e[0m";

				exit 1;

			fi;

		fi;


		echo " (L)   mkdir $TARGET_FOLDER/bin/runtime";
		echo " (L)   git clone --single-branch --branch=master --depth=1 $REPO_LYCHEEJS_RUNTIME $TARGET_FOLDER/bin/runtime";
		mkdir "$TARGET_FOLDER/bin/runtime";
		git clone --single-branch --branch master --depth 1 "$REPO_LYCHEEJS_RUNTIME" "$TARGET_FOLDER/bin/runtime";
		_check_or_exit $?;

		echo " (L)   cd $TARGET_FOLDER/bin/runtime";
		echo " (L)   unzip -nqq ../runtime.zip";
		cd $TARGET_FOLDER/bin/runtime;
		unzip -nqq ../runtime.zip;
		_check_or_exit $?;

		chmod +x $TARGET_FOLDER/bin/runtime/bin/*.sh     2> /dev/null;
		chmod +x $TARGET_FOLDER/bin/runtime/*/update.sh  2> /dev/null;
		chmod +x $TARGET_FOLDER/bin/runtime/*/package.sh 2> /dev/null;

		# XXX: Keep runtime.zip for continues after fails
		# rm $TARGET_FOLDER/bin/runtime.zip;

	fi;



	#
	# UPDATE lycheejs
	#

	echo " (L) ";
	echo " (L) > Updating lychee.js Engine ...";
	echo " (L)   cd $TARGET_FOLDER";
	echo " (L)   git checkout development";
	cd $TARGET_FOLDER;
	git checkout development;
	_check_or_exit $?;

	sed -i 's|2[0-9][0-9][0-9]-Q[1-4]|'$TARGET_VERSION'|g' ./README.md;
	sed -i 's|2[0-9][0-9][0-9]-Q[1-4]|'$TARGET_VERSION'|g' ./libraries/crux/source/lychee.js;

	readme_diff=$(git diff README.md);
	lychee_diff=$(git diff ./libraries/crux/source/lychee.js);

	if [ "$readme_diff" != "" ] || [ "$lychee_diff" != "" ]; then

		echo " (L)   cd $TARGET_FOLDER";
		echo " (L)   git add ./README.md";
		echo " (L)   git add ./libraries/crux/source/lychee.js";
		cd $TARGET_FOLDER;
		git add ./README.md;
		git add ./libraries/crux/source/lychee.js;

		echo " (L)   cd $TARGET_FOLDER";
		echo " (L)   git commit -m \":rainbow: lychee.js $TARGET_VERSION release\"";
		cd $TARGET_FOLDER;
		git commit -m ":rainbow: lychee.js $TARGET_VERSION release";
		_check_or_exit $?;

	fi;

	echo " (L)   cd $TARGET_FOLDER";
	echo " (L)   git checkout master";
	cd $TARGET_FOLDER;
	git checkout master;
	_check_or_exit $?;

	echo " (L)   cd $TARGET_FOLDER";
	echo " (L)   git merge --squash --no-commit development";
	cd $TARGET_FOLDER;
	git merge --squash --no-commit development;
	_check_or_exit $?;

	echo " (L)   cd $TARGET_FOLDER";
	echo " (L)   git commit -m \":balloon: lychee.js $TARGET_VERSION release\"";
	cd $TARGET_FOLDER;
	git commit -m ":balloon: lychee.js $TARGET_VERSION release";
	_check_or_exit $?;

	echo " (L)   cd $TARGET_FOLDER";
	echo " (L)   git checkout development";
	cd $TARGET_FOLDER;
	git checkout development;
	_check_or_exit $?;

	echo " (L)   cd $TARGET_FOLDER";
	echo " (L)   export LYCHEEJS_ROOT=\"$TARGET_FOLDER\"";
	echo " (L)   bash $TARGET_FOLDER/bin/configure.sh";
	cd $TARGET_FOLDER;
	export LYCHEEJS_ROOT="$TARGET_FOLDER";
	bash $TARGET_FOLDER/bin/configure.sh;
	_check_or_exit $?;



	#
	# UPDATE lycheejs-runtime
	#

	echo " (L) > Updating lychee.js Runtimes ...";
	echo " (L)   cd $TARGET_FOLDER/bin/runtime";
	echo " (L)   export LYCHEEJS_ROOT=\"$TARGET_FOLDER\"";
	echo " (L)   bash $TARGET_FOLDER/bin/runtime/bin/do-update.sh";
	cd $TARGET_FOLDER/bin/runtime;
	export LYCHEEJS_ROOT="$TARGET_FOLDER";
	bash $TARGET_FOLDER/bin/runtime/bin/do-update.sh;
	_check_or_exit $?;

	echo " (L)   cd $TARGET_FOLDER/bin/runtime";
	echo " (L)   bash $TARGET_FOLDER/bin/runtime/bin/package.sh";
	cd $TARGET_FOLDER/bin/runtime;
	bash $TARGET_FOLDER/bin/runtime/bin/package.sh;
	_check_or_exit $?;



	#
	# UPDATE and FERTILIZE lycheejs-library
	#

	if [ ! -d "$TARGET_FOLDER/projects/lycheejs-library" ]; then

		echo " (L) ";
		echo " (L) > Initializing lychee.js Library ...";
		echo " (L)   cd $TARGET_FOLDER";
		echo " (L)   git clone --single-branch --branch master $REPO_LYCHEEJS_LIBRARY $TARGET_FOLDER/projects/lycheejs-library";
		cd $TARGET_FOLDER;
		git clone --single-branch --branch master $REPO_LYCHEEJS_LIBRARY $TARGET_FOLDER/projects/lycheejs-library;
		_check_or_exit $?;

	else

		echo " (L) ";
		echo " (L) > Updating lychee.js Library ...";
		echo " (L)   cd $TARGET_FOLDER/projects/lycheejs-library";
		echo " (L)   git checkout master";
		cd "$TARGET_FOLDER/projects/lycheejs-library";
		git checkout master;
		_check_or_exit $?;

		echo " (L)   cd $TARGET_FOLDER/projects/lycheejs-library";
		echo " (L)   git fetch --all";
		echo " (L)   git reset \"origin/master\" --hard";
		cd "$TARGET_FOLDER/projects/lycheejs-library";
		git fetch --all;
		git reset "origin/master" --hard;
		_check_or_exit $?;

	fi;

	echo " (L)   cd $TARGET_FOLDER";
	echo " (L)   export LYCHEEJS_ROOT=\"$TARGET_FOLDER\"";
	echo " (L)   $LYCHEEJS_FERTILIZER fertilize /projects/lycheejs-library";
	cd $TARGET_FOLDER;
	export LYCHEEJS_ROOT="$TARGET_FOLDER";
	$LYCHEEJS_FERTILIZER fertilize /projects/lycheejs-library;
	_check_or_exit $?;



	#
	# FERTILIZE lycheejs-bundle
	#

	if [ ! -d "$TARGET_FOLDER/projects/lycheejs-bundle" ]; then

		echo " (L) ";
		echo " (L) > Initializing lychee.js Bundle ...";
		echo " (L)   cd $TARGET_FOLDER";
		echo " (L)   git clone --single-branch --branch master $REPO_LYCHEEJS_BUNDLE $TARGET_FOLDER/projects/lycheejs-bundle";
		cd $TARGET_FOLDER;
		git clone --single-branch --branch master $REPO_LYCHEEJS_BUNDLE $TARGET_FOLDER/projects/lycheejs-bundle;
		_check_or_exit $?;

	else

		echo " (L) ";
		echo " (L) > Updating lychee.js Bundle ...";
		echo " (L)   cd $TARGET_FOLDER/projects/lycheejs-bundle";
		echo " (L)   git checkout master";
		cd "$TARGET_FOLDER/projects/lycheejs-bundle";
		git checkout master;
		_check_or_exit $?;

		echo " (L)   cd $TARGET_FOLDER/projects/lycheejs-bundle";
		echo " (L)   git fetch --all";
		echo " (L)   git reset \"origin/master\" --hard";
		cd "$TARGET_FOLDER/projects/lycheejs-bundle";
		git fetch --all;
		git reset "origin/master" --hard;
		_check_or_exit $?;

	fi;

	echo " (L)   cd $TARGET_FOLDER";
	echo " (L)   export LYCHEEJS_ROOT=\"$TARGET_FOLDER\"";
	echo " (L)   $LYCHEEJS_FERTILIZER fertilize /projects/lycheejs-bundle";
	cd $TARGET_FOLDER;
	export LYCHEEJS_ROOT="$TARGET_FOLDER";
	$LYCHEEJS_FERTILIZER fertilize /projects/lycheejs-bundle;
	_check_or_exit $?;



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

	echo " (L) ";
	echo " (L) Publishing lychee.js Engine ...";

	if [ "$SIMULATION" == "false" ]; then

		echo " (L)   cd $TARGET_FOLDER";
		echo " (L)   git checkout development";
		cd $TARGET_FOLDER;
		git checkout development;
		_check_or_exit $?;

		echo " (L)   cd $TARGET_FOLDER";
		echo " (L)   git push origin development";
		cd $TARGET_FOLDER;
		git push origin development;
		_check_or_exit $?;

		echo " (L)   cd $TARGET_FOLDER";
		echo " (L)   git checkout master";
		cd $TARGET_FOLDER;
		git checkout master;
		_check_or_exit $?;

		echo " (L)   cd $TARGET_FOLDER";
		echo " (L)   git push origin master";
		cd $TARGET_FOLDER;
		git push origin master;
		_check_or_exit $?;

	else
		echo -e "\e[43m\e[97m (W) SIMULATION SKIP \e[0m";
	fi;



	#
	# PUBLISH lycheejs-library
	#

	echo " (L) ";
	echo " (L) Publishing lychee.js Library ...";

	if [ "$SIMULATION" == "false" ]; then

		echo " (L)   cd $TARGET_FOLDER/projects/lycheejs-library";
		echo " (L)   bash $TARGET_FOLDER/projects/lycheejs-library/bin/publish.sh";
		cd $TARGET_FOLDER/projects/lycheejs-library;
		bash $TARGET_FOLDER/projects/lycheejs-library/bin/publish.sh;
		_check_or_exit $?;

	else
		echo -e "\e[43m\e[97m (W) SIMULATION SKIP \e[0m";
	fi;



	#
	# PUBLISH lycheejs-runtime
	#

	if [ "$SIMULATION" == "false" ]; then

		echo " (L)   cd $TARGET_FOLDER/bin/runtime";
		echo " (L)   bash $TARGET_FOLDER/bin/runtime/bin/publish.sh";
		cd $TARGET_FOLDER/bin/runtime;
		bash $TARGET_FOLER/bin/runtime/bin/publish.sh;
		_check_or_exit $?;

	else
		echo -e "\e[43m\e[97m (W) SIMULATION SKIP \e[0m";
	fi;



	#
	# PUBLISH lycheejs-bundle
	#

	if [ "$SIMULATION" == "false" ]; then

		echo " (L)   cd $TARGET_FOLDER/projects/lycheejs-bundle";
		echo " (L)   bash $TARGET_FOLDER/projects/lycheejs-bundle/bin/publish.sh";
		cd $TARGET_FOLDER/projects/lycheejs-bundle;
		bash $TARGET_FOLDER/projects/lycheejs-bundle/bin/publish.sh;
		_check_or_exit $?;

	else
		echo -e "\e[43m\e[97m (W) SIMULATION SKIP \e[0m";
	fi;


	if [ "$SIMULATION" == "true" ]; then

		echo " (L) ";
		echo -e "\e[42m\e[97m (I) SUCCESS \e[0m";
		echo -e "\e[42m\e[97m (I) lychee.js Release Simulation is complete. \e[0m";
		echo " (L) ";

	else

		echo " (L) ";
		echo -e "\e[42m\e[97m (I) SUCCESS \e[0m";
		echo -e "\e[42m\e[97m (I) lychee.js Release is complete. \e[0m";
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
