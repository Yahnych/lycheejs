#!/usr/bin/env bash

set -u;
set -e;


TMP_STATUS="/tmp/lycheejs-runtime.json";
GITHUB_TOKEN=$(cat "/opt/lycheejs/.github/TOKEN");
RELEASE_USER="cookiengineer";
RELEASE_REPO="lycheejs";
RELEASE_NAME=$(date +"%Y.%m.%d");
RUNTIME_ROOT=$(cd "$(dirname "$0")/../"; pwd);
ERROR_HAPPENED="false";


if [ "$GITHUB_TOKEN" != "" ]; then

	echo " (L) RELEASE lycheejs-runtime";

	cd $RUNTIME_ROOT;
	curl --silent -X POST -H "Authorization: token $GITHUB_TOKEN" -H "Content-Type: application/json" --data "{\"tag_name\":\"$RELEASE_NAME\",\"name\":\"$RELEASE_NAME\",\"prerelease\":true}" "https://api.github.com/repos/$RELEASE_USER/$RELEASE_REPO/releases" -o "$TMP_STATUS";

	if [ $? == 0 ]; then

		release_id=$(cat "$TMP_STATUS" | grep id | cut -d"," -f1 | cut -d":" -f2 | head -1 | tr -d '[[:space:]]');

		if [ "$release_id" != "\"ValidationFailed\"" ]; then

			if [ -f "$RUNTIME_ROOT/lycheejs-runtime.zip" ]; then

				echo " (L) UPLOAD lycheejs-runtime.zip for \"$release_id\" ...";

				cd $RUNTIME_ROOT;
				curl -SL --progress-bar -X POST -H "Authorization: token $GITHUB_TOKEN" -H "Content-Type: application/zip" --data-binary "@$RUNTIME_ROOT/lycheejs-runtime.zip" "https://uploads.github.com/repos/$RELEASE_USER/$RELEASE_REPO/releases/$release_id/assets?name=lycheejs-runtime.zip" &> /dev/null;

				if [ $? == 0 ]; then
					echo -e "\e[42m\e[97m (I) SUCCESS \e[39m\e[49m\e[0m";
				else
					ERROR_HAPPENED="true";
					echo -e "\e[41m\e[97m (E) UPLOAD FAILURE \e[39m\e[49m\e[0m";
				fi;

			fi;

			if [ -f "$RUNTIME_ROOT/lycheejs-runtime-only-node.zip" ]; then

				echo " (L) UPLOAD lycheejs-runtime-only-node.zip for \"$release_id\" ...";

				cd $RUNTIME_ROOT;
				curl -SL --progress-bar -X POST -H "Authorization: token $GITHUB_TOKEN" -H "Content-Type: application/zip" --data-binary "@$RUNTIME_ROOT/lycheejs-runtime-only-node.zip" "https://uploads.github.com/repos/$RELEASE_USER/$RELEASE_REPO/releases/$release_id/assets?name=lycheejs-runtime.zip" &> /dev/null;

				if [ $? == 0 ]; then
					echo -e "\e[42m\e[97m (I) SUCCESS \e[39m\e[49m\e[0m";
				else
					ERROR_HAPPENED="true";
					echo -e "\e[41m\e[97m (E) UPLOAD FAILURE \e[39m\e[49m\e[0m";
				fi;

			fi;

		else
			ERROR_HAPPENED="true";
			echo -e "\e[41m\e[97m (E) GITHUB API ERROR \e[39m\e[49m\e[0m";
		fi;

	else
		ERROR_HAPPENED="true";
		echo -e "\e[41m\e[97m (E) GITHUB API ERROR \e[39m\e[49m\e[0m";
	fi;

elif [ "$GITHUB_TOKEN" == "" ]; then

	ERROR_HAPPENED="true";
	echo -e "\e[41m\e[97m";
	echo -e " (E) Please create a GitHub Token.                           ";
	echo -e "     cd /opt/lycheejs; echo \"github-token\" > .github/TOKEN ";
	echo -e "\e[0m";

fi;



if [ "$ERROR_HAPPENED" == "false" ]; then
	echo -e "\e[42m\e[97m (I) SUCCESS \e[39m\e[49m\e[0m";
	exit 0;
else
	echo -e "\e[41m\e[97m (E) FAILURE \e[39m\e[49m\e[0m";
	exit 1;
fi;

