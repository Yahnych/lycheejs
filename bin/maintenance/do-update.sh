#!/bin/bash

USER_WHO=`whoami`;
USER_LOG=`logname 2>/dev/null`;
LYCHEEJS_ROOT=$(cd "$(dirname "$0")/../../"; pwd);
LYCHEEJS_CHANGE=$(cd $LYCHEEJS_ROOT && git status --porcelain);
LYCHEEJS_SYMBOL=$(cd $LYCHEEJS_ROOT && git symbolic-ref HEAD 2> /dev/null);
LYCHEEJS_BRANCH=${LYCHEEJS_SYMBOL##refs/heads/};


SELECTION_BRANCH="development";

if [ "$1" == "--master" ] || [ "$1" == "--branch=master" ]; then
	SELECTION_BRANCH="master";
fi;

ALWAYS_YES="false";

if [ "$1" == "--yes" ] || [ "$1" == "-y" ] || [ "$2" == "--yes" ] || [ "$2" == "-y" ]; then
	ALWAYS_YES="true";
fi;


RUNTIME_FILE="lycheejs-runtime.zip";

if [ "$1" == "--only-node" ] || [ "$2" == "--only-node" ] || [ "$3" == "--only-node" ]; then
	RUNTIME_FILE="lycheejs-runtime-only-node.zip";
fi;


if [ "$USER_WHO" == "root" ]; then

	echo -e "\e[41m\e[97m";
	echo " (E) You are root. Exit sudo/su shell and  ";
	echo "     Use \"./bin/maintenance/do-update.sh\". ";
	echo -e "\e[0m";

	exit 1;

elif [ "$LYCHEEJS_CHANGE" != "" ]; then

	echo " (L) ";
	echo -e "\e[42m\e[97m (I) lychee.js Update Tool \e[0m";
	echo " (L) ";
	echo -e "\e[41m\e[97m";
	echo " (E) Cannot update when git has local changes.             ";
	echo "     Please commit and push, this tool resets the history. ";
	echo -e "\e[0m";

	exit 1;

else

	if [ "$ALWAYS_YES" == "true" ]; then

		echo " (L) ";
		echo -e "\e[42m\e[97m (I) lychee.js Update Tool \e[0m";
		echo " (L) ";
		echo " (L) Selected update channel: $SELECTION_BRANCH";
		echo " (L) ";

	else

		echo " (L) ";
		echo -e "\e[42m\e[97m (I) lychee.js Update Tool \e[0m";
		echo " (L) ";
		echo " (L) All your data are belong to us.                ";
		echo " (L) This tool updates lychee.js.                   ";
		echo " (L) ";
		echo " (L) ";
		echo " (L) Please select the update channel:              ";
		echo " (L) ";
		echo " (L) 1) development (recommended)                   ";
		echo " (L)    Daily update cycles, more unstable.         ";
		echo " (L) ";
		echo " (L) 2) master                                      ";
		echo " (L)    Quarter-yearly release cycles, more stable. ";
		echo " (L) ";

		read -p " (L) Continue (1/2)? " -r

		if [[ $REPLY =~ ^[1]$ ]]; then
			SELECTION_BRANCH="development";
		elif [[ $REPLY =~ ^[2]$ ]]; then
			SELECTION_BRANCH="master";
		else
			echo -e "\e[41m\e[97m (E) INVALID SELECTION \e[0m";
			exit 1;
		fi;

	fi;



	if [ "$LYCHEEJS_BRANCH" != "$SELECTION_BRANCH" ]; then

		cd $LYCHEEJS_ROOT;

		git checkout $SELECTION_BRANCH;

		if [ $? != 0 ]; then

			git checkout -b $SELECTION_BRANCH;

			has_upstream=$(git remote -v | grep upstream | grep "(fetch)");

			if [ "$has_upstream" != "" ]; then
				git fetch upstream;
				git pull -f;
			else
				git fetch origin;
				git pull -f;
			fi;

		fi;

	fi;



	echo " (L) ";
	echo " (L) > Updating lychee.js Engine ...";

	echo " (L)   cd $LYCHEEJS_ROOT";
	echo " (L)   git fetch --all";
	cd $LYCHEEJS_ROOT;
	git fetch --all;

	if [ $? == 0 ]; then

		echo " (L)   cd $LYCHEEJS_ROOT";
		echo " (L)   git reset \"origin/$SELECTION_BRANCH\" --hard";
		cd $LYCHEEJS_ROOT;
		git reset "origin/$SELECTION_BRANCH" --hard;

		if [ $? == 0 ]; then
			echo -e "\e[42m\e[97m (I) > SUCCESS \e[0m";
		else
			echo -e "\e[41m\e[97m (E) > FAILURE \e[0m";
			exit 1;
		fi;

	else

		echo -e "\e[41m\e[97m (E) > FAILURE \e[0m";
		exit 1;

	fi;



	# XXX: Allow manual download of lycheejs-runtime.zip
	if [ -f $LYCHEEJS_ROOT/bin/runtime.zip ] && [ ! -d $LYCHEEJS_ROOT/bin/runtime ]; then

		DOWNLOAD_SUCCESS=1;

		mkdir $LYCHEEJS_ROOT/bin/runtime;
		echo " (L)   cd $LYCHEEJS_ROOT/bin/runtime";
		echo " (L)   unzip -qq ../runtime.zip";
		cd $LYCHEEJS_ROOT/bin/runtime;
		unzip -qq ../runtime.zip;

		if [ $? != 0 ]; then
			DOWNLOAD_SUCCESS=0;
		fi;

		if [ "$DOWNLOAD_SUCCESS" == "1" ]; then
			chmod +x $LYCHEEJS_ROOT/bin/runtime/bin/*.sh     2> /dev/null;
			chmod +x $LYCHEEJS_ROOT/bin/runtime/*/update.sh  2> /dev/null;
			chmod +x $LYCHEEJS_ROOT/bin/runtime/*/package.sh 2> /dev/null;
		fi;


		if [ "$DOWNLOAD_SUCCESS" == "1" ]; then
			echo -e "\e[42m\e[97m (I) > SUCCESS \e[0m";
		else
			echo -e "\e[41m\e[97m (E) > FAILURE \e[0m";
			exit 1;
		fi;

	# XXX: Automated download of lycheejs-runtime.zip
	elif [ ! -d $LYCHEEJS_ROOT/bin/runtime ]; then

		echo " (L) > Installing lychee.js Runtimes ...";
		echo " (L)   (This might take a while)";

		DOWNLOAD_URL=$(curl -s https://api.github.com/repos/Artificial-Engineering/lycheejs-runtime/releases/latest | grep "browser_download_url" | grep "$RUNTIME_FILE" | head -n 1 | cut -d'"' -f4);
		DOWNLOAD_SUCCESS=0;

		if [ "$DOWNLOAD_URL" != "" ]; then

			DOWNLOAD_SUCCESS=1;

			cd $LYCHEEJS_ROOT/bin;
			echo " (L)   curl --location --retry 8 --retry-connrefused --progress-bar $DOWNLOAD_URL > $LYCHEEJS_ROOT/bin/runtime.zip";
			curl --location --retry 8 --retry-connrefused --progress-bar $DOWNLOAD_URL > $LYCHEEJS_ROOT/bin/runtime.zip;

			if [ $? != 0 ]; then
				DOWNLOAD_SUCCESS=0;
			fi;

			if [ "$DOWNLOAD_SUCCESS" == "1" ]; then

				mkdir $LYCHEEJS_ROOT/bin/runtime;
				echo " (L)   cd $LYCHEEJS_ROOT/bin/runtime";
				echo " (L)   unzip -qq ../runtime.zip";
				cd $LYCHEEJS_ROOT/bin/runtime;
				unzip -qq ../runtime.zip;

				if [ $? != 0 ]; then
					DOWNLOAD_SUCCESS=0;
				fi;

			fi;

			if [ "$DOWNLOAD_SUCCESS" == "1" ]; then
				chmod +x $LYCHEEJS_ROOT/bin/runtime/bin/*.sh     2> /dev/null;
				chmod +x $LYCHEEJS_ROOT/bin/runtime/*/update.sh  2> /dev/null;
				chmod +x $LYCHEEJS_ROOT/bin/runtime/*/package.sh 2> /dev/null;
				rm $LYCHEEJS_ROOT/bin/runtime.zip                2> /dev/null;
			else
				rm $LYCHEEJS_ROOT/bin/runtime.zip                2> /dev/null;
			fi;


			if [ "$DOWNLOAD_SUCCESS" == "1" ]; then
				echo -e "\e[42m\e[97m (I) > SUCCESS \e[0m";
			else
				echo -e "\e[41m\e[97m (E) > FAILURE \e[0m";
				exit 1;
			fi;

		fi;

	# XXX: Incremental download(s)
	else

		echo " (L) > Updating lychee.js Runtimes ...";
		echo " (L)   (This might take a while)";

		echo " (L)   cd $LYCHEEJS_ROOT/bin/runtime";
		echo " (L)   ./bin/do-update.sh";
		cd $LYCHEEJS_ROOT/bin/runtime;
		bash $LYCHEEJS_ROOT/bin/runtime/bin/do-update.sh;

		if [ $? == 0 ]; then
			echo -e "\e[42m\e[97m (I) > SUCCESS \e[0m";
		else
			echo -e "\e[41m\e[97m (E) > FAILURE \e[0m";
			exit 1;
		fi;

	fi;

fi;
