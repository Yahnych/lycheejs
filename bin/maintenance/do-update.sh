#!/bin/bash


USER_WHO=`whoami`;
USER_LOG=`logname 2>/dev/null`;

if [ "$USER_LOG" == "" ]; then

	if [ "$SUDO_USER" != "" ]; then
		USER_LOG="$SUDO_USER";
	fi;

fi;


LYCHEEJS_ROOT=$(cd "$(dirname "$0")/../../"; pwd);
LYCHEEJS_FOLDER="$LYCHEEJS_ROOT";
LYCHEEJS_BRANCH="development";
LYCHEEJS_CHANGE=$(cd $LYCHEEJS_ROOT && git status --porcelain);


if [ "$USER_WHO" == "root" ] && [ "$USER_LOG" != "root" ]; then

	echo -e "\e[41m\e[97m";
	echo " (E) You are root. Exit sudo and           ";
	echo "     Use \"./bin/maintenance/do-update.sh\". ";
	echo -e "\e[0m";

	exit 1;

elif [ "$OS" == "osx" ] && [ "$USER_WHO" == "root" ] && [ "$USER_LOG" == "root" ]; then

	echo -e "\e[41m\e[97m";
	echo " (E) You are root. Exit su shell and       ";
	echo "     Use \"./bin/maintenance/do-update.sh\". ";
	echo -e "\e[0m";

	exit 1;

elif [ "$LYCHEEJS_CHANGE" == "" ]; then

	echo " (L) ";
	echo -e "\e[42m\e[97m (I) lychee.js Update Tool \e[0m";
	echo " (L) ";
	echo " (L) All your data are belong to us.                ";
	echo " (L) This tool updates your lychee.js installation. ";
	echo " (L) ";
	echo " (L) ";
	echo " (L) Please select the update branch:               ";
	echo " (L) ";
	echo " (L) Our software bots work on and improve the      ";
	echo " (L) development branch in a quarter-hourly cycle.  ";
	echo " (L) ";
	echo " (L) 1) development (recommended)                   ";
	echo " (L)    Daily update cycles, more unstable.         ";
	echo " (L) ";
	echo " (L) 2) master                                      ";
	echo " (L)    Quarter-yearly release cycles, more stable. ";
	echo " (L) ";
	echo " (L) ";

	read -p " (L) Continue (1/2)? " -r

	if [[ $REPLY =~ ^[1]$ ]]; then
		LYCHEEJS_BRANCH="development";
	elif [[ $REPLY =~ ^[2]$ ]]; then
		LYCHEEJS_BRANCH="master";
	else
		echo -e "\e[41m\e[97m (E) INVALID SELECTION \e[0m";
		exit 1;
	fi;


	echo " (L) ";
	echo " (L) > Updating lychee.js Engine ...";

	cd $LYCHEEJS_FOLDER;

	echo " (L)   git checkout $LYCHEEJS_BRANCH";
	git checkout $LYCHEEJS_BRANCH;

	if [ $? == 0 ]; then
		echo " (L)   git fetch";
		git fetch;
	fi;

	if [ $? == 0 ]; then
		echo " (L)   git reset \"origin/$LYCHEEJS_BRANCH\" --hard";
		git reset "origin/$LYCHEEJS_BRANCH" --hard;
	fi;

	if [ $? == 0 ]; then
		echo -e "\e[42m\e[97m (I) > SUCCESS \e[0m";
	else
		echo -e "\e[41m\e[97m (E) > FAILURE \e[0m";
		exit 1;
	fi;


	if [ ! -d $LYCHEEJS_FOLDER/bin/runtime ]; then

		echo " (L) > Installing lychee.js Runtimes ...";
		echo " (L)   (This might take a while, downloading ~500MB)";

		DOWNLOAD_URL=$(curl -s https://api.github.com/repos/Artificial-Engineering/lycheejs-runtime/releases/latest | grep browser_download_url | grep lycheejs-runtime | head -n 1 | cut -d'"' -f4);
		DOWNLOAD_SUCCESS=0;

		if [ "$DOWNLOAD_URL" != "" ]; then

			DOWNLOAD_SUCCESS=1;

			cd $LYCHEEJS_FOLDER/bin;
			echo " (L)   curl -sSL $DOWNLOAD_URL > $LYCHEEJS_FOLDER/bin/runtime.zip";
			curl -sSL $DOWNLOAD_URL > $LYCHEEJS_FOLDER/bin/runtime.zip;

			if [ $? != 0 ]; then
				DOWNLOAD_SUCCESS=0;
			fi;

			if [ "$DOWNLOAD_SUCCESS" == "1" ]; then
				mkdir $LYCHEEJS_FOLDER/bin/runtime;
				echo " (L)   cd $LYCHEEJS_FOLDER/bin/runtime";
				echo " (L)   unzip -qq ../runtime.zip";
				cd $LYCHEEJS_FOLDER/bin/runtime;
				unzip -qq ../runtime.zip;
			fi;

			if [ $? != 0 ]; then
				DOWNLOAD_SUCCESS=0;
			fi;

			if [ "$DOWNLOAD_SUCCESS" == "1" ]; then
				chmod +x $LYCHEEJS_FOLDER/bin/runtime/bin/*.sh     2> /dev/null;
				chmod +x $LYCHEEJS_FOLDER/bin/runtime/*/update.sh  2> /dev/null;
				chmod +x $LYCHEEJS_FOLDER/bin/runtime/*/package.sh 2> /dev/null;
				rm $LYCHEEJS_FOLDER/bin/runtime.zip                2> /dev/null;
			fi;


			if [ "$DOWNLOAD_SUCCESS" == "1" ]; then
				echo -e "\e[42m\e[97m (I) > SUCCESS \e[0m";
			else
				echo -e "\e[41m\e[97m (E) > FAILURE \e[0m";
				exit 1;
			fi;

		fi;

	else

		echo " (L) > Updating lychee.js Runtimes ...";
		echo " (L)   (This might take a while)";

		echo " (L)   cd $LYCHEEJS_FOLDER/bin/runtime";
		echo " (L)   ./bin/do-update.sh";
		cd $LYCHEEJS_FOLDER/bin/runtime;
		./bin/do-update.sh;

		if [ $? == 0 ]; then
			echo -e "\e[42m\e[97m (I) > SUCCESS \e[0m";
		else
			echo -e "\e[41m\e[97m (E) > FAILURE \e[0m";
			exit 1;
		fi;

	fi;

else

	echo " (L) ";
	echo -e "\e[42m\e[97m (I) lychee.js Update Tool \e[0m";
	echo " (L) ";
	echo -e "\e[41m\e[97m";
	echo " (E) Cannot update when git has local changes.             ";
	echo "     Please commit and push, this tool resets the history. ";
	echo -e "\e[0m";

	exit 1;

fi;
